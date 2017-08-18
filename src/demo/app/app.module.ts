import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { LogConfig, LogLevel, LogModule } from "@bi8/am-logger";
import { UaaConfig, UaaModule } from "@bi8/am-uaa";
import {StorageModule} from "@bi8/am-storage";
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MdButtonModule, MdCardModule, MdDialogModule, MdIconModule, MdInputModule, MdToolbarModule} from "@angular/material";
import {HomeModule} from "./home/home.module";
import {AppRoutingModule} from "./app-routing.module";
import {LoginDialog} from "./login-dialog.component";

const logConfig : LogConfig = {
  level: LogLevel.debug
};

const uaaConfig : UaaConfig = {
};

@NgModule({
  imports:      [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LogModule,
    UaaModule,
    StorageModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MdCardModule,
    MdButtonModule,
    MdInputModule,
    MdDialogModule,
    MdToolbarModule,
    MdIconModule,
    HomeModule
  ],
  entryComponents: [LoginDialog],
  declarations: [ AppComponent, LoginDialog ],
  bootstrap:    [ AppComponent ],
  providers:    [
      { provide: 'LogConfig', useValue: logConfig },
      { provide: 'UaaConfig', useValue: uaaConfig }
  ]
})
export class AppModule { }
