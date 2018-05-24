import { EventEmitter, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import { ImageCropperResult } from 'angular-cropperjs/angular-cropperjs.component';


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  @ViewChild('photo', {read: ElementRef}) photo: ElementRef;
  @Input('imageURL') imageURL: string;
  @Output('isDone') isDone = new EventEmitter<boolean>();
  isHorizon = true; // set for image cover css
  isReady: boolean; // is cropper setting up
  isUrlReplaced: boolean; // is image url replaced
  dataUrl: string;
  config: any;
  cropBox: any;


  constructor() {
  }

  ngOnInit() {
    // default url, need to replace url by cropper
    this.dataUrl = this.imageURL;
    this.isUrlReplaced = false;
    this.isReady = false;

    this.cropBox = {
      left: 0,
      top: 0,
      width: 1640,
      height: 1640
    };
    this.config = {
      checkCrossOrigin: 'anonymous',
      aspectRatio: 1,
      viewMode: 3,
      minContainerWidth: 1640,
      minContainerHeight: 1640,
      minCanvasWidth: 1640,
      minCanvasHeight: 1640,
    };
  }


  calDimension(event) {
    // set img cover
    const W = event.width;
    const H = event.height;
    this.isHorizon = W > H;
  }

  onReady(event) {
    // prevent call twice
    if (!event.type) { return; }
    this.isReady = true;
  }

  startExport() {
    if (this.isReady) {
      // if url not replaced then export canvas again
      if (!this.isUrlReplaced) {
        this.angularCropper.exportCanvas(true);
      }
    } else {
      // call again
      setTimeout(() => {
        this.startExport();
      }, 500);
    }
  }

  doneExport(el: ImageCropperResult) {
    // export callback
    if (this.dataUrl !== el.dataUrl) {
      // replace image url to data url
      this.dataUrl = el.dataUrl;
      this.isUrlReplaced = true;

      // wait for angular view updated
      setTimeout(() => {
        this.isDone.emit(true);
      });
    }
  }
}
