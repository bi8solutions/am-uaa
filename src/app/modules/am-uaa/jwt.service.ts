import {Injectable} from '@angular/core';
import {StorageService} from '@bi8/am-storage';
import * as jwt_decode from 'jwt-decode';
import {UaaConfigService} from './uaa.config.service';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class JwtService {


  TOKEN_KEY = 'id_token';
  REFRESH_KEY = 'refresh_token';
  TOKEN_EXPIRE_KEY = 'expires_at';
  REFRESH_EXPIRE_KEY = 'refresh_expires_at';

  GRANT_TYPE: string;
  CLIENT_ID: string;
  CLIENT_PASSWORD: string;

  constructor(private hc: HttpClient,
              private storageService: StorageService,
              private config: UaaConfigService) {

    this.GRANT_TYPE = config.grantType == null ? 'password' : config.grantType;
    this.CLIENT_ID = config.clientID == null ? 'webapp' : config.clientID;
    this.CLIENT_PASSWORD = config.clientPassword == null ? '' : config.clientPassword;
  }

  decode(token) {
    return jwt_decode(token);
  }

  getToken() {
    return this.storageService.get(this.TOKEN_KEY, null);
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

  setSession(authResult: any) {
    const access_token = authResult.access_token;
    const refresh_token = authResult.refresh_token;

    const tok_decoded = this.decode(access_token);
    const ref_decoded = this.decode(refresh_token);
    const expiresAt = moment.unix(tok_decoded.exp);
    const refreshExpiresAt = moment.unix(ref_decoded.exp);

    this.storageService.set(this.TOKEN_KEY, access_token);
    this.storageService.set(this.REFRESH_KEY, refresh_token);
    this.storageService.set(this.TOKEN_EXPIRE_KEY, JSON.stringify(expiresAt.valueOf()));
    this.storageService.set(this.REFRESH_EXPIRE_KEY, JSON.stringify(refreshExpiresAt.valueOf()));
  }
}
