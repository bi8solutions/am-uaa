import {Inject, Injectable} from '@angular/core';
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
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {StorageService} from '@bi8/am-storage';
import {UaaConfig} from './uaa.config';
import {UaaService} from './uaa.service';

@Injectable()
export class UaaInterceptor implements HttpInterceptor {

  cachedRequests: Array<HttpRequest<any>> = [];
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(@Inject('UaaConfig') private config: UaaConfig,
              private uaaEventService: UaaEventService,
              private storageService: StorageService,
              private uaaService: UaaService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.config.useJwt) {
      return this.jwtIntercept(req, next);
    } else {
      return this.sessionIntercept(req, next);
    }
  }

  private sessionIntercept(req, next) {
    const xRequestedWith = req.clone({
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
        .set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache')
        .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
    });

    const observable = next.handle(xRequestedWith);

    return observable.map((event: HttpEvent<any>) => {
      return event;
    }).catch(error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && !_.endsWith(error.url, '/login')) {
          this.uaaEventService.broadcast(UaaEvent.LOGIN_REQUIRED);
          return this.uaaEventService.getEventSourceObserver().filter(event => {
            return event == UaaEvent.LOGIN_PROVIDED;
          }).concatMap(event => observable.retry(1));
        } else {
          return Observable.throw(error);
          //return Observable.empty() as Observable<HttpEvent<any>>;
        }
      }
    });

  }

  private jwtIntercept(req, next) {
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    const observable = next.handle(this.addToken(req, this.uaaService.getToken()));
    return observable.catch((error) => {
      if (error instanceof HttpErrorResponse) {
        switch ((<HttpErrorResponse>error).status) {
          case 400:
            return this.handle400Error(error, req, next);
          case 401:
            return this.handle401Error(req, next);
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

  private handle400Error(error, req, next) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return this.requireLogin(req, next);
    }

    return Observable.throw(error);
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      console.log('no refresh in progress');
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
      console.log('refresh in progress');
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
      .filter(event => event === UaaEvent.LOGIN_DIALOG_BEFORE_CLOSED)
      .switchMap(event => {
        this.isRefreshingToken = false;
        return next.handle(this.addToken(req, this.uaaService.getToken()));
      });
  }
}
