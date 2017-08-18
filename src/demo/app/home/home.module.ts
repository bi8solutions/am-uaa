import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {UaaModule} from "@bi8/am-uaa";

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FlexLayoutModule,
    UaaModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent]

})
export class HomeModule { }
