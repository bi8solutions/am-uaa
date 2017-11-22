import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import * as _ from 'lodash';
import {UaaEventService} from "./uaa.event.service";
import {UaaEvent} from "./uaa.event";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/throw';

@Injectable()
export class UaaInterceptor implements HttpInterceptor {

  cachedRequests: Array<HttpRequest<any>> = [];

  constructor(private uaaEventService: UaaEventService){
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const xRequestedWith = req.clone({headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache')
      .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
    });
    let observable = next.handle(xRequestedWith);

    return observable.map((event: HttpEvent<any>) => {
      return event;
    }).catch(error =>{
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
}
