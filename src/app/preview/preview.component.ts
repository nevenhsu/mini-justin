import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'shared/search.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {
  }

  goPrev() {
    const URL = this.searchService.prevUrl.url;
    const QUERY = this.searchService.prevUrl.queryParams;
    this.router.navigate([URL], {queryParams: QUERY});
  }
}
