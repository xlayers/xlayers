import * as utilsToTest from './style-utils';

describe('style-utils', () => {
  describe('convertValue', () => {
    it('should not convert a non numeric value', () => {
      expect(utilsToTest.convertValue('block')).toBe('block');
    });
    it('should convert an exponential value', () => {
      expect(utilsToTest.convertValue('-3.019895302713849e-7px')).toBe('1px');
    });

    it('should convert a value with more than 2 digits', () => {
      expect(utilsToTest.convertValue('320.074543245432rem')).toBe('320.1rem');
    });

    it('should convert a negative 0 value', () => {
      expect(utilsToTest.convertValue('-0px')).toBe('0px');
    });
  });
});
