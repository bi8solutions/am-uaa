import { Component } from '@angular/core';
import { Logger, LogService} from '@bi8/am-logger';
import * as moment from 'moment'
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UaaEvent, UaaEventService, UaaService} from "@bi8/am-uaa";

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  logger: Logger;

  constructor(private logService: LogService,
              public uaaService: UaaService,
              private uaaEventService: UaaEventService) {
    this.logger = logService.getLogger(this.constructor.name);
  }

  doLogin(username: string, password: string){
    this.uaaService.doLogin(username, password).subscribe((result)=>{
      this.logger.debug("Logged In Succesfully");
    })
  }

  doLogout(){
    this.uaaService.doLogout().subscribe((result)=>{
      this.logger.debug("Logged Out Successfully");
    });
  }

  doSecureCall(){
    this.uaaService.getIdentity(true).subscribe((result)=>{
      this.logger.debug("Identity Loaded successfully", result);
    }, (error)=>{
      this.logger.error("There is an error:", error);
    });
  }
  
  loginProvided(){
    this.uaaEventService.broadcast(UaaEvent.LOGIN_PROVIDED);
  }
}
