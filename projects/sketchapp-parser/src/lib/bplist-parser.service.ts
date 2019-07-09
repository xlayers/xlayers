const Buffer = require('buffer/').Buffer;
const BigInt = window['BigInt'] || require('big-integer');
import { Injectable } from '@angular/core';
type BufferEncoding = 'hex' | 'utf8' | 'utf-8' | 'ascii' | 'latin1' | 'binary' | 'base64' | 'ucs2' | 'ucs-2' | 'utf16le' | 'utf-16le';

class PropertyListFormatException extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'PropertyListFormatException';
    this.message = message;
  }
}
class UnsupportedEncodingException extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'UnsupportedEncodingException';
    this.message = message;
  }
}
class UnsupportedOperationException extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'UnsupportedOperationException';
    this.message = message;
  }
}
class IllegalArgumentException extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'IllegalArgumentException';
    this.message = message;
  }
}
export class UID {
  constructor(private value: number, private buffer: Buffer, private string: string) {}
}

/*
Resource: https://opensource.apple.com/source/CF/CF-550/

HEADER
	magic number ("bplist")
	file format version

OBJECT TABLE
	variable-sized objects

	Object Formats (marker byte followed by additional info in some cases)
	null    0000 0000
	bool    0000 1000			                    // false
	bool    0000 1001			                    // true
	fill    0000 1111			                    // fill byte
	int     0001 nnnn	...		                  // # of bytes is 2^nnnn, big-endian bytes
	real    0010 nnnn	...		                  // # of bytes is 2^nnnn, big-endian bytes
	date    0011 0011	...		                  // 8 byte float follows, big-endian bytes
	data    0100 nnnn	[int]	...	              // nnnn is number of bytes unless 1111 then int count follows, followed by bytes
	string  0101 nnnn	[int]	...	              // ASCII string, nnnn is # of chars, else 1111 then int count, then bytes
	string  0110 nnnn	[int]	...	              // Unicode string, nnnn is # of chars, else 1111 then int count, then big-endian 2-byte uint16_t
          0111 xxxx			                    // unused
	uid     1000 nnnn	...		                  // nnnn+1 is # of bytes
          1001 xxxx			                    // unused
	array   1010 nnnn	[int]	objref*	          // nnnn is count, unless '1111', then int count follows
          1011 xxxx			                    // unused
	ser     1100 nnnn	[int]	objref*           // nnnn is count, unless '1111', then int count follows
	dict    1101 nnnn	[int]	keyref* objref*	  // nnnn is count, unless '1111', then int count follows
          1110 xxxx			                    // unused
          1111 xxxx			                    // unused

OFFSET TABLE
	list of ints, byte size of which is given in trailer
	-- these are the byte offsets into the file
	-- number of these is in the trailer

TRAILER
	byte size of offset ints in offset table
	byte size of object refs in arrays and dicts
	number of offsets in offset table (also is number of objects)
	element # in offset table which is top level object
	offset table offset

*/
@Injectable({
  providedIn: 'root'
})
export class BinaryPropertyListParserService {
  /**
   * The property list data.
   */
  private bytes: Buffer;
  /**
   * The parsed content.
   */
  private content: any;

  /**
   * Length of an object reference in bytes
   */
  private objectRefSize: number;

  /**
   * The table holding the information at which offset each object is found
   */
  private offsetTable: Array<number>;

  /**
   * Parses a binary property list from a binary base64 string.
   *
   * @param data The binary property list's data encoded as base64 string.
   * @return The root object of the property list. This is usually a NSDictionary but can also be a NSArray.
   * @throws PropertyListFormatException When the property list's format could not be parsed.
   * @throws UnsupportedEncodingException When a NSString object could not be decoded.
   */
  public parse64Content(data: string) {
    const raw = atob(data);
    const rawLength = raw.length;
    const array: Buffer = new Buffer(rawLength);

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    this.content = this.doParse(array);

    return this.content;
  }

