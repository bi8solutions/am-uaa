import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {LogService, Logger} from '@bi8/am-logger';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import {UaaEventService} from './uaa.event.service';
import {UaaEvent} from './uaa.event';
import {StorageService} from '@bi8/am-storage';
import {UaaService} from './uaa.service';
import {UaaConfigService} from './uaa.config.service';
import {JwtService} from './jwt.service';


@Injectable()
export class UaaJwtService implements UaaService {

  logger: Logger;

  constructor(private hc: HttpClient,
              private logService: LogService,
              private storageService: StorageService,
              private uaaEventService: UaaEventService,
              private jwtService: JwtService) {
    this.logger = logService.getLogger(this.constructor.name);
  }


  doLogin(username: string, password: string): Observable<any> {
    const formBody = `grant_type=${this.jwtService.GRANT_TYPE}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&client=${encodeURIComponent(this.jwtService.CLIENT_ID)}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${this.jwtService.CLIENT_ID}:${this.jwtService.CLIENT_PASSWORD}`)}`
    });

    return this.hc.post<any>('/oauth/token', formBody, {headers: headers})
      .map(res => {
        this.jwtService.setSession(res);
        return res;
      });
  }

  doLogout(silent?: boolean) {
    this.uaaEventService.broadcast(UaaEvent.LOGOUT_START);
    return Observable.of(() => {
      this.storageService.remove(this.jwtService.TOKEN_KEY);
      this.storageService.remove(this.jwtService.REFRESH_KEY);
      this.storageService.remove(this.jwtService.TOKEN_EXPIRE_KEY);
      this.storageService.remove(this.jwtService.REFRESH_EXPIRE_KEY);
      return true;
    }).map(res => {
      this.uaaEventService.broadcast(UaaEvent.LOGOUT_SUCCESS);
    });
  }

  getIdentity(refresh?: boolean, silent?: boolean): Observable<any> | any {
    if (this.jwtService.isLoggedIn() || this.jwtService.refreshValid()) {
      this.uaaEventService.broadcast((UaaEvent.LOAD_IDENTITY_START));
      const identity = this.storageService.get(this.jwtService.TOKEN_KEY);
      return Observable.of(this.jwtService.decode(identity));
    } else {
      this.uaaEventService.broadcast(UaaEvent.LOGIN_REQUIRED);
      return this.uaaEventService.getEventSourceObserver()
        .filter(event => event === UaaEvent.LOGIN_DIALOG_BEFORE_CLOSED)
        .switchMap(event => {
          const identity = this.storageService.get(this.jwtService.TOKEN_KEY);
          return Observable.of(this.jwtService.decode(identity));
        });
    }
  }
}
