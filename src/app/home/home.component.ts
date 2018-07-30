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
  trying = 0 ; // count trying times

  constructor(private router: Router,
              private searchService: SearchService) { }

  ngOnInit() {
    this.getHashTag();
    this.searchService.clearImages();
    this.firstCheckPrinter();
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

  firstCheckPrinter() {
    this.isPrintOk = sessionStorage.getItem('isPrintOk');
    if (this.isPrintOk !== 'ok') {
      printer.init();
      setTimeout(() => {
        this.detectPrinterError();
      }, 2000);
    }
  }

  detectPrinterError() {
    const checking = setInterval(() => {
      const STATUS = printer.printerStatus;
      console.log('JESS: detect Printer Status: ', STATUS);

      if (STATUS !== 65537 && STATUS !== 65538 && STATUS !== 0 && STATUS !== 2 && STATUS !== 65664 && !!STATUS) {
        // this.trying++;
        // if (this.trying > 15) {clearInterval(checking); }

        // if error detect, then go to error page
        // const ERRORS = [65544, 65552, -2147483648, 1024, 769, 1025, 768, 4096, 31, 524288, 512, 65664];
        // if (ERRORS.indexOf(STATUS) !== -1 ) {
          clearInterval(checking);
          this.router.navigate(['error'], {queryParams: {error: STATUS}});
        // }
      } else if (!STATUS) {
        // printer is not connected
        return;
      } else {
        // printer is idle or printing
        clearInterval(checking);
      }
    }, 2000);
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
