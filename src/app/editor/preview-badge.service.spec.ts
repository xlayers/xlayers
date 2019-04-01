import { TestBed } from '@angular/core/testing';
import { WINDOW } from '@app/core/window.service';
import { PreviewBadgeService } from '@app/core/preview-badge.service';

describe('PreviewBadgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
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
    expect(badge).toBe('LOCAL PREVIEW');
  });

  it('should set badge to MASTER PREVIEW when running on next', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'next.' } }
    });
    const service: PreviewBadgeService = TestBed.get(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('MASTER PREVIEW');
  });

  it('should set badge to PR PREVIEW when running on netlify', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: { location: { hostname: 'netlify' } }
    });
    const service: PreviewBadgeService = TestBed.get(PreviewBadgeService);
    const badge = service.computeBadge();
    expect(badge).toBe('PR PREVIEW');
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
