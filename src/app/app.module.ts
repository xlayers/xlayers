import { HttpClientModule, HttpClient } from '@angular/common/http';
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
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { UiState } from './core/state';
import { CodeGenState } from './core/state/page.state';
import { EditorGuardService } from './editor-guard.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'editor',
    canActivate: [EditorGuardService],
    canActivateChild: [EditorGuardService],
    loadChildren: () =>
      import('./editor/editor.module').then(m => m.EditorModule)
  },
  {
    path: 'upload',
    loadChildren: () =>
      import('./upload/upload.module').then(m => m.UploadModule)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

export function getHighlightLanguages() {
  return {
    typescript: () => import('highlight.js/lib/languages/typescript'),
    javascript: () => import('highlight.js/lib/languages/javascript'),
    scss: () => import('highlight.js/lib/languages/scss'),
    xml: () => import('highlight.js/lib/languages/xml')
  };
}

const StoreDebugModule = [
  NgxsModule.forRoot([UiState, CodeGenState], {
    /**
     * WARNING: dont enbale the `developmentmode` config until it's been fixed!
     * ENABLING THIS, WILL THROW: TypeError: Cannot assign to read only property 'microTask' of object '[object Object]'
     * See similar issue in NgRx: https://github.com/brandonroberts/ngrx-store-freeze/issues/17
     */
    developmentMode: !environment.production
  }),
  NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
  NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
  NgxsRouterPluginModule.forRoot()
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreDebugModule,
    CoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: !environment.production,
      preloadingStrategy: PreloadAllModules
    }),
    HighlightModule
    // TODO(manekinekko): enable SW support when it's stable
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    WINDOW_PROVIDERS,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages()
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
