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
import {BaseUaaService} from './base.uaa.service';


@Injectable()
export class UaaService extends BaseUaaService {

  TOKEN_KEY = 'id_token';
  REFRESH_KEY = 'refresh_token';
  TOKEN_EXPIRE_KEY = 'expires_at';
  REFRESH_EXPIRE_KEY = 'refresh_expires_at';

  GRANT_TYPE: string;
  CLIENT_ID: string;

  logger: Logger;

  constructor(@Inject('UaaConfig') private config: UaaConfig,
              private hc: HttpClient,
              private logService: LogService,
              private storageService: StorageService,
              private uaaEventService: UaaEventService) {
    super(config, hc, logService, storageService, uaaEventService);
    this.logger = logService.getLogger(this.constructor.name);

    this.GRANT_TYPE = config.grantType == null ? 'password' : config.grantType;
    this.CLIENT_ID = config.clientID == null ? 'webapp' : config.clientID;
  }

  getToken() {
    return this.storageService.get(this.TOKEN_KEY, null);
  }

  doLogin(username: string, password: string): Observable<any> {
    if (!this.config.useJwt) {
      return super.doLogin(username, password);
    }

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

  doLogout(silent?: boolean) {
    if (!this.config.useJwt) {
      return super.doLogout(silent);
    }

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
    if (!this.config.useJwt) {
      return super.getIdentity(refresh, silent);
    }

    if (this.isLoggedIn() || this.refreshValid()) {
      this.uaaEventService.broadcast((UaaEvent.LOAD_IDENTITY_START));
      const identity = this.storageService.get(this.TOKEN_KEY);
      return Observable.of(jwt_decode(identity));
    } else {
      this.uaaEventService.broadcast(UaaEvent.LOGIN_REQUIRED);
      return this.uaaEventService.getEventSourceObserver()
        .filter(event => event === UaaEvent.LOGIN_DIALOG_BEFORE_CLOSED)
        .switchMap(event => {
          const identity = this.storageService.get(this.TOKEN_KEY);
          return Observable.of(jwt_decode(identity));
        });
    }
  }
}
