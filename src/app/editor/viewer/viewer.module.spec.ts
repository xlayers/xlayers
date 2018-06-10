import { ViewerModule } from './viewer.module';

describe('ViewerModule', () => {
  let viewerModule: ViewerModule;

  beforeEach(() => {
    viewerModule = new ViewerModule();
  });

  it('should create an instance', () => {
    expect(viewerModule).toBeTruthy();
  });
});
