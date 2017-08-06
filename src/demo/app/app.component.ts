import { Component } from '@angular/core';
import { Logger, LogService} from '@bi8/am-logger';
import * as moment from 'moment'
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UaaService} from "@bi8/am-uaa";

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  meaning: number;
  logger: Logger;

  constructor(logService: LogService, private uaaService: UaaService) {
    this.logger = logService.getLogger(this.constructor.name);
  }

  doLogin(username: string, password: string){
    this.uaaService.doLogin(username, password).subscribe((result)=>{
      this.logger.debug("Logged In Succesfully");
    })
  }

  doLogout(){
  }
}
