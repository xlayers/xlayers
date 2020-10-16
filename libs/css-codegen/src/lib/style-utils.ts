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
  // this regex matches positive or negative decimals with positive or negative exponential constants e.g. -2432.3435E-987
  // this regex matches positive or negative decimals with positive or negative exponential constants e.g. -2432.3435E-987
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

function getCleanNumber(number: string) {
  if (!isNaN(number)) {
    if (number.includes('e')) {
      number = 0; //values including exponential 'e' symbol have always 0 as value.
      // In .sketch files' conversion, values that have exponential format on the generated CSS (including the 'e'), are displayed on the editor with a 0 value, they are always position-related values (top, left, right, bottom).
      // If we tried to convert these values using mathematical formulas, we won't  get 0 values.
      // This is why this method returns systematically 0 for exponential values, as it corresponds to reality
    } else {
      number = parseFloat(number);
    }
    if (number % 1 !== 0) {
      // if float number
      number = Math.round(number * 10) / 10; //round & set 1 digit
    }
    number += 0; // avoid -0 value
  }
  return number;
}
