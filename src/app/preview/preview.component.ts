import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'shared/search.service';
import { Subscription } from 'rxjs';
import * as html2canvas from 'html2canvas';
import { NguCarousel } from "@ngu/carousel";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  @ViewChildren('photos', {read: ElementRef} ) photos: QueryList<ElementRef>;
  carouselOne: NguCarousel;
  sub: Subscription;
  imagesURL: PostImage[][] = [];
  photosReady: number;
  imagesOutput: string[] = []; // output images data


  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {
    // reset output images
    this.photosReady = 0;
    this.imagesOutput = [];

    // convert array to 2D array for photos combination
    this.imagesURL = this.create2dArray(this.searchService._images);
    this.sub = this.searchService.images.subscribe(images => {
      this.imagesURL = this.create2dArray(images);
    });

    // carousel setting
    this.carouselOne = {
      grid: {xs: 3, sm: 3, md: 3, lg: 3, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: false
      },
      load: 2,
      touch: true,
      easing: 'ease-out',
      loop: true
    };
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

  goNext() {

  }

  isReady() {
    // calculate how many photos url is replaced
    this.photosReady += 1;

    // this.startExport();
  }

  startExport() {
    // when photos all ready, then auto export images
    if (this.photosReady === this.imagesURL.length * 2) {

      // call after angular check view done
      setTimeout(() => {
        this.exportImages();
        // done exporting
      });
    } else {
      // TODO: convert image url to data url
      // check which one is not ready
    }
  }

  exportImages() {
    // export canvas from view
    this.photos.forEach(item => {
      this.exportCanvas(item.nativeElement, (img: string) => {

        // store images data
        this.imagesOutput.push(img);
      });
    });
  }

  exportCanvas(element, callback) {
    html2canvas(element, {
      async: true,
      scale: 2.796,
      height: 433.12
    }).then(canvas => {
      const img = canvas.toDataURL('image/jpeg');
      callback(img);
    });
  }



}
