import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrollTracker]'
})
export class ScrollTrackerDirective {
  @Output('reachBottom') reachBottom = new EventEmitter<boolean>();

  constructor(private el: ElementRef) { }

  @HostListener('window:pan', ['$event']) onScroll(event) {
    console.log(event.deltaY, this.el.nativeElement);
    // const TRACK = event.target.scrollingElement;
    // const LIMIT = TRACK.scrollHeight - TRACK.clientHeight;
    //
    // console.log(TRACK, LIMIT);

    // if (TRACK.scrollTop === LIMIT) {
    //   this.reachBottom.emit(true);
    // } else {
    //   this.reachBottom.emit(false);
    // }
  }

}
