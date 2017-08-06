import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { LogConfig, LogLevel, LogModule } from "@bi8/am-logger";
import { UaaConfig, UaaModule } from "@bi8/am-uaa";

const logConfig : LogConfig = {
  level: LogLevel.debug
};

const uaaConfig : UaaConfig = {
};

@NgModule({
  imports:      [
      BrowserModule,
      LogModule,
      UaaModule,
      HttpClientModule
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [
      { provide: 'LogConfig', useValue: logConfig },
      { provide: 'UaaConfig', useValue: uaaConfig }
  ]
})
export class AppModule { }
