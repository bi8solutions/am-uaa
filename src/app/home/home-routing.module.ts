import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home.component";
import {IdentityResolver} from "../modules/am-uaa/identity.resolver";

const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
    resolve: {
      identity: IdentityResolver
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
