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

  sub: Subscription;
  entry: string;
  query: string;
  name: string;
  picUrl: string;
  images: Array<PostImage> = []; // store all images
  postsData: PostsData; // store the newest data for updating view
  user?: User; // get selected user name from local storage
  hashtagName?: string; // get hashtag from local storage

  constructor(private route: ActivatedRoute,
              private router: Router,
              private searchService: SearchService) { }

  ngOnInit() {
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
      this.goToPrev();
    }
  }

  goToPrev() {
    switch (this.entry) {
      case 'ig':
        const KEYWORD = sessionStorage.getItem('keyword');
        this.router.navigate(['type'], {queryParams: {entry: this.entry, query: KEYWORD}});
        break;
      default:
        this.router.navigate(['']);
    }
    this.searchService._images = [];
    this.searchService.updateImages();
  }

  setPage() {
    switch (this.entry) {
      case 'ig':
        this.user = JSON.parse(localStorage.getItem('user'));
        // if query doesn't match to local data then go to prev page
        if (this.query === this.user.pk.toString()) {
          this.name = this.user.full_name;
          this.picUrl = this.user.profile_pic_url;
          this.getPostImages();
        } else {
          this.goToPrev();
        }
        break;
      case 'tag':
        console.log( localStorage.getItem('hashtagName'));
        this.hashtagName = localStorage.getItem('hashtagName');
        // if query doesn't match to local data then go to prev page
        if (this.query === this.hashtagName) {
          this.name = this.hashtagName;
          this.picUrl = 'assets/images/tag-circle.png';
          this.getPostImages();
        } else {
          this.goToPrev();
        }
        break;
      default:
        break;
    }
  }

  async getPostImages() {
    const AFTER = SearchService.getSafe(() => this.postsData.end_cursor);
    switch (this.entry) {
      case 'ig':
        // set variable and get posts data
        const VARIABLES = {'id': this.user.pk.toString(), 'first': '30', 'after': AFTER};
        this.postsData = await this.searchService.getPostsData('id', VARIABLES).then((data: PostsData) => {
          if (data.status === 'ok') {
            return data;
          }
        });
        // add images
        this.images = this.images.concat(this.postsData.images);
        break;
      case 'tag':
        const VARIABLES2 = {'tag_name': this.hashtagName, 'first': '30', 'after': AFTER};
        this.postsData = await this.searchService.getPostsData('tag', VARIABLES2).then((data: PostsData) => {
          if (data.status === 'ok') {
            return data;
          }
        });
        this.images = this.images.concat(this.postsData.images);
        break;
      default:
        break;
    }
  }

  reachBottom(event: boolean) {
    const TOTALIMAGES = SearchService.getSafe(() => this.postsData.images.length);
    if (event && TOTALIMAGES > 0) {
      this.getPostImages();
    }
  }

}
