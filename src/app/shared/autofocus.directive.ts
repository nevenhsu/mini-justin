import {
  AfterContentInit, AfterViewChecked, ChangeDetectorRef, Directive,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewChecked {

  constructor(private el: ElementRef) { }

  ngAfterViewChecked() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    });
  }

}
