import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-privacy-error',
  templateUrl: './privacy-error.component.html',
  styleUrls: ['./privacy-error.component.scss']
})
export class PrivacyErrorComponent implements OnInit {

  @Output('tapReload') tapReload = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  tap() {
    this.tapReload.emit();
  }

}
