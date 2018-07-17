import {Component, Inject, OnInit} from '@angular/core';
import {LogService, Logger} from '@bi8/am-logger';
import {ActivatedRoute} from '@angular/router';
import {UaaEventService} from '../modules/am-uaa/uaa.event.service';
import {UaaEvent} from '../modules/am-uaa/uaa.event';
import {HttpService} from './http.service';
import {UaaConfig} from '../modules/am-uaa/uaa.config';
import {UaaService} from '../modules/am-uaa/uaa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  logger: Logger;

  constructor(@Inject('UaaConfig') private config: UaaConfig,
              private logService: LogService,
              private uaaService: UaaService,
              private httpService: HttpService,
              private uaaEvent: UaaEventService,
              private route: ActivatedRoute) {
    this.logger = logService.getLogger(this.constructor.name);
  }

  ngOnInit() {
    this.logger.debug("Home Component ngOnInit()");
    this.logger.debug("Identity", this.uaaService.getIdentity());
  }

  getIdentity() {
    this.uaaService.getIdentity(true).subscribe(result => console.dir(result));
  }

  logout() {
    console.log('doLogout()');
    const obs = this.uaaService.doLogout();
    if (!this.config.useJwt) {
      obs.subscribe();
    }
  }

  loggedIn() {
    console.dir(this.uaaService.isLoggedIn());
  }

  expiresAt() {
    console.dir(this.uaaService.getExpiration(this.uaaService.TOKEN_EXPIRE_KEY));
  }

  refreshToken() {
    this.uaaService.doRefresh().subscribe(res => {
      console.dir(res);
    });
  }

  callEndpoint() {
    this.httpService.getCall('/api/uaa/session/jwt/greet').subscribe(res => {
      console.dir(res);
    });
  }
}
