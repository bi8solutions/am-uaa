import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import * as _ from 'lodash';
import {UaaEventService} from './uaa.event.service';
import {UaaEvent} from './uaa.event';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import {UaaService} from './uaa.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {StorageService} from '@bi8/am-storage';

@Injectable()
export class UaaInterceptor implements HttpInterceptor {

  cachedRequests: Array<HttpRequest<any>> = [];
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private uaaEventService: UaaEventService,
              private storageService: StorageService,
              private uaaService: UaaService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.has('Authorization')) {
      return next.handle(req.clone());
    }

    const observable = next.handle(this.addToken(req, this.uaaService.getToken()));
    return observable.catch((error) => {
      if (error instanceof HttpErrorResponse) {
        switch ((<HttpErrorResponse>error).status) {
          case 400:
            return this.handle400Error(error, req, observable);
          case 401:
            return this.handle401Error(req, next, observable);
          default:
            return Observable.throw(error);
        }
      } else {
        return Observable.throw(error);
      }
    });
  }

  private addToken(req: HttpRequest<any>, token: String): HttpRequest<any> {
    return req.clone({setHeaders: {'Authorization': `Bearer ${token}`}});
  }

  private handle400Error(error, req, observable) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return this.requireLogin(req, observable);
    }

    return Observable.throw(error);
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler, observable: Observable<any>) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      return this.uaaService.doRefresh().switchMap(res => {
        const newToken = this.uaaService.getToken();
        if (newToken) {
          this.tokenSubject.next(newToken);
          return next.handle(this.addToken(req, newToken));
        }

        // If we don't get a new token, we are in trouble so logout.
        return this.requireLogin(req, next);
      }).catch((error) => {
        return this.requireLogin(req, next);
      }).finally(() => {
        this.isRefreshingToken = false;
      });
    } else {
      return this.tokenSubject
        .filter(token => token != null)
        .take(1)
        .switchMap(token => {
          return next.handle(this.addToken(req, token));
        });
    }
  }

  private requireLogin(req, next): Observable<any> {
    this.uaaService.doLogout();
    this.uaaEventService.broadcast(UaaEvent.LOGIN_REQUIRED);
    return this.uaaEventService.getEventSourceObserver()
      .filter(event => event === UaaEvent.LOGIN_PROVIDED)
      .switchMap(event => {
        return next.handle(this.addToken(req, next));
      });
  }
}
