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
function convert(value: string): string {
  const numberMatches = value.match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
  if (numberMatches) {
    let convertedValue = value.slice();
    numberMatches.forEach(
      (found) =>
        (convertedValue = convertedValue.replace(found, getCleanNumber(found)))
    );
    return convertedValue;
  }
  return value;
}

function getCleanNumber(number: any) {
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
