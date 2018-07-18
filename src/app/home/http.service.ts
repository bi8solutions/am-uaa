import {HttpClient} from '@angular/common/http';
import {UaaEventService} from '../modules/am-uaa/uaa.event.service';
import {Logger, LogService} from '@bi8/am-logger';
import {StorageService} from '@bi8/am-storage';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpService {

  logger: Logger;

  constructor(private hc: HttpClient,
              private logService: LogService,
              private storageService: StorageService,
              private uaaEventService: UaaEventService) {

    this.logger = logService.getLogger(this.constructor.name);
  }

  getCall(api: string): Observable<any> {
    return this.hc.get(api);
  }

}
