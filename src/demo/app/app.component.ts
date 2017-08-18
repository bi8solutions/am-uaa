import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Logger, LogService} from '@bi8/am-logger';
import * as moment from 'moment'
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UaaEvent, UaaEventService, UaaService} from "@bi8/am-uaa";
import {MdDialog} from "@angular/material";
import {LoginDialog} from "./login-dialog.component";

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  logger: Logger;
  loggingIn: boolean = false;

  constructor(private logService: LogService,
              private mdDialog: MdDialog,
              public uaaService: UaaService,
              private uaaEventService: UaaEventService) {
    this.logger = logService.getLogger(this.constructor.name);

    uaaEventService.subscribe((event)=>{
       switch (event){
         case UaaEvent.LOGIN_REQUIRED:
           if (!this.loggingIn){
             this.popLoginDialog();
           }
           break;
       }
     });
  }

  ngOnInit(): void {
  }

  popLoginDialog(){
    this.loggingIn = true;
     this.uaaEventService.broadcast(UaaEvent.LOGIN_DIALOG_BEFORE_OPEN);
     let dialogRef = this.mdDialog.open(LoginDialog, {
       backdropClass: 'loginBackdrop',
       disableClose: true,
       data: {
         uaaService: this.uaaService,
         header: 'Sign In'
       }
     });
     dialogRef.afterClosed().subscribe(result => {
       this.loggingIn = false;
       this.uaaEventService.broadcast(UaaEvent.LOGIN_DIALOG_CLOSED);
     });
   }

  /*doLogin(username: string, password: string){
    this.uaaService.doLogin(username, password).subscribe((result)=>{
      this.logger.debug("Logged In Succesfully");
    })
  }

  doLogout(){
    this.uaaService.doLogout().subscribe((result)=>{
      this.logger.debug("Logged Out Successfully");
    });
  }*/


  /*doSecureCall(){
    this.uaaService.getIdentity(true).subscribe((result)=>{
      this.logger.debug("Identity Loaded successfully", result);
    }, (error)=>{
      this.logger.error("There is an error:", error);
    });
  }
  
  loginProvided(){
    this.uaaEventService.broadcast(UaaEvent.LOGIN_PROVIDED);
  }*/
}
