import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input('isShowLeftBtn') isShowLeftBtn: boolean;
  @Input('title') title: string;
  @Output('tapLeftBtn') tapLeftBtn = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onTap(event) {
    this.tapLeftBtn.emit(event);
  }
}
