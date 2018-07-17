import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AmLoggerModule} from "@bi8/am-logger";
import {UaaEventService} from "./uaa.event.service";
import {IdentityResolver} from "./identity.resolver";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {UaaInterceptor} from "./uaa.interceptor";
import {UaaService} from './uaa.service';

@NgModule({
  imports: [
    CommonModule,
    AmLoggerModule,
  ],
  providers: [UaaService, UaaService, UaaEventService, IdentityResolver, {
      provide: HTTP_INTERCEPTORS,
      useClass: UaaInterceptor,
      multi: true,
  }],
  declarations: []
})
export class AmUaaModule { }
