import { TestBed } from '@angular/core/testing';
import { FormatService } from './format.service';

describe('FormatService', () => {
  let service: FormatService;
  // double spaces
  const defaultSpacing = '  ';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatService],
    });

    service = TestBed.inject(FormatService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should intdent by double spaces', () => {
    const content = `ABC`;
    const expectedValue = `${defaultSpacing}ABC`;
    const actual = service.indent(1, content);
    expect(actual).toBe(expectedValue);
  });

  it('should intdent for a file', () => {
    const content = `
        ABC
        BC
        C
        `;
    const expectedValue = `${defaultSpacing}
        ABC
        BC
        C
        `;
    const actual = service.indent(1, content);
    expect(actual).toBe(expectedValue);
  });

  it('should normalize a class name', () => {
    const className = 'aRealyCoolClassName';
    const expectedClassName = 'a-realy-cool-class-name';
    const actual = service.normalizeName(className);
    expect(actual).toBe(expectedClassName);
  });

  it('should convert to pascalCase for a class name', () => {
    const className = 'aRealyCoolClassName';
    const expectedClassName = 'ARealyCoolClassName';
    const actual = service.className(className);
    expect(actual).toBe(expectedClassName);
  });
});
