import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {AmUaaModule} from "../modules/am-uaa/am-uaa.module";
import {HttpService} from './http.service';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FlexLayoutModule,
    AmUaaModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: [HttpService]

})
export class HomeModule { }
