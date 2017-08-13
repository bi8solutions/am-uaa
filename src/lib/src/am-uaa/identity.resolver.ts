import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {UaaService} from "./uaa.service";
import {LogService, Logger} from "@bi8/am-logger";

@Injectable()
export class IdentityResolver implements Resolve<any> {
  logger: Logger;

  constructor(private uaaService: UaaService, logService : LogService) {
    this.logger = logService.getLogger(this.constructor.name);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    this.logger.debug("Resolving identity");
    return this.uaaService.getIdentity(true).toPromise().then(identity => {
      this.logger.debug("Identity resolved", identity);
      return identity;
    });
  }
}
