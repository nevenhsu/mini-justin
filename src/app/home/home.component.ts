import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'shared/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  // TODO: restructure return url on service

  hashtag: Hashtag;

  constructor(private router: Router,
              private searchService: SearchService) { }

  ngOnInit() {
    this.getHashTag();
    this.searchService.clearImages();
  }

  async getHashTag() {
    this.hashtag = await this.searchService.getHashTag().then(res => {
      if (res['status'] === 'ok') {
        return SearchService.getSafe(() =>  res['hashtags'][0].hashtag );
      }
      return '';
    });
    localStorage.setItem('hashtagName', SearchService.getSafe(() =>  this.hashtag.name ));
  }

  goNext(entry: string) {
    switch (entry) {
      case 'ig':
        this.router.navigate(['type'], { queryParams: {entry: entry}});
        break;
      case 'tag':
        if (!this.hashtag) {return; }
        this.router.navigate(['select'], {queryParams: {entry: entry, query: this.hashtag.name}});
        break;
      default:
        break;
    }
  }

}
