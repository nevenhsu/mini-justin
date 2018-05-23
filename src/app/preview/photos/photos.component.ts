import { EventEmitter, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import { ImageCropperSetting, ImageCropperResult } from 'angular-cropperjs/angular-cropperjs.component';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  @ViewChild('photo', {read: ElementRef}) photo: ElementRef;
  @Input('imageURL') imageURL: string;
  @Output('isReady') isReady = new EventEmitter<boolean>();
  isHorizon = true;
  config: any;
  cropBox: any;
  dataUrl: string;

  constructor() {
  }

  ngOnInit() {
    // need to replace url by cropper
    this.dataUrl = this.imageURL;

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
    if (!event.type) {
      return;
    }

    // TODO: set function async
    // auto export crop image
    setTimeout(() => {
      this.angularCropper.exportCanvas(true);
    });
  }

  export(el: ImageCropperResult) {
    if (this.dataUrl !== el.dataUrl) {
      this.dataUrl = el.dataUrl;
      this.isReady.emit(true);
    }
  }
}
