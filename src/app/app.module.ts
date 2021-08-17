import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Reducer } from '../app/schemaEditor/state/reducer';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent, MainComponent } from './app.component';
import { SchemaEditorComponent } from './schemaEditor/schema-edit.component';
import {ListComponent}from './schemaEditor/components/list/list.component';
import {AccordianComponent} from '../app/schemaEditor/components/accordian/acc.component';
import {FormComponent} from '../app/schemaEditor/components/form/form.component';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ListComponent,
    AccordianComponent,
    FormComponent,
    SchemaEditorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    StoreModule.forRoot({ 'node': Reducer}),

    ReactiveFormsModule,
    FormsModule,
 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
