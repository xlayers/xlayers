import * as toTest from './supported-files';

describe('supported-files', () => {
  describe('getFileData', () => {
    it('should return file information for a supported file type', () => {
      const expected = {
        name: 'my-wonderful-design',
        extension: '.sketch',
        logo: '/assets/supported/sketch.svg',
      };
      expect(toTest.getFileData('my-wonderful-design.sketch')).toEqual(
        expected
      );
    });
    it('should return name and extension, without logo, if file type not supported', () => {
      expect(toTest.getFileData('slides.ppt')).toEqual({
        name: 'slides',
        extension: '.ppt',
        logo: '',
      });
    });
    it('should return only the name if extension is not precised on the fileName', () => {
      expect(toTest.getFileData('notes')).toEqual({
        name: 'notes',
        extension: '',
        logo: '',
      });
    });
  });
});
