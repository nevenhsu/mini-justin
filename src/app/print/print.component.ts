import { Component, OnInit } from '@angular/core';
import { SearchService } from 'shared/search.service';
import * as printer from '../../external/js/printerAPI/printer-edit.js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  images: Array<string> = [];

  constructor(private searchService: SearchService,
              private router: Router) { }

  ngOnInit() {
    this.images = this.searchService.imagesData;
    this.checkImages();
  }

  checkStatus() {
    // 0 is ready, 65537 is idle
    const STATE =  printer.Cookies.get('printer');
    if (STATE && printer.READY_STATUS) {
      console.log(STATE, printer.READY_STATUS);
      this.startPrint();
    } else {
      // wait websocket connected and retry
      setTimeout(() => {
        this.checkStatus();
      }, 1000);
    }
  }

  startPrint() {
    for (let i = 0; i < this.images.length; i++) {
      const IMAGE = this.images[i];
      printer.downloadImageCmd(IMAGE);
    }
  }

  checkImages() {
    if (this.images.length === 0) {
      this.router.navigate(['']);
    } else {
      printer.init();
      this.checkStatus();
    }
  }

}
