/**
 * This cleans the 'number part' of a length value (ex: 5px) to obtain 1 digit rounded values
 * @param value css value to be converted
 */
export function convertValue(value: any): string {
  return value.toString().split(' ').map(convert).join(' ');
}

/**
 * This cleans the 'number part' of a length value (ex: 5px) to obtain 1 digit rounded values
 * @param value css value to be converted
 */
function convert(value: any): string {
  const lengthUnits = [
    'rem',
    'em',
    '%',
    'ch',
    'ex',
    'vw',
    'vh',
    'vmin',
    'vmax',
    'cm',
    'mm',
    'in',
    'px',
    'pt',
    'pc',
  ];

  const convertibleUnit = lengthUnits.find((unit) => value.indexOf(unit) > -1);
  if (convertibleUnit) {
    let extractedNumber = value.replace(convertibleUnit, '');
    if (!isNaN(extractedNumber)) {
      if (extractedNumber.includes('e')) {
        extractedNumber = Math.exp(parseFloat(extractedNumber));
      } else {
        extractedNumber = parseFloat(extractedNumber);
      }
      if (extractedNumber % 1 != 0) {
        // if float number
        extractedNumber = Math.round(extractedNumber * 10) / 10; //round & set 1 digit
      }
      extractedNumber += 0; // avoid -0 value
      return `${extractedNumber}${convertibleUnit}`;
    }
    return value;
  }
  return value;
}
