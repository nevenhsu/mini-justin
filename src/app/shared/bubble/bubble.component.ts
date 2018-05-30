import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
  animations: [
    trigger('fadeRight', [
      state('void', style({opacity: 0, transform: 'translateX(16px)'})),
      state('*', style({opacity: 1, transform: 'translateX(0)'})),
      transition(':enter, :leave', [animate('0.25s ease-out')])
    ])
  ]
})
export class BubbleComponent implements OnInit {
  @Input('isShow') isShow: boolean;
  constructor() { }

  ngOnInit() {
  }

}
