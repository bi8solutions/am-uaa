import {Injectable, Inject} from '@angular/core';
import {UaaConfig} from './uaa.config';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {LogService, Logger} from '@bi8/am-logger';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import {UaaEventService} from './uaa.event.service';
import {UaaEvent} from './uaa.event';
import {StorageService} from '@bi8/am-storage';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';


@Injectable()
export class UaaService {

  IDENTITY_KEY = '_uaa_identity_';
  TOKEN_KEY = 'id_token';
  REFRESH_KEY = 'refresh_token';
  TOKEN_EXPIRE_KEY = 'expires_at';
  REFRESH_EXPIRE_KEY = 'refresh_expires_at';

  GRANT_TYPE = 'password';
  CLIENT_ID = 'webapp';

  logger: Logger;

  constructor(@Inject('UaaConfig') private config: UaaConfig,
              private hc: HttpClient,
              private logService: LogService,
              private storageService: StorageService,
              private uaaEventService: UaaEventService) {

    this.logger = logService.getLogger(this.constructor.name);
  }

  getToken() {
    return this.storageService.get(this.TOKEN_KEY, null);
  }

  doLogin(username: string, password: string): Observable<any> {
    const formBody = `grant_type=${this.GRANT_TYPE}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&client=${encodeURIComponent(this.CLIENT_ID)}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${this.CLIENT_ID}:`)}`
    });

    return this.hc.post<any>('/oauth/token', formBody, {headers: headers})
      .map(res => {
        this.setSession(res);
        return res;
      });
  }

  doRefresh(): Observable<any> {
    const refreshToken = this.storageService.get(this.REFRESH_KEY);
    const formBody = `grant_type=refresh_token&refresh_token=${refreshToken}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${this.CLIENT_ID}:`)}`
    });

    return this.hc.post<any>('/oauth/token', formBody, {headers: headers})
      .map(res => {
        this.setSession(res);
        return res;
      });
  }

  private setSession(authResult: any) {
    const access_token = authResult.access_token;
    const refresh_token = authResult.refresh_token;

    const tok_decoded = jwt_decode(access_token);
    const ref_decoded = jwt_decode(refresh_token);
    const expiresAt = moment.unix(tok_decoded.exp);
    const refreshExpiresAt = moment.unix(ref_decoded.exp);

    this.storageService.set(this.TOKEN_KEY, access_token);
    this.storageService.set(this.REFRESH_KEY, refresh_token);
    this.storageService.set(this.TOKEN_EXPIRE_KEY, JSON.stringify(expiresAt.valueOf()));
    this.storageService.set(this.REFRESH_EXPIRE_KEY, JSON.stringify(refreshExpiresAt.valueOf()));
  }

  doLogout() {
    this.uaaEventService.broadcast(UaaEvent.LOGOUT_START);
    this.storageService.remove(this.TOKEN_KEY);
    this.storageService.remove(this.REFRESH_KEY);
    this.storageService.remove(this.TOKEN_EXPIRE_KEY);
    this.storageService.remove(this.REFRESH_EXPIRE_KEY);

    this.uaaEventService.broadcast(UaaEvent.LOGOUT_SUCCESS);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration(this.TOKEN_EXPIRE_KEY));
  }

  refreshValid() {
    return moment().isBefore(this.getExpiration(this.REFRESH_EXPIRE_KEY));
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration(key: string) {
    const expiration = this.storageService.get(key, 0);
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getIdentity(refresh?: boolean, silent?: boolean): Observable<any> | any {
    if (this.isLoggedIn() || this.refreshValid()) {
      this.uaaEventService.broadcast((UaaEvent.LOAD_IDENTITY_START));
      const identity = this.storageService.get(this.TOKEN_KEY);
      return jwt_decode(identity);
    } else {
      return null;
    }
  }
}
