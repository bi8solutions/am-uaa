import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UaaService} from './am-uaa/uaa.service';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {UaaInterceptor} from "./am-uaa/uaa.interceptor";
import {LogModule} from "@bi8/am-logger";
import {UaaEventService} from "./am-uaa/uaa.event.service";
import {IdentityResolver} from "./am-uaa/identity.resolver";
import {RequestOptions} from "@angular/http";

@NgModule({
    providers: [UaaService, UaaEventService, IdentityResolver, {
        provide: HTTP_INTERCEPTORS,
        useClass: UaaInterceptor,
        multi: true,
    }],
    declarations: [],
    imports: [
      CommonModule,
      LogModule
    ],
    exports: []
})
export class UaaModule {
}
