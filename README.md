# Angular Material Authentication and Authorization

ng update @angular/cli
yarn add @angular/cli

ng update @angular/compiler-cli
yarn add @angular/compiler-cli

// for the angular.json file
ng update @angular/cli


ng update @angular/core
ng update @angular/material
ng update @angular/flex-layout

yarn add @angular/core
yarn add @angular/material
yarn add @angular/flex-layout

ng update ng-packagr
yarn add ng-packagr






yarn add core-js
yarn add @angular/flex-layout
yarn add lodash
yarn add material-design-icons
yarn add roboto-fontface
yarn add zone.js
yarn add ts-node
yarn add tsickle
yarn add tslib

ng update @angular/cli
yarn add rxjs-compat

ng update

AmUaa is a simple framework for handling simple User Authentication.  

Please note that this is a *Proof of Concept* library and not meant for production use and that the API can 
change at any time.

Version 5.0 is a update to the way the library gets build as well as depending on Angular5.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## Installation

To install AmUaa in your project, simply do

```
npm i @bi8/am-uaa
```  

AmUaa depends on/uses ```@bi8/am-storage``` and ```@bi8/am-logger```

## Configuration

Import the AmUaaModule

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {UaaConfig} from "./modules/am-uaa/uaa.config";
import {AmUaaModule} from "./modules/am-uaa/am-uaa.module";

const uaaConfig : UaaConfig = {};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmUaaModule,
  ],
  entryComponents: [],
  providers:    [
      { provide: 'UaaConfig', useValue: uaaConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
``` 

## Build

Run `npm i` to install all the dependencies. To create the bundle/distribution, run `npm run packagr`
which will do a new release under the dist folder. 

## Project Layout
This is basically a CLI generated application with the addition of [ng-packagr](https://www.npmjs.com/package/ng-packagr) to create the distribution 
bundle.  The app component imports the AmStorageModule that is located under the modules directory.  Only the module is packaged
an not the whole example project.  

Please see Nikolas LeBlanc's article: [Building an Angular 4 Component Library with the Angular CLI and ng-packagr](https://medium.com/@ngl817/building-an-angular-4-component-library-with-the-angular-cli-and-ng-packagr-53b2ade0701e) 

