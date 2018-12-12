import { Injectable } from '@angular/core';
import { XlayersNgxEditorModel } from '../code-editor/editor-container/codegen/codegen.service';
import sdk from '@stackblitz/sdk';

@Injectable({
  providedIn: 'root'
})
export class ExportStackblitzService {

  constructor() { }

  async export(content: Array<XlayersNgxEditorModel>) {

    const files = {};
    for (let i = 0; i < content.length; i++) {
      for (let prop in content[i]) {
        if (prop === 'uri') {
          files[`src/app/xlayers/`+content[i].uri] = content[i].value;
        }
      }
    }

    files['src/app/app.component.ts'] = `
import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: '<app-xlayers></app-xlayers>',
})
export class AppComponent  {}
    `;
    files['src/app/app.module.ts'] = `
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { XlayersModule } from './xlayers/xlayers.module';
@NgModule({
  imports:      [ BrowserModule, XlayersModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
    `;
    files['src/main.ts'] = `
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule)
    `;
    files['src/index.html'] = '<my-app>loading</my-app>';

    const project = {
      files,
      title: 'xlayers',
      description: 'xLayers generated project',
      template: 'angular-cli',
      tags: ['angular', 'xlayers'],
      dependencies: {}
    };


    sdk.openProject(project);
  }
}
