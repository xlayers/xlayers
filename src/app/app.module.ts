import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

export const routes: Route[] = [{
  path: '', redirectTo: '/home', pathMatch: 'full'
}, {
  path: 'home', loadChildren: 'src/app/home/home.module#HomeModule'
}, {
  path: 'editor', loadChildren: 'src/app/editor/editor.module#EditorModule'
}, {
  path: '**', redirectTo: '/home'
}];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
