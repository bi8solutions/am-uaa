import {Component, OnInit} from '@angular/core';
import {LogService, Logger} from "@bi8/am-logger";
import {ActivatedRoute} from "@angular/router";
import {UaaService} from "../modules/am-uaa/uaa.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  logger: Logger;

  constructor(private logService: LogService,
              private uaaService: UaaService,
              private route: ActivatedRoute) {
    this.logger = logService.getLogger(this.constructor.name);
  }

  ngOnInit() {
    this.logger.debug("Home Component ngOnInit()");
    this.logger.debug("Identity", this.uaaService.getIdentity());
  }

  getIdentity(){
    this.uaaService.getIdentity(true).subscribe(result=> console.log(result));
  }

  logout(){
    this.uaaService.doLogout().subscribe();
  }
}
