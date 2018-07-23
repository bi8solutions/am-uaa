import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import {UaaEventService} from './uaa.event.service';
import {UaaEvent} from './uaa.event';
import {StorageService} from '@bi8/am-storage';
import {UaaService} from './uaa.service';
import {JwtService} from './jwt.service';


@Injectable()
export class UaaJwtService implements UaaService {

  constructor(private hc: HttpClient,
              private storageService: StorageService,
              private uaaEventService: UaaEventService,
              private jwtService: JwtService) {
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
        this.uaaEventService.broadcast(UaaEvent.LOGIN_SUCCESS);
        this.uaaEventService.broadcast(UaaEvent.LOGIN_PROVIDED);
        return res;
      });
  }

  doLogout(silent?: boolean) {
    this.uaaEventService.broadcast(UaaEvent.LOGOUT_START);
    return Observable.defer(() => this.jwtService.removeToken());
  }

  getIdentity(refresh?: boolean, silent?: boolean): Observable<any> | any {
    if (this.jwtService.isLoggedIn() || this.jwtService.refreshValid()) {
      this.uaaEventService.broadcast((UaaEvent.LOAD_IDENTITY_START));
      let identity = this.storageService.get(this.jwtService.TOKEN_KEY);
      identity = this.jwtService.decode(identity);
      if (refresh) {
        return Observable.of(identity);
      } else {
        return identity;
      }
    } else {
      this.uaaEventService.broadcast(UaaEvent.LOGIN_REQUIRED);
      return this.uaaEventService.getEventSourceObserver()
        .filter(event => event === UaaEvent.LOGIN_PROVIDED)
        .switchMap(event => {
          const identity = this.storageService.get(this.jwtService.TOKEN_KEY);
          return Observable.of(this.jwtService.decode(identity));
        });
    }
  }
}
