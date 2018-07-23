import {Injectable, Inject} from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

export interface UaaConfig {
  useJwt?: boolean;
  grantType?: string;
  clientID?: string;
  clientPassword?: string;
}

@Injectable()
export class UaaConfigService implements UaaConfig {

  useJwt?: boolean;
  grantType?: string;
  clientID?: string;
  clientPassword?: string;

  constructor(@Inject('UaaConfig') private config: UaaConfig) {
    this.useJwt = config.useJwt;
    this.grantType = config.grantType;
    this.clientID = config.clientID;
    this.clientPassword = config.clientPassword;
  }
}
