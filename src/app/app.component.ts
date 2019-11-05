import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

declare var gtag;

@Component({
  selector: 'xly-root',
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
export class AppComponent {
  constructor(
    readonly iconRegistry: MatIconRegistry,
    readonly sanitizer: DomSanitizer,
    readonly router: Router,
    readonly translate: TranslateService) {

      iconRegistry.addSvgIcon('angular', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/angular.svg'));
      iconRegistry.addSvgIcon('angularElement', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/angularElement.svg'));
      iconRegistry.addSvgIcon('react', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/react.svg'));
      iconRegistry.addSvgIcon('vue', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/vue.svg'));
      iconRegistry.addSvgIcon('wc', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/wc.svg'));
      iconRegistry.addSvgIcon('stencil', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/stencil.svg'));
      iconRegistry.addSvgIcon('litElement', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/litElement.svg'));
      iconRegistry.addSvgIcon('html', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/html.svg'));
      iconRegistry.addSvgIcon('text', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/text.svg'));
      iconRegistry.addSvgIcon('xamarinForms', sanitizer.bypassSecurityTrustResourceUrl('assets/codegen/xamarinForms.svg'));

      router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {

        gtag('config', 'UA-120660908-1', {
          'page_path': event.urlAfterRedirects
        });

      });

      translate.addLangs(['en', 'nl']);
      translate.setDefaultLang('en');

      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|nl/) ? browserLang : 'en');
  }
}
