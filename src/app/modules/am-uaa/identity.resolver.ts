import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {UaaService} from './uaa.service';
import {LogService, Logger} from '@bi8/am-logger';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

@Injectable()
export class IdentityResolver implements Resolve<any> {
  logger: Logger;

  constructor(private uaaService: UaaService, logService: LogService) {
    this.logger = logService.getLogger(this.constructor.name);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.logger.debug('Resolving identity');

    return Observable.create((observer: Observer<any[]>) => {
      const identity = this.uaaService.getIdentity(true);
      this.logger.debug('Identity resolved', identity);
      observer.next(identity);
      observer.complete();
    });
  }
}
