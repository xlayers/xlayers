import { Component } from '@angular/core';

@Component({
  selector: 'sketch-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      position: relative;
      height: 100%;
      display: block;
    }
  `]
})
export class AppComponent {}
