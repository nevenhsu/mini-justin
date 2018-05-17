import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('keyword', {read: ElementRef}) keyword;
  sub: Subscription;
  entry: string;
  account: string;
  title: string;
  isShowChoose: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.entry = params['entry'];
      this.account = params['account'];
      this.checkEntry();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewChecked() {
    // if showing keyboard then focus input
    if (!this.isShowChoose) {
      this.keyword.nativeElement.focus();
      this.cd.detectChanges();
    }
  }

  checkEntry() {
    // if no entry then return home
    if (!this.entry) {
      this.router.navigate(['']);
    }

    // if wrong entry then set default
    switch (this.entry) {
      case 'ig':
        this.title = this.account ? 'Choose account' : 'Type in Instagram username';
        this.isShowChoose = !!this.account;
        break;
      case 'tag':
        this.title = 'Type in Instagram hashtag';
        break;
      default:
        this.entry = 'tag';
        this.title = 'Type in Instagram hashtag';
    }
  }

  tapLeftBtn() {
    if (this.isShowChoose) {
      this.router.navigate(['type'], { queryParams: {entry: 'ig'}});
    } else {
      this.router.navigate(['']);
    }
  }

  onBlur() {
    // set to focus
    this.keyword.nativeElement.focus();
  }

  onClickEnter() {
    const VALUE = this.keyword.nativeElement.value;
    if (!VALUE) {return; }

    // Choose account or select photo
    switch (this.entry) {
      case 'ig':
        this.router.navigate(['type'], {queryParams: {entry: 'ig', account: VALUE}});
        break;
      case 'tag':
        this.router.navigate(['select'], {queryParams: {tag: VALUE}});
        break;
      default:
        this.router.navigate(['select'], {queryParams: {tag: VALUE}});
    }
  }

}
