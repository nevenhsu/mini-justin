import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from 'shared/search.service';
import { Router } from '@angular/router';
import * as printer from '../../external/js/printerAPI/printer-edit.js';


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit, OnDestroy {
  images: Array<string> = [];
  duration: number; // seconds of progress bar

  constructor(private searchService: SearchService,
              private router: Router) { }

  ngOnInit() {
    this.images = this.searchService.imagesData;
    printer.setTotolImages(this.images.length * 2);
    this.duration = 20 * this.images.length; // 30 sec for each images
    this.checkImages(() => {
      printer.init();
      // print images when printer is ready
      setTimeout( () => {
        this.checkState();
      }, 2000);
    });
  }

  ngOnDestroy() {
    // reset printer state to false
    this.searchService.clearImages();
  }

  checkState() {
    const STATUS = printer.printerStatus;
    // 65537 or 0 is idle
    if (STATUS === 65537 || STATUS === 0) {
      console.log('JESS: Printer is ready.');

      setTimeout(() => {
        this.startPrint();
      }, 500);
      this.checkPrintFinish();

    } else {

      // if occurs error, then go to error page
      const ERRORS = [65544, 65552, -2147483648, 1024, 769, 1025, 768, 4096, 31, 524288, 512];
      if (ERRORS.indexOf(STATUS) !== -1 ) {
        this.router.navigate(['error'], {queryParams: {error: STATUS}});
        sessionStorage.setItem('isPrintOk', 'no');
        return;
      }

      // wait websocket connected and retry
      setTimeout(() => {
        this.checkState();
      }, 1000);
    }
  }

  startPrint() {
    console.log('JESS: Start printing photos.');
    sessionStorage.setItem('isPrintOk', 'ok');
    for (let i = 0; i < this.images.length; i++) {
      const IMAGE = this.images[i];
      setTimeout(() => {
        printer.downloadImageCmd(IMAGE);
      }, 3000 * i);
    }
  }

  checkImages(callback) {
    if (this.images.length === 0) {
      console.log('JESS: No images data for printing. Return home.');
      this.router.navigate(['']);
    } else {
      // images exist
      callback();
    }
  }

  checkPrintFinish() {
    setTimeout( () => {
      const CHECKFINISH = setInterval( () => {
        console.log('JESS: check isFinish state');
        if (printer.isFinish) {
          clearInterval(CHECKFINISH);
          this.transitionEnd();
        }
      }, 2000);
    }, 10000 * this.images.length);
  }

  transitionEnd() {
    console.log('JESS: Printing is done. Return home.');
    // when animation ends then return home page
    this.router.navigate(['']);
  }

}
