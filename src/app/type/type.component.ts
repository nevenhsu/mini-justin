import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit, OnDestroy {

  sub: Subscription;
  entry: string;
  keyword;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.entry = params['entry'];
      this.checkEntry();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkEntry() {
    // if no entry then return home
    if (!this.entry) {
      this.router.navigate(['']);
    }

    // if wrong entry then set default
    switch (this.entry) {
      case 'tag':
        break;
      case 'ig':
        break;
      default:
        this.entry = 'tag';
    }
  }



}
