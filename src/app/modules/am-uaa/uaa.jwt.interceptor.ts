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
import {UaaConfigService} from './uaa.config.service';
import {JwtService} from './jwt.service';
import {UaaService} from './uaa.service';

@Injectable()
export class UaaJwtInterceptor implements HttpInterceptor {

  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private uaaEventService: UaaEventService,
              private storageService: StorageService,
              private jwtService: JwtService,
              private uaaService: UaaService,
              private configService: UaaConfigService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.configService.useJwt) {
      return next.handle(req);
    }
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    const observable = next.handle(this.addToken(req, this.jwtService.getToken()));
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
      return this.requireLogin(req, next);
    }

    return Observable.throw(error);
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      this.tokenSubject.next(null);
      return this.jwtService.doRefresh().switchMap(res => {
        const newToken = this.jwtService.getToken();
        if (newToken) {
          this.tokenSubject.next(newToken);
          return next.handle(this.addToken(req, newToken));
        }

        return this.requireLogin(req, next);
      }).catch(error => {
        return this.handle400Error(error, req, next);
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
        this.isRefreshingToken = false;
        return next.handle(this.addToken(req, this.jwtService.getToken()));
      });
  }
}
