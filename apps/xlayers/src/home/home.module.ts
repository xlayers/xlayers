import { RouterModule, Route } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { InteractiveBgComponent } from './interactive-bg/interactive-bg.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

export const routes: Route[] = [
  {
    path: '',
    component: LandingComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LandingComponent, InteractiveBgComponent],
})
export class HomeModule {}
