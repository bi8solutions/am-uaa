import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

export interface Uaa {
}

export abstract class UaaService {

  abstract doLogin(username: string, password: string, silent?: boolean): Observable<any>;

  abstract doLogout(silent?: boolean): Observable<any>;

  abstract getIdentity(refresh?: boolean, silent?: boolean): Observable<any> | any;
}
