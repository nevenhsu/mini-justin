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
  }

  add() {
    this.quantity += 1;
    let i = this.searchService.images.indexOf(this.image);
    i = i >= 0 ? i : 0;
    this.searchService.images.splice(i, 0, this.image);
    this.cal.emit(1);
  }

  remove() {
    if (this.quantity === 0) {return; }
    this.quantity -= 1;
    this.searchService.images.splice(this.searchService.images.indexOf(this.image), 1);
    this.cal.emit(-1);
  }

}
