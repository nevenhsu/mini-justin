import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatKeyboardModule } from '@ngx-material-keyboard/core';
import { MatButtonModule } from '@angular/material';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { NguCarouselModule } from '@ngu/carousel';
import { InViewportModule } from 'ng-in-viewport';
import 'hammerjs';

import { SearchService } from 'shared/search.service';
import { AutofocusDirective } from 'shared/autofocus.directive';
import { ImageDimensionDirective } from 'shared/image-dimension.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TypeComponent } from './type/type.component';
import { SelectComponent } from './select/select.component';
import { PreviewComponent } from './preview/preview.component';
import { NavComponent } from 'shared/nav/nav.component';
import { ChooseIgComponent } from './type/choose-ig/choose-ig.component';
import { ImageThumbnailComponent } from 'shared/image-thumbnail/image-thumbnail.component';
import { CounterComponent } from './select/counter/counter.component';
import { PhotoComponent } from './preview/photo/photo.component';
import { PrintComponent } from './print/print.component';
import { KeyboardComponent } from './type/keyboard/keyboard.component';
import { BubbleComponent } from 'shared/bubble/bubble.component';
import { PrivacyErrorComponent } from './select/privacy-error/privacy-error.component';
import { ErrorComponent } from './error/error.component';



const appRoutes: Routes = [
  {path: 'print', component: PrintComponent},
  {path: 'preview', component: PreviewComponent},
  {path: 'select', component: SelectComponent},
  {path: 'type', component: TypeComponent},
  {path: '', component: HomeComponent},
  {path: '**', component: ErrorComponent}
];

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pan: {
      direction: 6
    },
    pinch: {
      enable: false
    },
    rotate: {
      enable: false
    }
  };
  options = {
    touchAction: 'pan-y'
  };
}


@NgModule({
  declarations: [
    AutofocusDirective,
    ImageDimensionDirective,
    AppComponent,
    HomeComponent,
    TypeComponent,
    SelectComponent,
    PreviewComponent,
    NavComponent,
    ChooseIgComponent,
    ImageThumbnailComponent,
    CounterComponent,
    PhotoComponent,
    PrintComponent,
    KeyboardComponent,
    BubbleComponent,
    PrivacyErrorComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    AngularCropperjsModule,
    NguCarouselModule,
    InViewportModule.forRoot(),
    // Material modules
    MatButtonModule,
    MatKeyboardModule
  ],
  providers: [
    SearchService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
