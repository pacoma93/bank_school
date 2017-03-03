import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent }   from './app.component';
@NgModule({
    imports: [BrowserModule, ReactiveFormsModule, HttpModule,  JsonpModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
