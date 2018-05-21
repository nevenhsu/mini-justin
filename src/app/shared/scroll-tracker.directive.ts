import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrollTracker]'
})
export class ScrollTrackerDirective {
  @Output('reachBottom') reachBottom = new EventEmitter<boolean>();

  constructor() { }

  @HostListener('window:scroll', ['$event']) onScroll(event) {
    const TRACK = event.target.scrollingElement;
    const LIMIT = TRACK.scrollHeight - TRACK.clientHeight;

    if (TRACK.scrollTop === LIMIT) {
      this.reachBottom.emit(true);
    } else {
      this.reachBottom.emit(false);
    }
  }

}
