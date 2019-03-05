import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@app/core/window.service';

@Injectable({
  providedIn: 'root'
})
export class PreviewBadgeService {
  badge = 'BETA';

  constructor(@Inject(WINDOW) private readonly window: Window) {}

  computeBadge() {
    try {
      const hostname = this.window.location.hostname;
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0'
      ) {
        return 'LOCAL PREVIEW';
      } else if (hostname.startsWith('next.')) {
        return 'MASTER PREVIEW';
      } else if (hostname.includes('netlify')) {
        return 'PR PREVIEW';
      }

      return this.badge;
    } catch (errror) {
      return this.badge;
    }
  }
}
