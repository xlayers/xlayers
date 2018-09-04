import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

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
    NoopAnimationsModule,
    RouterModule.forRoot(routes, {useHash: true}),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
