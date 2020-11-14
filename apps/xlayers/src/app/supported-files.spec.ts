import * as toTest from './supported-files';

describe('supported-files', () => {
  describe('getFileData', () => {
    it('should return file information for a supported file type', () => {
      const expected = {
        name: 'my-wonderful-design',
        icon: '/assets/supported/sketch.svg',
        version: '5.1',
      };
      expect(toTest.getFileData('my-wonderful-design.sketch', '5.1')).toEqual(
        expected
      );
    });
    it('should return name and extension, without icon, if file type not supported', () => {
      expect(toTest.getFileData('slides.ppt', '')).toEqual({
        name: 'slides',
        icon: '',
        version: '',
      });
    });
    it('should return only the name if extension is not precised on the fileName', () => {
      expect(toTest.getFileData('notes', '2.0')).toEqual({
        name: 'notes',
        icon: '',
        version: '2.0',
      });
    });
  });
});