  /**
   * Parses a binary property list from a buffer.
   *
   * @param data The binary property list's data.
   * @return The root object of the property list. This is usually a NSDictionary but can also be a NSArray.
   * @throws PropertyListFormatException When the property list's format could not be parsed.
   * @throws UnsupportedEncodingException When a NSString object could not be decoded.
   */
  public parse(data: Buffer) {
    this.content = this.doParse(data);

    return this.content;
  }

  public toJson(map = new Map<any, any>()) {
    const out = Object.create(null);
    this.content.forEach((value, key) => {
      if (value instanceof Map) {
        out[key] = this.toJson(value);
      } else {
        out[key] = value;
      }
    });
    return out;
  }

  /**
   * Parses a binary property list from a byte array.
   *
   * @param data The binary property list's data.
   * @return The root object of the property list. This is usually a NSDictionary but can also be a NSArray.
   * @throws PropertyListFormatException When the property list's format could not be parsed.
   * @throws UnsupportedEncodingException When a NSString object could not be decoded.
   */
  private doParse(data: Buffer) {
    this.bytes = data;

    const magic = this.buffer2String(data, 0, 8);

    if (!magic.startsWith('bplist') && !magic.startsWith('plist')) {
      // throw new IllegalArgumentException(`'The given data is no binary property list. Wrong magic bytes: ${magic}`);
      console.error(`'The given data is no binary property list. Wrong magic bytes: ${magic}`);
    }

    /*
     * Handle trailer, last 32 bytes of the file
     */
    const trailer: Buffer = this.copyOfRange(this.bytes, this.bytes.length - 32, this.bytes.length);

    // 6 null bytes (index 0 to 5)

    const offsetSize: number = this.parseUnsignedInt(trailer, 6, 7);
    this.objectRefSize = this.parseUnsignedInt(trailer, 7, 8);
    const numObjects: number = this.parseUnsignedInt(trailer, 8, 16);
    const topObject: number = this.parseUnsignedInt(trailer, 16, 24);
    const offsetTableOffset: number = this.parseUnsignedInt(trailer, 24, 32);

    /*
       * Handle offset table
       */
    this.offsetTable = new Array(numObjects);

    for (let i = 0; i < numObjects; i++) {
      this.offsetTable[i] = this.parseUnsignedInt(this.bytes, offsetTableOffset + i * offsetSize, offsetTableOffset + (i + 1) * offsetSize);
    }

    return this.visit(topObject);
  }

  private buffer2String(bytes: Buffer, startIndex: number, endIndex: number, encoding: BufferEncoding = 'utf-8') {
    return this.copyOfRange(bytes, startIndex, endIndex).toString(encoding);
  }

  /**
   * Copies a part of a byte array into a new array.
   *
   * @param src        The source array.
   * @param startIndex The index from which to start copying.
   * @param endIndex   The index until which to copy.
   * @return The copied array.
   */
  private copyOfRange(src: Buffer, startIndex: number, endIndex: number) {
    const length = endIndex - startIndex;
    if (length < 0) {
      // throw new IllegalArgumentException(`startIndex (${startIndex})" + " > endIndex (${endIndex})`);
      console.error(`startIndex (${startIndex})" + " > endIndex (${endIndex})`);
    }
    return src.slice(startIndex, endIndex);
  }

  /**
   * Parses an unsigned integer from a byte array.
   *
   * @param bytes The byte array containing the unsigned integer.
   * @param startIndex Beginning of the unsigned int in the byte array.
   * @param endIndex End of the unsigned int in the byte array.
   * @return The unsigned integer represented by the given bytes.
   */
  private parseUnsignedInt(bytes: Buffer, startIndex: number, endIndex: number) {
    let l = 0;
    for (let i = startIndex; i < endIndex; i++) {
      l <<= 8;
      l |= bytes[i] & 0xff;
    }
    // l &= 0xffffffffff;
    l &= 0xff;
    return l;
  }

