import {Component, Inject, OnInit} from '@angular/core';
import {HttpService} from './http.service';
import {UaaConfig} from '../modules/am-uaa/uaa.config.service';
import {UaaService} from '../modules/am-uaa/uaa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(@Inject('UaaConfig') private config: UaaConfig,
              private uaaService: UaaService,
              private httpService: HttpService) {
  }

  ngOnInit() {
    console.log("Home Component ngOnInit()");
    console.log("Identity", this.uaaService.getIdentity());
  }

  getIdentity() {
    this.uaaService.getIdentity(true).subscribe(result => console.dir(result));
  }

  logout() {
    console.log('doLogout()');
    this.uaaService.doLogout().subscribe();
  }
  //
  // loggedIn() {
  //   console.dir(this.uaaService.isLoggedIn());
  // }
  //
  // expiresAt() {
  //   console.dir(this.uaaService.getExpiration(this.uaaService.TOKEN_EXPIRE_KEY));
  // }
  //
  // refreshToken() {
  //   this.uaaService.doRefresh().subscribe(res => {
  //     console.dir(res);
  //   });
  // }

  callEndpoint() {
    this.httpService.getCall('/api/uaa/session/jwt/greet').subscribe(res => {
      console.dir(res);
    });
  }
}
