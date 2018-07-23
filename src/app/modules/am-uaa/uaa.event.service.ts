import {Injectable, Inject} from '@angular/core';
import {Subject, Observable, Subscription} from "rxjs";
import {UaaEvent} from "./uaa.event";

@Injectable()
export class UaaEventService {
  private eventSource$ = new Subject<UaaEvent>();

  constructor() {
  }

  getEventSourceObserver(): Observable<UaaEvent> {
    return this.eventSource$.asObservable();
  }

  broadcast(event: UaaEvent) {
    this.eventSource$.next(event);
  }

  subscribe(callback: any) : Subscription {
    return this.eventSource$.subscribe(callback);
  }
}