  private calculateUtf8StringLength(bytes: Buffer, offset: number, numCharacters: number) {
    let length = 0;
    for (let i = 0; i < numCharacters; i++) {
      const tempOffset = offset + length;
      if (bytes.length <= tempOffset) {
        // WARNING: Invalid UTF-8 string, fall back to length = number of characters
        return numCharacters;
      }
      if (bytes[tempOffset] < 0x80) {
        length++;
      }
      if (bytes[tempOffset] < 0xc2) {
        // Invalid value (marks continuation byte), fall back to length = number of characters
        return numCharacters;
      } else if (bytes[tempOffset] < 0xe0) {
        if ((bytes[tempOffset + 1] & 0xc0) !== 0x80) {
          // Invalid continuation byte, fall back to length = number of characters
          return numCharacters;
        }
        length += 2;
      } else if (bytes[tempOffset] < 0xf0) {
        if ((bytes[tempOffset + 1] & 0xc0) !== 0x80 || (bytes[tempOffset + 2] & 0xc0) !== 0x80) {
          // Invalid continuation byte, fall back to length = number of characters
          return numCharacters;
        }
        length += 3;
      } else if (bytes[tempOffset] < 0xf5) {
        if ((bytes[tempOffset + 1] & 0xc0) !== 0x80 || (bytes[tempOffset + 2] & 0xc0) !== 0x80 || (bytes[tempOffset + 3] & 0xc0) !== 0x80) {
          // Invalid continuation byte, fall back to length = number of characters
          return numCharacters;
        }
        length += 4;
      }
    }
    return length;
  }
  /**
   * Reads the length for arrays, sets and dictionaries.
   *
   * @param objInfo Object information byte.
   * @param offset  Offset in the byte array at which the object is located.
   * @return An array with the length two. First entry is the length, second entry the offset at which the content starts.
   */
  private readLengthAndOffset(objInfo: number, offset: number) {
    let lengthValue = objInfo;
    let offsetValue = 1;
    if (objInfo === 0xf) {
      const int_type = this.bytes[offset + 1];
      const intType = (int_type & 0xf0) >> 4;
      if (intType !== 0x1) {
        console.warn(`BinaryPropertyListParser: Length integer has an unexpected type ${intType}. Attempting to parse anyway...`);
      }
      const intInfo = int_type & 0x0f;
      const intLength = Math.pow(2, intInfo);
      offsetValue = 2 + intLength;
      if (intLength < 3) {
        lengthValue = this.parseUnsignedInt(this.bytes, offset + 2, offset + 2 + intLength);
      } else {
        lengthValue = new BigInt(this.copyOfRange(this.bytes, offset + 2, offset + 2 + intLength)).intValue();
      }
    }
    return [lengthValue, offsetValue];
  }

