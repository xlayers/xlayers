import { TestBed } from '@angular/core/testing';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageService],
    });

    service = TestBed.inject(ImageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should identify a sketch class as bitmap', () => {
    const data = {
      _class: 'bitmap',
    } as any;
    const actual = service.identify(data);
    expect(actual).toBeTruthy();
  });

  it('should look for the image ref', () => {
    const data = {
      _class: 'bitmap',
      image: {
        _ref: 'A',
      },
      images: {
        A: 'BASE_64_STRING',
      },
    } as any;
    const actual = service.lookup(data, data);
    expect(actual).toBe('BASE_64_STRING');
  });

  it('should aggragate the data based on the layer', () => {
    const expectedValue = [
      {
        kind: 'png',
        language: 'base64',
        uri: 'assets/test.png',
        value: 'BASE_64_STRING',
      },
    ];
    const data: any /* @Todo use proper type */ = {
      _class: 'bitmap',
      image: {
        _ref: 'A',
      },
      images: {
        A: 'BASE_64_STRING',
      },
      name: 'test',
    };
    const options = {
      textTagName: 'span',
      bitmapTagName: 'img',
      blockTagName: 'div',
      xmlPrefix: 'xly-',
      cssPrefix: 'xly_',
      componentDir: 'components',
      assetDir: 'assets',
    };
    const actual = service.aggregate(data, data, options);
    expect(actual).toEqual(expectedValue);
  });
});
