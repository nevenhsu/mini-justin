import { Component, OnInit } from '@angular/core';
import { SearchService } from 'shared/search.service';
import * as printer from '../../external/js/printerAPI/printer-edit.js';


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  images: Array<string> = [];

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.images = this.searchService.imagesData;
    printer.default.init();
    console.log(printer.default);
  }

}
