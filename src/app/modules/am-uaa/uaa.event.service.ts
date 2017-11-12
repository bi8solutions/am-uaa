import {Injectable, Inject} from '@angular/core';
import {Subject, Observable, Subscription} from "rxjs";
import {UaaEvent} from "./uaa.event";
import {LogService, Logger} from "@bi8/am-logger";

@Injectable()
export class UaaEventService {
  private eventSource$ = new Subject<UaaEvent>();
  private logger: Logger;

  constructor(private logService: LogService) {
    this.logger = logService.getLogger(this.constructor.name);
  }

  getEventSourceObserver(): Observable<UaaEvent> {
    return this.eventSource$.asObservable();
  }

  broadcast(event: UaaEvent) {
    this.logger.debug(`event`, UaaEvent[event]);
    this.eventSource$.next(event);
  }

  subscribe(callback: any) : Subscription {
    return this.eventSource$.subscribe(callback);
  }
}
