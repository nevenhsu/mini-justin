import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TypeComponent } from './type/type.component';
import { SelectComponent } from './select/select.component';
import { PreviewComponent } from './preview/preview.component';


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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
