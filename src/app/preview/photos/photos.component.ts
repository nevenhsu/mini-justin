import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { KonvaComponent } from 'ng2-konva';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, AfterViewChecked {
  @ViewChild('stage') stage: KonvaComponent;
  configStage: Observable<object>;
  configLine = new BehaviorSubject({});
  configRect = new BehaviorSubject({});
  configClipL: Observable<object>;

  configTest: Observable<object>;

  constructor() { }

  ngOnInit() {
    this.configStage = Observable.of({
      width: 644,
      height: 436
    });

    this.configClipL = Observable.of({
      clipFunc: function (context: any) {
        context.rect(16, 16, 288, 288);
      }
    });

    this.configTest = Observable.of({
      x: 16,
      y: 16,
      width: 644,
      height: 436,
      fill: 'red',
      stroke: '#9B9B9B',
      strokeWidth: 8
    });
  }


  ngAfterViewChecked() {
    const midX = this.stage.getStage().width() / 2;
    const maxY = this.stage.getStage().height();

    // create line
    this.configLine.next({
      sceneFunc: function(context: any) {
        context.beginPath();
        context.moveTo(midX, 0);
        context.lineTo(midX, maxY);
        context.closePath();
        context.fillStrokeShape(this);
      },
      fill: '#9B9B9B',
      stroke: '#9B9B9B',
      strokeWidth: 1
    });

    // create frame
    this.configRect.next({
      x: 0,
      y: 0,
      width: midX * 2,
      height: maxY,
      fill: 'white',
      stroke: '#9B9B9B',
      strokeWidth: 1.5
    });
  }



}
