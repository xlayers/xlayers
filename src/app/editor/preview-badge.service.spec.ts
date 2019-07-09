import { TestBed } from '@angular/core/testing';
import { WINDOW } from '@app/core/window.service';
import { PreviewBadgeService } from '@app/core/preview-badge.service';
import { TranslateModule } from '@ngx-translate/core';

describe('PreviewBadgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        PreviewBadgeService,
        {
          provide: WINDOW,
          useValue: {}
        }
      ]
    });
  });

  it('should set badge to LOCAL PREVIEW when running on a local machine', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'localhost' } }
    });
    const service: PreviewBadgeService = TestBed.get(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('BADGE_SERVICE.LOCAL');
  });

  it('should set badge to MASTER PREVIEW when running on next', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'next.' } }
    });
    const service: PreviewBadgeService = TestBed.get(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('BADGE_SERVICE.MASTER');
  });

  it('should set badge to PR PREVIEW when running on netlify', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'netlify' } }
    });
    const service: PreviewBadgeService = TestBed.get(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('BADGE_SERVICE.PR');
  });

  it('should set badge to BETA when running on any other location', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'xlayers' } }
    });
    const service: PreviewBadgeService = TestBed.get(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('BETA');
  });
});
