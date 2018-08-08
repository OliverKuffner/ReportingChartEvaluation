import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EchartsComponent } from './echarts/echarts.component';
import { ChartJsComponent } from './chartJs/chartJs.component';

@NgModule({
  declarations: [
    AppComponent,
    EchartsComponent,
    ChartJsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
