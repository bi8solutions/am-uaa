import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpService {

  constructor(private hc: HttpClient) {
  }

  getCall(api: string): Observable<any> {
    return this.hc.get(api);
  }
}
