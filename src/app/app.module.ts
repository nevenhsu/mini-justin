import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatKeyboardModule } from '@ngx-material-keyboard/core';
import { MatButtonModule } from '@angular/material';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TypeComponent } from './type/type.component';
import { SelectComponent } from './select/select.component';
import { PreviewComponent } from './preview/preview.component';
import { NavComponent } from 'shared/nav/nav.component';
import { ChooseIgComponent } from './type/choose-ig/choose-ig.component';

import { AutofocusDirective } from 'shared/autofocus.directive';
import { SearchService } from 'shared/search.service';
import { HttpClientModule } from '@angular/common/http';
import { ImageThumbnailComponent } from 'shared/image-thumbnail/image-thumbnail.component';
import { ScrollTrackerDirective } from 'shared/scroll-tracker.directive';
import { CounterComponent } from './select/counter/counter.component';
import { PhotosComponent } from './preview/photos/photos.component';
import { KonvaModule } from 'ng2-konva';


const appRoutes: Routes = [
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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    // Material modules
    MatButtonModule,
    MatKeyboardModule,
    KonvaModule
  ],
  providers: [
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
