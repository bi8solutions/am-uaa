import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home.component";
import {IdentityResolver} from "@bi8/am-uaa";

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
