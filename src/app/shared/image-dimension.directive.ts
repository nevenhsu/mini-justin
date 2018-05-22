import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appImageDemension]'
})
export class ImageDimensionDirective {
  @Output('calDimension') calDimension = new EventEmitter();

  @HostListener('load', ['$event']) onLoad(event: Event) {
    this.calDimension.emit({
      width: this.el.nativeElement.offsetWidth,
      height: this.el.nativeElement.offsetHeight
    });
  }

  constructor(private el: ElementRef) { }

}
