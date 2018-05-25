import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {
  @ViewChild('keyword', {read: ElementRef}) keyword;
  @Output('enter') enter = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onBlur() {
    // force to focus
    setTimeout(() => {
      this.keyword.nativeElement.focus();
    });
  }

  onClickEnter() {
    const VALUE = this.keyword.nativeElement.value;
    if (!VALUE) {return; }
    this.enter.emit(VALUE);
  }
}
