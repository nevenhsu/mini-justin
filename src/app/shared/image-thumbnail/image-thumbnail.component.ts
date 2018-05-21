import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchService } from 'shared/search.service';

@Component({
  selector: 'app-image-thumbnail',
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.scss']
})
export class ImageThumbnailComponent implements OnInit {
  @Output('cal') cal = new EventEmitter();
  @Input('image') image: PostImage;
  quantity = 0;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.searchService._images.forEach(image => {
      if (image.id === this.image.id) {
        this.quantity += 1;
      }
    });
  }

  add() {
    this.quantity += 1;
    let i = this.searchService._images.indexOf(this.image);
    i = i >= 0 ? i : 0;
    this.searchService._images.splice(i, 0, this.image);
    this.searchService.updateImages();
  }

  remove() {
    if (this.quantity === 0) {return; }
    this.quantity -= 1;
    this.searchService._images.splice(this.searchService._images.indexOf(this.image), 1);
    this.searchService.updateImages();
  }
}

