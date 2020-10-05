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
    return `${getCleanNumber(extractedNumber)}${convertibleUnit}`;
  }
  return value;
}

function getCleanNumber(number: any) {
  debugger;
  if (!isNaN(number)) {
    if (number.includes('e')) {
      number = Math.exp(parseFloat(number));
    } else {
      number = parseFloat(number);
    }
    if (number % 1 != 0) {
      // if float number
      number = Math.round(number * 10) / 10; //round & set 1 digit
    }
    number += 0; // avoid -0 value
  }
  return number;
}
