import { Component, ElementRef, isDevMode, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'shared/search.service';
import { Subscription } from 'rxjs';
import { NguCarousel } from '@ngu/carousel';
import { PhotoComponent } from './photo/photo.component';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  @ViewChildren('photosEl', {read: ElementRef} ) photosEl: QueryList<ElementRef>; // for extract canvas data url
  @ViewChildren('photo') photos:  QueryList<PhotoComponent>; // for generate image data url
  carouselOne: NguCarousel;
  sub: Subscription;
  imagesURL: PostImage[][] = []; // origin images url
  photosReady: number; // is all photo ready to extract data
  isPending: boolean; // is generating images
  testimages: Array<string> = []; // for test
  isDevMode = isDevMode();

  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {
    // carousel setting
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 100,
      interval: 4000,
      point: {
        visible: false
      },
      load: 2,
      touch: true,
      easing: 'ease-out',
      loop: true
    };

    // reset output images
    this.photosReady = 0;
    this.searchService.imagesData = [];
    this.isPending = false;

    // convert array to 2D array for photosEl combination
    this.imagesURL = this.create2dArray(this.searchService._images);
    this.sub = this.searchService.images$.subscribe(images => {
      this.imagesURL = this.create2dArray(images);
    });

    // if service no image
    if (this.searchService._images.length === 0) {
      this.goPrev();
    }
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
    // call photo component export url data to replace photo url
    // photoDone is listening to photo isDone
    this.isPending = true;
    this.photos.forEach(photo => {
      photo.startExport();
    });
  }

  photoDone() {
    // listen to cropper js ready
    // calculate how many photosEl url is replaced
    this.photosReady += 1;

    // photos all ready then call html2canvas
    if (this.photosReady === this.imagesURL.length * 2) {

      // extract nativeElements into array
      const nativeElements: Array<any> = [];
      const PHOTOSEL = this.photosEl.toArray();
      for (let i = 0; i < PHOTOSEL.length; i++) {
        nativeElements.push(PHOTOSEL[i].nativeElement);
      }

      this.exportImages(nativeElements, () => {
        // TODO: should use observable in goNext
        // when all stored then go print
        if (this.searchService.imagesData.length === this.imagesURL.length) {
          console.log('Successfully export images data! ');
          this.isPending = false;
          if (!this.isDevMode) {
            this.router.navigate(['print']);
          }
        } else {
          this.isPending = false;
          console.log('ERROR: canvas exports are not completed! \n DataUrls Number:', this.searchService.imagesData.length);
          // check if url is not replaced, photo component should regenerate images data
        }
      });
    }
  }

  exportImages(items: Array<object>, callback) {
    const REQUESTS = items.map((item => {
      return new Promise(resolve => {
        this.exportCanvas(item, resolve);
      });
    }));

    Promise.all(REQUESTS).then((values) => {
      // store all images data to service
      for (const value of values) {
        this.searchService.imagesData.push(value as string);
        this.testimages.push(value as string);
      }
      callback();
    });
  }

  exportCanvas(item, callback) {
    html2canvas(item, {
      async: true,
      scale: 2.796,
      height: 433.12
    }).then(canvas => {
      const img = canvas.toDataURL('image/jpeg');
      callback(img);
    });
  }

}
