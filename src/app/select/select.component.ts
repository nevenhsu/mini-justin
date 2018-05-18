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
  // TODO: recheck user info

  sub: Subscription;
  entry: string;
  query: string;
  name: string;
  picUrl: string;
  images: Array<PostImage> = [];
  postsData: PostsData;
  // for refresh browser or return page
  user?: User;
  hashtagName?: string;

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
        this.hashtagName = localStorage.getItem('hashtagName');
        // if query doesn't match to local data then go to prev page
        if (this.query === this.hashtagName) {
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
          } else {
            console.log('status is not ok');
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
          } else {
            console.log('status is not ok');
          }
        });
        this.images = this.images.concat(this.postsData.images);
        break;
      default:
        break;
    }
  }

}
