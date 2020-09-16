import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PreviewBadgeService } from '../core/preview-badge.service';
import { WINDOW } from '../core/window.service';

describe('PreviewBadgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        PreviewBadgeService,
        {
          provide: WINDOW,
          useValue: {},
        },
      ],
    });
  });

  it('should set badge to LOCAL PREVIEW when running on a local machine', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'localhost' } },
    });
    const service: PreviewBadgeService = TestBed.inject(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('BADGE_SERVICE.LOCAL');
  });

  it('should set badge to MAIN PREVIEW when running on next', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'next.' } },
    });
    const service: PreviewBadgeService = TestBed.inject(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('BADGE_SERVICE.MAIN');
  });

  it('should set badge to PR PREVIEW when running on netlify', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'netlify' } },
    });
    const service: PreviewBadgeService = TestBed.inject(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('BADGE_SERVICE.PR');
  });

  it('should set badge to BETA when running on any other location', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'xlayers' } },
    });
    const service: PreviewBadgeService = TestBed.inject(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('BETA');
  });
});
