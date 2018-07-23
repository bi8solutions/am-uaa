import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {UaaService} from "./uaa.service";
import {Observable, Observer} from "rxjs";

@Injectable()
export class IdentityResolver implements Resolve<any> {
  constructor(private uaaService: UaaService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return Observable.create((observer: Observer<any[]>) => {
      this.uaaService.getIdentity(true).subscribe(identity => {
        observer.next(identity);
        observer.complete();
      });
    });
  }
}
