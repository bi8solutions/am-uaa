import {Component, OnInit} from '@angular/core';
import {UaaService} from "@bi8/am-uaa";
import {LogService, Logger} from "@bi8/am-logger";
import {ActivatedRoute} from "@angular/router";

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

    //this.route.data.subscribe((data: { identity: any }) => {
    //  console.log("======>", data.identity);
    //});
  }

  getIdentity(){
    this.uaaService.getIdentity(true).subscribe(result=> console.log(result));
  }

  logout(){
    this.uaaService.doLogout().subscribe();
  }
}
