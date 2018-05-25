import {
  ChangeDetectorRef, Component, OnDestroy, OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from 'shared/search.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit, OnDestroy {
  title: string;
  sub: Subscription;
  entry: string;
  query: string;
  isShowChoose: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private searchService: SearchService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.entry = params['entry'];
      this.query = params['query'];
      this.checkParams();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkParams() {
    // if no entry then return home
    if (!this.entry) {
      this.router.navigate(['']);
    }

    // if wrong entry then return home
    // for now entry tag redirect to select url
    switch (this.entry) {
      case 'ig':
        this.title = this.query ? 'Choose account' : 'Type in Instagram username';
        this.isShowChoose = !!this.query;
        break;
      case 'tag':
        this.searchService.prevUrl = {url: ''};
        this.router.navigate(['select'], {queryParams: {entry: this.entry, query: sessionStorage.getItem('hashtagName')}});
        break;
      default:
        this.router.navigate(['']);
    }
  }

  goPrevPage() {
    if (this.isShowChoose) {
      this.router.navigate(['type'], { queryParams: {entry: 'ig'}});
    } else {
      this.router.navigate(['']);
    }
  }

  onClickEnter(value) {
    const VALUE = value;

    // go to choose account or select photo
    // now case tag: is ignored
    switch (this.entry) {
      case 'ig':
        sessionStorage.setItem('keyword', VALUE);
        this.router.navigate(['type'], {queryParams: {entry: this.entry, query: VALUE}});
        break;
      case 'tag':
        this.router.navigate(['select'], {queryParams: {entry: this.entry, query: VALUE}});
        break;
      default:
        this.router.navigate(['select'], {queryParams: {entry: this.entry, query: VALUE}});
    }
  }

  onTapAccount(user: User) {
    // save user
    localStorage.setItem('user', JSON.stringify(user));

    // entry is ig
    if (user && user.pk) {
      this.router.navigate(['select'], {queryParams: {entry: this.entry, query: user.pk}});
    }
  }

}