  /**
   * Parses an object inside the currently parsed binary property list.
   * For the format specification check
   * <a href="http://www.opensource.apple.com/source/CF/CF-855.17/CFBinaryPList.c">
   * Apple's binary property list parser implementation</a>.
   *
   * @param obj The object ID.
   * @return The parsed object.
   * @throws PropertyListFormatException When the property list's format could not be parsed.
   * @throws UnsupportedEncodingException When a NSString object could not be decoded.
   */
  private visit(obj: number) {
    const offset = this.offsetTable[obj];
    const type = this.bytes[offset];
    const objType = (type & 0xf0) >> 4; // First  4 bits
    const objInfo = type & 0x0f; // Second 4 bits

    switch (objType) {
      case 0x0: {
        // Simple
        switch (objInfo) {
          case 0x0: {
            // null object (v1.0 and later)
            return {
              $key: 'null',
              $value: null
            };
          }
          case 0x8: {
            // false
            return {
              $key: 'false',
              $value: false
            };
          }
          case 0x9: {
            // true
            return {
              $key: 'true',
              $value: true
            };
          }
          case 0xc: {
            // URL with no base URL (v1.0 and later)
            // TODO Implement binary URL parsing (not yet even implemented in Core Foundation as of revision 855.17)
            // throw new UnsupportedOperationException(
            console.error(`The given binary property list contains a URL object. Parsing of this object type is not yet implemented.`);
            break;
          }
          case 0xd: {
            // URL with base URL (v1.0 and later)
            // TODO Implement binary URL parsing (not yet even implemented in Core Foundation as of revision 855.17)
            // throw new UnsupportedOperationException(
            console.error(`The given binary property list contains a URL object. Parsing of this object type is not yet implemented.`);
            break;
          }
          case 0xe: {
            // 16-byte UUID (v1.0 and later)
            // TODO Implement binary UUID parsing (not yet even implemented in Core Foundation as of revision 855.17)
            // throw new UnsupportedOperationException(
            console.error(`The given binary property list contains a UUID object. Parsing of this object type is not yet implemented.`);
            break;
          }
          default: {
            // throw new PropertyListFormatException(`The given binary property list contains an object of unknown type (${objType})`);
            console.error(`The given binary property list contains an object of unknown type (${objType})`);
          }
        }
        break;
      }
      case 0x1: {
        // integer
        const len = Math.pow(2, objInfo);
        const value = this.buffer2String(this.bytes, offset + 1, offset + 1 + len);

        return {
          $key: 'integer',
          $value: parseInt(value, 10)
        };
      }
      case 0x2: {
        // real
        const len = Math.pow(2, objInfo);
        const value = this.buffer2String(this.bytes, offset + 1, offset + 1 + len);

        return {
          $key: 'float',
          $value: parseFloat(value)
        };
      }
      case 0x3: {
        // Date
        if (objInfo !== 0x3) {
          // throw new PropertyListFormatException(`The given binary property list contains a date object of an unknown type (${objInfo})`);
          console.error(`The given binary property list contains a date object of an unknown type (${objInfo})`);
        }
        return {
          $key: 'date',
          $value: new Date(this.buffer2String(this.bytes, offset + 1, offset + 9))
        };
      }
      case 0x4: {
        // Data: interpreted as Base-64 encoded
        const lengthAndOffset: number[] = this.readLengthAndOffset(objInfo, offset);
        const len = lengthAndOffset[0];
        const dataOffset = lengthAndOffset[1];
        const value = this.buffer2String(this.bytes, offset + dataOffset, offset + dataOffset + len);

        return {
          $key: 'data',
          $value: value
        };
      }
      case 0x5: {
        // ASCII string
        const lengthAndOffset: number[] = this.readLengthAndOffset(objInfo, offset);
        const len = lengthAndOffset[0]; // Each character is 1 byte
        const strOffset = lengthAndOffset[1];
        const value = this.buffer2String(this.bytes, offset + strOffset, offset + strOffset + len, 'ascii');

        return {
          $key: 'ascii',
          $value: value
        };
      }
      case 0x6: {
        // UTF-16-BE string
        const lengthAndOffset: number[] = this.readLengthAndOffset(objInfo, offset);
        const characters = lengthAndOffset[0];
        const strOffset = lengthAndOffset[1];
        // UTF-16 characters can have variable length, but the Core Foundation reference implementation
        // assumes 2 byte characters, thus only covering the Basic Multilingual Plane

        const len = characters * 2;
        const startIndex = strOffset;
        const endIndex = offset + strOffset + len;
        const value = this.buffer2String(this.bytes, startIndex, (startIndex + offset) * 2 ** 8 + endIndex, 'base64');
        // const value = this.buffer2String(this.bytes, offset + strOffset, offset + strOffset + length, 'base64');

        if (this.isBase64(value)) {
          return this.parse64Content(value);
        } else {
          return {
            $key: 'utf-16',
            $value: value
          };
        }
      }
      case 0x7: {
        // UTF-8 string (v1.0 and later)
        const lengthAndOffset: number[] = this.readLengthAndOffset(objInfo, offset);
        const strOffset = lengthAndOffset[1];
        const characters = lengthAndOffset[0];
        // UTF-8 characters can have variable length, so we need to calculate the byte length dynamically
        // by reading the UTF-8 characters one by one
        const len = this.calculateUtf8StringLength(this.bytes, offset + strOffset, characters);
        const value = this.buffer2String(this.bytes, offset + strOffset, offset + strOffset + len);

        return {
          $key: 'utf-8',
          $value: value
        };
      }
      case 0x8: {
        // UID (v1.0 and later)
        const len = objInfo + 1;
        const value = new UID(
          obj.valueOf(),
          this.copyOfRange(this.bytes, offset + 1, offset + 1 + len),
          this.buffer2String(this.bytes, offset + 1, offset + 1 + len)
        );

        return {
          $key: 'uid',
          $value: value
        };
      }
      case 0xa: {
        // Array
        const lengthAndOffset: number[] = this.readLengthAndOffset(objInfo, offset);
        const len = lengthAndOffset[0];
        const arrayOffset = lengthAndOffset[1];

        const value = new Array(len);
        for (let i = 0; i < len; i++) {
          const objRef = this.parseUnsignedInt(
            this.bytes,
            offset + arrayOffset + i * this.objectRefSize,
            offset + arrayOffset + (i + 1) * this.objectRefSize
          );
          value.push(this.visit(objRef));
        }

        return {
          $key: 'array',
          $value: value
        };
      }
      case 0xb: {
        // Ordered set (v1.0 and later)
        const lengthAndOffset: number[] = this.readLengthAndOffset(objInfo, offset);
        const len = lengthAndOffset[0];
        const contentOffset = lengthAndOffset[1];

        const value = new Set();
        for (let i = 0; i < len; i++) {
          const objRef = this.parseUnsignedInt(
            this.bytes,
            offset + contentOffset + i * this.objectRefSize,
            offset + contentOffset + (i + 1) * this.objectRefSize
          );
          value.add(this.visit(objRef));
        }

        return {
          $key: 'order-set',
          $value: value
        };
      }
      case 0xc: {
        // Set (v1.0 and later)
        const lengthAndOffset: number[] = this.readLengthAndOffset(objInfo, offset);
        const len = lengthAndOffset[0];
        const contentOffset = lengthAndOffset[1];

        const value = new Set();
        for (let i = 0; i < len; i++) {
          const objRef = this.parseUnsignedInt(
            this.bytes,
            offset + contentOffset + i * this.objectRefSize,
            offset + contentOffset + (i + 1) * this.objectRefSize
          );
          value.add(this.visit(objRef));
        }

        return {
          $key: 'set',
          $value: value
        };
      }
      case 0xd: {
        // Dictionary
        const lengthAndOffset: number[] = this.readLengthAndOffset(objInfo, offset);
        const len = lengthAndOffset[0];
        const contentOffset = lengthAndOffset[1];

        const value = new Map();
        for (let i = 0; i < len; i++) {
          const keyRef = this.parseUnsignedInt(
            this.bytes,
            offset + contentOffset + i * this.objectRefSize,
            offset + contentOffset + (i + 1) * this.objectRefSize
          );
          const valRef = this.parseUnsignedInt(
            this.bytes,
            offset + contentOffset + len * this.objectRefSize + i * this.objectRefSize,
            offset + contentOffset + len * this.objectRefSize + (i + 1) * this.objectRefSize
          );
          const key = this.visit(keyRef);
          const val = this.visit(valRef);
          value.set(key.$key.toString(), val);
        }

        return {
          $key: 'dictionary',
          $value: value
        };
      }
      default: {
        // throw new PropertyListFormatException(`The given binary property list contains an object of unknown type (${objType})`);
        console.error(`The given binary property list contains an object of unknown type (${objType})`);
      }
    }
  }

  private isBase64(value: string) {
    return /^([\+\/-9A-Za-z]{4})*([\+\/-9A-Za-z]{4}|[\+\/-9A-Za-z]{3}=|[\+\/-9A-Za-z]{2}==)$/u.test(value);
  }
}
