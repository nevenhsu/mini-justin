import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from 'shared/search.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  total = 0;
  get isActivated():boolean {
    return this.total > 0 && this.total % 2 === 0;
  }

  constructor(private searchService: SearchService,
              private router: Router) {
  }

  ngOnInit() {
    this.total = this.searchService._images.length;
    this.subscription = this.searchService.images.subscribe((images) => {
      this.total = images.length;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goNext() {
    if (this.isActivated) {
      this.router.navigate(['preview']);
    }
  }
}
