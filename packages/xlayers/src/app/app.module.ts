import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import * as javascript from 'highlight.js/lib/languages/javascript';
import * as scss from 'highlight.js/lib/languages/scss';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as xml from 'highlight.js/lib/languages/xml';
import { HighlightModule } from 'ngx-highlightjs';
import { AppComponent } from './app.component';
import { WINDOW_PROVIDERS } from './core/window.service';

export const routes: Route[] = [{
  path: '', redirectTo: '/home', pathMatch: 'full'
}, {
  path: 'home', loadChildren: './home/home.module#HomeModule'
}, {
  path: 'editor', loadChildren: './editor/editor.module#EditorModule'
}, {
  path: '**', redirectTo: '/home'
}];

export function hljsLanguages() {
  return [
    {name: 'typescript', func: typescript},
    {name: 'javascript', func: javascript},
    {name: 'scss', func: scss},
    {name: 'vue', func: xml},
  ];
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HighlightModule.forRoot({
      languages: hljsLanguages
    }),
    // TODO(manekinekko): enable SW support when it's stable
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [WINDOW_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
