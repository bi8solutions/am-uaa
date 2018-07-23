import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UaaService} from "../modules/am-uaa/uaa.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private uaaService: UaaService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  getIdentity(){
    this.uaaService.getIdentity(true).subscribe(result=> console.log(result));
  }

  logout(){
    this.uaaService.doLogout().subscribe();
  }
}
