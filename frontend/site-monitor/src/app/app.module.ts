import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table'
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppComponent } from './app.component';
import { StatusLayoutComponent } from './status-layout/status-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryCollapserComponent } from './category-collapser/category-collapser.component';
import { ServerTabsComponent } from './server-tabs/server-tabs.component';
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    StatusLayoutComponent,
    CategoryCollapserComponent,
    ServerTabsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatExpansionModule,
    MatTabsModule,
    HttpClientModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
