import { AfterContentInit, AfterViewChecked, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, AfterViewChecked {
  @ViewChild('photo', {read: ElementRef}) photo: ElementRef;
  @Input('imageURL') imageURL: string;
  isHorizon = true;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {}

  ngAfterViewChecked() {
    this.renderer.setAttribute(this.photo.nativeElement, 'crossOrigin', 'Anonymous');
    this.photo.nativeElement.src = this.imageURL;
  }

  calDimension(event) {
    const W = event.width;
    const H = event.height;
    this.isHorizon = W > H;
  }

}
