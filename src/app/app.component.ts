import {Component, OnInit} from '@angular/core';
import {UaaService} from "./modules/am-uaa/uaa.service";
import {UaaEventService} from "./modules/am-uaa/uaa.event.service";
import {UaaEvent} from "./modules/am-uaa/uaa.event";
import {MatDialog} from "@angular/material";
import {LoginDialog} from "./login-dialog.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loggingIn: boolean = false;

  constructor(private matDialog: MatDialog,
              public uaaService: UaaService,
              private uaaEventService: UaaEventService) {
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
     let dialogRef = this.matDialog.open(LoginDialog, {
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
