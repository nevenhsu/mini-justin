import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SearchService } from 'shared/search.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  animations: [
    trigger('headShake', [
      transition('* => true', [
        animate('0.35s', keyframes([
          style({transform: 'translateX(0)', offset: 0}),
          style({transform: 'translateX(-6px)', offset: 0.13}),
          style({transform: 'translateX(5px)', offset: 0.37}),
          style({transform: 'translateX(-3px)', offset: 0.63}),
          style({transform: 'translateX(2px)', offset: 0.87}),
          style({transform: 'translateX(0)', offset: 1}),
        ]))
      ])
    ])
  ]
})
export class CounterComponent implements OnInit, OnDestroy {
  @Output('goNext') goNext = new EventEmitter<boolean>();
  subscription: Subscription;
  total = 0;
  isShake: boolean;

  get isActivated(): boolean {
    return this.total > 0 && this.total % 2 === 0;
  }

  constructor(private searchService: SearchService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.isShake = false;
    this.total = this.searchService._images.length;
    this.subscription = this.searchService.images$.subscribe((images) => {
      this.total = images.length;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNext() {
    this.goNext.emit(this.isActivated);

    // if not activated then shake animation
    if (!this.isActivated && !this.isShake) {
      this.isShake = true;

      setTimeout(() => {
        this.isShake = false;
      }, 5000);
    }
  }
}
