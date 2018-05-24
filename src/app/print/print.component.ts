import { Component, OnInit } from '@angular/core';
import { SearchService } from 'shared/search.service';

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
  }

}
