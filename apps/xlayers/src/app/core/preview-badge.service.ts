import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WINDOW } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class PreviewBadgeService {
  badge = 'BETA';

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly translateService: TranslateService
  ) {}

  computeBadge() {
    try {
      const hostname = this.window.location.hostname;
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0'
      ) {
        return this.translateService.instant('BADGE_SERVICE.LOCAL');
      } else if (hostname.startsWith('next.')) {
        return this.translateService.instant('BADGE_SERVICE.MAIN');
      } else if (hostname.includes('netlify')) {
        return this.translateService.instant('BADGE_SERVICE.PR');
      }

      return this.badge;
    } catch (errror) {
      return this.badge;
    }
  }
}
