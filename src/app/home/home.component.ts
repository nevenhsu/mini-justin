import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'shared/search.service';
import * as printer from '../../external/js/printerAPI/printer-edit.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  // TODO: restructure return url on service

  hashtag: Hashtag;
  isPrintOk?: string; // already print
  trying = 0 ;

  constructor(private router: Router,
              private searchService: SearchService) { }

  ngOnInit() {
    this.getHashTag();
    this.searchService.clearImages();
    this.fistCheckPrinter();

    const checking = setInterval(() => this.checkStatus(() => {
      clearInterval(checking);
    }), 2000);
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

  fistCheckPrinter() {
    this.isPrintOk = sessionStorage.getItem('isPrintOk');
    if (this.isPrintOk !== 'ok') {
      printer.init();
    }
  }

  checkStatus(callback) {
    const STATUS = printer.printerStatus;
    if (STATUS !== 65537 || STATUS !== 0 || STATUS !== 2 || STATUS  !== 65538) {
      this.trying++;
      if (this.trying > 15) {
        callback();
        return;
      }
      const ERRORS = [65544, 65552, -2147483648, 1024, 769, 1025, 768, 4096, 31, 524288, 512];
      if (ERRORS.indexOf(STATUS) !== -1 ) {
        callback();
        this.router.navigate(['error'], {queryParams: {error: STATUS}});
      }
    } else {
      callback();
    }
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
