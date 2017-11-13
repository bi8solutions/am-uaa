import {Injectable, Inject} from '@angular/core';
import {UaaConfig} from './uaa.config';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {LogService, Logger} from "@bi8/am-logger";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import {UaaEventService} from "./uaa.event.service";
import {UaaEvent} from "./uaa.event";
import {StorageService} from "@bi8/am-storage";

const IDENTITY_KEY: string = '_uaa_identity_';

@Injectable()
export class UaaService {

  logger: Logger;

  constructor(@Inject('UaaConfig') private config: UaaConfig,
              private hc: HttpClient,
              private logService: LogService,
              private storageService: StorageService,
              private uaaEventService: UaaEventService) {

    this.logger = logService.getLogger(this.constructor.name);
  }

  doLogin(username: string, password: string, silent?: boolean) : Observable<any>  {
    let formBody = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.hc.post('/api/uaa/session/login', formBody, {
        headers: headers,
        responseType: 'text'
    }).map((response)=>{
      this.uaaEventService.broadcast(UaaEvent.LOGIN_SUCCESS);
      this.uaaEventService.broadcast(UaaEvent.LOGIN_PROVIDED);
      return response;
    });
  }

  doLogout(silent?: boolean) : Observable<any> {
    this.uaaEventService.broadcast(UaaEvent.LOGOUT_START);
    return this.hc.get('/api/uaa/session/logout', {
      responseType: 'text'
    }).map((response)=>{
      this.storageService.remove(IDENTITY_KEY);
      this.uaaEventService.broadcast(UaaEvent.LOGOUT_SUCCESS);
    });
  }

  getIdentity(refresh?: boolean, silent?: boolean) : Observable<any> | any {
    if (refresh){
      this.uaaEventService.broadcast(UaaEvent.LOAD_IDENTITY_START);
      return this.hc.get('/api/uaa/session/identity').map((response)=>{
        this.storageService.set(IDENTITY_KEY, response);
        this.uaaEventService.broadcast(UaaEvent.LOAD_IDENTITY_SUCCESS);
        return response;
      });
    } else {
      return this.storageService.get(IDENTITY_KEY);
    }
  }
}
