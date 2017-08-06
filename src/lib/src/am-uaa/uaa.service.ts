import {Injectable, Inject} from '@angular/core';
import {UaaConfig} from './uaa.config';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {LogService, Logger} from "@bi8/am-logger";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/map';

@Injectable()
export class UaaService {

  logger: Logger;

  constructor(@Inject('UaaConfig') private config: UaaConfig, logService: LogService, private hc: HttpClient) {
    this.logger = logService.getLogger(this.constructor.name);
  }

  doLogin(username: string, password: string) : Observable<any>  {
    let formBody = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.hc.post('/api/uaa/session/login', formBody, {
        headers: headers                                                                        
    }).map((response)=>{
      // broadcast stuff here
    });
  }

  doLogout(){
  }
}
