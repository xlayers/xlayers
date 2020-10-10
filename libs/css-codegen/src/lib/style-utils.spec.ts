import * as utilsToTest from './style-utils';

describe('style-utils', () => {
  describe('convertValue', () => {
    it('should not convert a non numeric value', () => {
      expect(utilsToTest.convertValue('block')).toBe('block');
    });
    it('should convert an exponential value', () => {
      expect(utilsToTest.convertValue('-3.019895302713849e-7px')).toBe('0px');
    });
    it('should convert another exponential value', () => {
      expect(utilsToTest.convertValue('1.060561771737412e-7px')).toBe('0px');
    });

    it('should not convert the value if it is not a "real" numeric value', () => {
      expect(utilsToTest.convertValue('0.8px4')).toBe('0.8px4');
    });

    it('should convert a value with more than 2 digits', () => {
      expect(utilsToTest.convertValue('320.074543245432rem')).toBe('320.1rem');
    });

    it('should convert a negative 0 value', () => {
      expect(utilsToTest.convertValue('-0px')).toBe('0px');
    });
    it('should convert a complex CSS rule containing multiple numeric values', () => {
      const initialValue = '5.67543px solid rgba(0,500.034,5,5)';
      const expectedValue = '5.7px solid rgba(0,500,5,5)';
      expect(utilsToTest.convertValue(initialValue)).toBe(expectedValue);
    });
  });
});
