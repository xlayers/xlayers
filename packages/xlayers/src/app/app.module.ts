import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, Route, RouterModule } from '@angular/router';
import { WINDOW_PROVIDERS } from '@app/core/window.service';
import { environment } from '@env/environment';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import * as javascript from 'highlight.js/lib/languages/javascript';
import * as scss from 'highlight.js/lib/languages/scss';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as xml from 'highlight.js/lib/languages/xml';
import { HighlightModule } from 'ngx-highlightjs';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { UiState } from './core/state';
import { CodeGenState } from './core/state/page.state';
import { EditorGuardService } from './editor-guard.service';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: '../home/home.module#HomeModule'
  },
  {
    path: 'editor',
    canActivate: [EditorGuardService],
    canActivateChild: [EditorGuardService],
    loadChildren: './editor/editor.module#EditorModule'
  },
  {
    path: 'upload',
    loadChildren: './upload/upload.module#UploadModule'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

export function hljsLanguages() {
  return [
    { name: 'typescript', func: typescript },
    { name: 'javascript', func: javascript },
    { name: 'scss', func: scss },
    { name: 'vue', func: xml }
  ];
}

const StoreDebugModule = [
  NgxsModule.forRoot([UiState, CodeGenState], {
    /**
     * WARNING: dont enbale the `developmentmode` config until it's been fixed!
     * ENABLING THIS, WILL THROW: TypeError: Cannot assign to read only property 'microTask' of object '[object Object]'
     * See similar issue in NgRx: https://github.com/brandonroberts/ngrx-store-freeze/issues/17
     */
    // developmentMode: !environment.production
  }),
  NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
  NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
  NgxsRouterPluginModule.forRoot()
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreDebugModule,
    CoreModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: !environment.production,
      preloadingStrategy: PreloadAllModules
    }),
    HighlightModule.forRoot({
      languages: hljsLanguages
    })
    // TODO(manekinekko): enable SW support when it's stable
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [WINDOW_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {}
