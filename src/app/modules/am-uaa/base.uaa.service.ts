import {Injectable, Inject} from '@angular/core';
import {UaaConfig} from './uaa.config';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {LogService, Logger} from '@bi8/am-logger';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {UaaEventService} from './uaa.event.service';
import {UaaEvent} from './uaa.event';
import {StorageService} from '@bi8/am-storage';
import {UaaService} from './uaa.service';

const IDENTITY_KEY: string = '_uaa_identity_';

export class BaseUaaService {

  logger: Logger;

  constructor(private uaaConfig: UaaConfig,
              private httpClient: HttpClient,
              private loggingService: LogService,
              private storeService: StorageService,
              private eventService: UaaEventService) {

    this.logger = loggingService.getLogger(this.constructor.name);
  }

  doLogin(username: string, password: string, silent?: boolean): Observable<any> {

    const formBody = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.post('/api/uaa/session/login', formBody, {
      headers: headers,
      responseType: 'text'
    }).map((response) => {
      this.eventService.broadcast(UaaEvent.LOGIN_SUCCESS);
      this.eventService.broadcast(UaaEvent.LOGIN_PROVIDED);
      return response;
    });
  }

  doLogout(silent?: boolean): Observable<any> {

    this.eventService.broadcast(UaaEvent.LOGOUT_START);
    return this.httpClient.get('/api/uaa/session/logout', {
      responseType: 'text'
    }).map((response) => {
      this.storeService.remove(IDENTITY_KEY);
      this.eventService.broadcast(UaaEvent.LOGOUT_SUCCESS);
    });
  }


  getIdentity(refresh?: boolean, silent?: boolean): Observable<any> | any {
    if (refresh) {
      this.eventService.broadcast(UaaEvent.LOAD_IDENTITY_START);
      return this.httpClient.get('/api/uaa/session/identity').map((response) => {
        this.storeService.set(IDENTITY_KEY, response);
        this.eventService.broadcast(UaaEvent.LOAD_IDENTITY_SUCCESS);
        return response;
      });
    } else {
      return this.storeService.get(IDENTITY_KEY);
    }
  }
}
