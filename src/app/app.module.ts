import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatKeyboardModule } from '@ngx-material-keyboard/core';
import { MatButtonModule } from '@angular/material';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { NguCarouselModule } from '@ngu/carousel';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TypeComponent } from './type/type.component';
import { SelectComponent } from './select/select.component';
import { PreviewComponent } from './preview/preview.component';
import { NavComponent } from 'shared/nav/nav.component';
import { ChooseIgComponent } from './type/choose-ig/choose-ig.component';
import { ImageThumbnailComponent } from 'shared/image-thumbnail/image-thumbnail.component';
import { CounterComponent } from './select/counter/counter.component';
import { PhotosComponent } from './preview/photos/photos.component';

import { SearchService } from 'shared/search.service';
import { ScrollTrackerDirective } from 'shared/scroll-tracker.directive';
import { AutofocusDirective } from 'shared/autofocus.directive';
import { ImageDimensionDirective } from 'shared/image-dimension.directive';
import { PrintComponent } from './print/print.component';



const appRoutes: Routes = [
  {path: 'print', component: PrintComponent},
  {path: 'preview', component: PreviewComponent},
  {path: 'select', component: SelectComponent},
  {path: 'type', component: TypeComponent},
  {path: '', component: HomeComponent},
  {path: '**', component: HomeComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TypeComponent,
    SelectComponent,
    PreviewComponent,
    AutofocusDirective,
    NavComponent,
    ChooseIgComponent,
    ImageThumbnailComponent,
    ScrollTrackerDirective,
    CounterComponent,
    PhotosComponent,
    ImageDimensionDirective,
    PrintComponent,
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
    // Material modules
    MatButtonModule,
    MatKeyboardModule
  ],
  providers: [
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
