import {Logger} from '@bi8/am-logger';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export interface Uaa {
  logger: Logger;
}

export abstract class UaaService {

  abstract doLogin(username: string, password: string, silent?: boolean): Observable<any>;

  abstract doLogout(silent?: boolean): Observable<any>;

  abstract getIdentity(refresh?: boolean, silent?: boolean): Observable<any> | any;
}
