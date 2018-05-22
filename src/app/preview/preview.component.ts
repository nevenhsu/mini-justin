import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'shared/search.service';
import { Subscription } from 'rxjs';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  @ViewChildren('photos', {read: ElementRef} ) photos: QueryList<ElementRef>;

  sub: Subscription;
  imagesArray: PostImage[][] = [];
  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {
    this.imagesArray = this.create2dArray(this.searchService._images);
    this.sub = this.searchService.images.subscribe(images => {
      this.imagesArray = this.create2dArray(images);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getImgData() {
    console.log('click!');
    this.photos.forEach(item => {
      this.test(item.nativeElement);
    });
  }


  create2dArray(array: Array<any>) {
    const NEWARRAY: PostImage[][] = [];
    for (let i = 0; i < Math.floor(array.length / 2); i++) {
      NEWARRAY[i] = [];
      for (let j = 0; j < 2; j++) {
        NEWARRAY[i][j] = array[i * 2 + j];
      }
    }
    return NEWARRAY;
  }

  goPrev() {
    const URL = SearchService.getSafe(() => this.searchService.prevUrl.url);
    const QUERY = SearchService.getSafe(() => this.searchService.prevUrl.queryParams);
    if (URL && QUERY) {
      this.router.navigate([URL], {queryParams: QUERY});
    } else {
      this.router.navigate(['']);
    }
  }

  test(element) {
    html2canvas(element, {allowTaint: true}).then(canvas => {
      // document.body.appendChild(canvas);
      const img = canvas.toDataURL('image/jpeg');
      console.log(img);
    });
  }

}
