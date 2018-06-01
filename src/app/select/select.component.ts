import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'shared/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})

export class SelectComponent implements OnInit, OnDestroy {
  // TODO: get user info
  // TODO: adjust counter css

  sub: Subscription;
  entry: string;
  query: string;
  name: string;
  picUrl: string;
  isPrivate: boolean; // is account private
  isShowError: boolean; // should select one more
  pedding: boolean; // is downloading images
  images: Array<PostImage> = []; // store all images
  postsData: PostsData; // store the newest data for updating view
  user?: User; // get selected user name from local storage
  hashtagName?: string; // get hashtag from local storage

  constructor(private route: ActivatedRoute,
              private router: Router,
              private searchService: SearchService) { }

  ngOnInit() {
    this.pedding = false;
    this.sub = this.route.queryParams.subscribe(params => {
      this.entry = params['entry'];
      this.query = params['query'];
      this.checkParams();
      this.setPage();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkParams() {
    if (!this.entry) {
      this.router.navigate(['']);
    }
    if (!this.query) {
      this.goPrev();
    }
  }

  goPrev() {
    switch (this.entry) {
      case 'ig':
        const KEYWORD = sessionStorage.getItem('keyword');
        this.router.navigate(['type'], {queryParams: {entry: this.entry, query: KEYWORD}});
        break;
      default:
        this.router.navigate(['']);
    }

    this.searchService.clearImages();
  }

  onNext(isActivated: boolean) {
    if (isActivated) {
      this.searchService.savePrevUrl(this.route);
      this.router.navigate(['preview']);
    } else {
      if (this.isShowError) {return; }

      // show error bubble
      this.isShowError = true;
      // auto hide
      setTimeout(() => {
        if (this.isShowError) {
          this.isShowError = false;
        }
      }, 5000);
    }
  }

  setPage() {
    switch (this.entry) {
      case 'ig':
        this.user = JSON.parse(localStorage.getItem('user'));
        // if query doesn't match to local data then go to prev page
        if (this.query === this.user.pk.toString()) {
          this.name = this.user.full_name;
          this.picUrl = this.user.profile_pic_url;
          this.getPostImages(() => {
            // detect if account is private
            this.isPrivate = this.postsData.count > 0 && this.images.length === 0;
          });
        } else {
          this.goPrev();
        }
        break;
      case 'tag':
        this.hashtagName = localStorage.getItem('hashtagName');
        // if query doesn't match to local data then go to prev page
        if (this.query === this.hashtagName) {
          this.name = this.hashtagName;
          this.picUrl = 'assets/images/tag-circle.png';
          this.getPostImages();
        } else {
          this.goPrev();
        }
        break;
      default:
        break;
    }
  }

  async getPostImages(callback?) {
    this.pedding = true;
    const AFTER: string = SearchService.getSafe(() => this.postsData.end_cursor) || '0';
    switch (this.entry) {
      case 'ig':
        // set variable and get posts data
        const VARIABLES = {
          query: this.user.pk.toString(),
          after: AFTER
        };
        this.postsData = await this.searchService.getPostsData('id', VARIABLES).then((data: PostsData) => {
          if (data.status === 'ok') {
            return data;
          }
        });
        // add images
        this.images = this.images.concat(this.postsData.images);
        this.pedding = false;
        if (typeof callback === 'function') { callback(); }
        break;
      case 'tag':
        const VARIABLES2 = {
          query: this.hashtagName,
          after: AFTER
        };
        this.postsData = await this.searchService.getPostsData('tag', VARIABLES2).then((data: PostsData) => {
          if (data.status === 'ok') {
            return data;
          }
        });
        this.images = this.images.concat(this.postsData.images);
        this.pedding = false;
        if (typeof callback === 'function') { callback(); }
        break;
      default:
        this.pedding = false;
        if (typeof callback === 'function') { callback(); }
        break;
    }
  }

  reachBottom() {
    // if last data has images then keep downloading new images
    const TOTALIMAGES = SearchService.getSafe(() => this.postsData.images.length);
    if (TOTALIMAGES > 0 && !this.pedding) {
      this.getPostImages();
    }
  }

  tapReload() {
    this.setPage();
  }


}
