import {Component, OnInit, Inject} from '@angular/core';
import {MdDialogRef} from "@angular/material";

import {FormControl, FormBuilder, FormGroup} from "@angular/forms";
import {MD_DIALOG_DATA} from '@angular/material';
import {UaaEvent, UaaEventService, UaaService} from "@bi8/am-uaa";
import {LogService, Logger} from "@bi8/am-logger";

import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialog implements OnInit {

  logger: Logger;
  errorMessage: string;

  username = new FormControl('');
  password = new FormControl('');

  loginForm: FormGroup = this.fb.group({
    username: this.username,
    password: this.password
  });

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<LoginDialog>,
              public fb: FormBuilder,
              public uaaEventService: UaaEventService,
              private logService: LogService,
              private hc: HttpClient) {

    this.logger = logService.getLogger(this.constructor.name);
    this.logger.debug("Login Dialog Created");
  }

  ngOnInit(): void {
    this.logger.debug('(ngOnInit)');
    this.uaaEventService.broadcast(UaaEvent.LOGIN_DIALOG_OPENED);
  }

  submit(){
    this.errorMessage = null;
    let value = this.loginForm.value;
    this.logger.debug('(submit)');
    this.data.uaaService.doLogin(value.username, value.password)
      .subscribe(result => {
        this.uaaEventService.broadcast(UaaEvent.LOGIN_DIALOG_BEFORE_CLOSED);
        this.dialogRef.close(result);

    }, error =>{
        this.errorMessage = "Authentication Failed.  Please try again.";
        this.logger.error(error);
    });
  }
}
