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
    this.duration = 30 * this.images.length; // 30 sec for each images
    this.checkImages(() => {
      printer.init();
      // print images when printer is ready
      this.checkState();
    });
  }

  ngOnDestroy() {
    // reset printer state to false
    printer.Cookies.set('printer', 'false');
  }

  checkState() {
    // 0 is ready, 65537 is idle
    const STATE =  printer.Cookies.get('printer');
    if (STATE && printer.READY_STATUS) {
      setTimeout(() => {
        this.startPrint();
      }, 500);
    } else {
      // wait websocket connected and retry
      setTimeout(() => {
        console.log('JESS: Websocket is not ready. Retrying.');
        this.checkState();
      }, 500);
    }
  }

  startPrint() {
    console.log('JESS: Start printing photos.');
    for (let i = 0; i < this.images.length; i++) {
      const IMAGE = this.images[i];
      printer.downloadImageCmd(IMAGE);
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

  transitionEnd(e) {
    console.log('JESS: Printing is done. Return home.', e);
    // when animation ends then return home page
    this.router.navigate(['']);
  }

}
