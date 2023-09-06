import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {UaaConfig} from "./modules/am-uaa/uaa.config.service";
import {AmStorageModule} from "@bi8/am-storage";
import {AmUaaModule} from "./modules/am-uaa/am-uaa.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomeModule} from "./home/home.module";
import {MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatToolbarModule} from "@angular/material";
import {LoginDialog} from "./login-dialog.component";

const uaaConfig: UaaConfig = {
  useJwt: true
};

@NgModule({
  declarations: [
    AppComponent,
    LoginDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AmStorageModule,
    AmUaaModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    HomeModule
  ],
  entryComponents: [LoginDialog],
  providers:    [
      { provide: 'UaaConfig', useValue: uaaConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
