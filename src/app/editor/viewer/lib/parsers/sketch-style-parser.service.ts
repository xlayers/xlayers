import { BinaryPropertyListParserService } from './bplist-parser.service';
import { Injectable } from '@angular/core';

/**
 * border Type:
 * - 0: center
 * - 1: inside
 * - 2: outside
 */
export enum BorderType {
  INSIDE = 1,
  OUTSIDE = 2,
  CENTER = 0
}

@Injectable({
  providedIn: 'root'
})
export class SketchStyleParserService {
  constructor(private binaryPlistParser: BinaryPropertyListParserService) {}
  public visit(pages: Array<SketchMSPage>) {
    pages.forEach(page => {
      if (page.layers) {
        page.layers.map(layer => this.visitObject(layer, page, layer));
      }
    });
  }

  visitObject(obj: any, parent: any, root: any) {
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (typeof obj[property] === 'object') {
          // visit child
          if (obj[property].frame && obj[property].frame._class === 'rect') {
            this.visitObject(obj[property], obj, obj[property]);
          } else {
            this.visitObject(obj[property], obj, root);
          }
        } else if (property === '_class') {
          switch (obj[property]) {
            case 'color':
              obj._values = this.parseColors(obj as SketchMSColor);
              break;

            case 'symbolMaster':
              this.setStyle(obj, root, {
                'background-color': this.parseColors(
                  (obj as SketchMSSymbolMaster).backgroundColor
                ).rgba
              });
              break;

            case 'style':
              this.parseStyleInformation(obj, root);
              break;
            case 'text':
              this.parseText(obj, root);
              break;

            default:
              if ((obj as SketchMSPage).rotation) {
                this.setStyle(obj, root, {
                  transform: `rotate(${obj.rotation}deg)`
                });
              }

              if ((obj as SketchMSPage).fixedRadius) {
                this.setStyle(obj, root, {
                  'border-radius': `${obj.fixedRadius}px`
                });
              }

              if ((obj as SketchMSGraphicsContextSettings).opacity) {
                this.setStyle(obj, root, {
                  opacity: `${obj.opacity}`
                });
              }
          }

          if ((obj as SketchMSLayer).frame) {
            this.setStyle(obj, root, {
              display: 'block',
              position: 'absolute',
              left: `${obj.frame.x}px`,
              top: `${obj.frame.y}px`,
              width: `${obj.frame.width}px`,
              height: `${obj.frame.height}px`,
              visibility: obj.isVisible ? 'visible' : 'hidden'
            });
          }
        }
      }
    }
    return parent;
  }

  parseText(obj: any, root: any) {
    this.parseTextColor(obj, root);
    this.parseParagraphStyle(obj, root);
    this.parseTextFont(obj, root);
    this.parseAttributeString(obj, root);
  }

  /**
   * Parse text font if nothing is found
   * fallback to current page font.
   *
   * @param obj   The current layer
   * @param root  The root layer
   */
  parseTextFont(obj: SketchMSLayer, root: any) {
    const MSAttributedStringFontAttribute =
      obj.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute;
    if (MSAttributedStringFontAttribute.hasOwnProperty('_archive')) {
      const parsedMSAttributedStringFontAttribute = this.binaryPlistParser.parse64Content(
        MSAttributedStringFontAttribute._archive
      );
      (root.style.textStyle.encodedAttributes
        .MSAttributedStringFontAttribute as any)._transformed = parsedMSAttributedStringFontAttribute;
    } else if (
      MSAttributedStringFontAttribute.hasOwnProperty('_class') &&
      MSAttributedStringFontAttribute._class === 'fontDescriptor'
    ) {
      this.setStyle(obj, root, {
        'font-family': `${
          MSAttributedStringFontAttribute.attributes.name
        }, 'Roboto', sans-serif`,
        'font-size': `${MSAttributedStringFontAttribute.attributes.size}px`
      });
    }
  }

  /**
   * Parse attibutes (not used at the moment)
   *
   * @param obj   The current layer
   * @param root  The root layer
   */
  parseAttributeString(obj: SketchMSLayer, root: any) {
    const attributedString = obj.attributedString;
    if (attributedString.hasOwnProperty('archivedAttributedString')) {
      const archivedAttributedString = attributedString.archivedAttributedString
        ._archive as string;
      const parsedArchivedAttributedString = this.binaryPlistParser.parse64Content(
        archivedAttributedString
      );
      (root.attributedString
        .archivedAttributedString as any)._transformed = parsedArchivedAttributedString;
    }
  }

  /**
   * Parse paragraph alignment (not used at the moment)
   *
   * @param obj   The current layer
   * @param root  The root layer
   */
  parseParagraphStyle(obj: SketchMSLayer, root: any) {
    const encodedAttributes = obj.style.textStyle.encodedAttributes;
    if (encodedAttributes.hasOwnProperty('NSParagraphStyle')) {
      const NSParagraphStyle = root.style.textStyle.encodedAttributes
        .NSParagraphStyle._archive as string;
      const parsedNSParagraphStyle = this.binaryPlistParser.parse64Content(
        NSParagraphStyle
      );
      (root.style.textStyle.encodedAttributes
        .NSParagraphStyle as any)._transformed = parsedNSParagraphStyle;
    }
  }

  /**
   * Parse text colors, if nothing is found
   * fallback to black color
   *
   * @param obj   The current layer
   * @param root  The root layer
   */
  parseTextColor(obj: SketchMSLayer, root: any) {
    const encodedAttributes = obj.style.textStyle.encodedAttributes;
    if (encodedAttributes.hasOwnProperty('MSAttributedStringColorAttribute')) {
      this.setStyle(obj, root, {
        color: this.parseColors(
          encodedAttributes.MSAttributedStringColorAttribute
        ).rgba
      });
    } else if (encodedAttributes.hasOwnProperty('NSColor')) {
      const NSColor = encodedAttributes.NSColor._archive as string;
      const parsedNSColor = this.binaryPlistParser.parse64Content(NSColor);
      (root.style.textStyle.encodedAttributes
        .NSColor as any)._transformed = parsedNSColor;
    } else {
      this.setStyle(obj, root, {
        color: 'black'
      });
    }
  }

  parseStyleInformation(obj: any, root: any) {
    // blur
    this.parseBlur(obj, root);
    // borders
    this.parseBorders(obj, root);
    // fills
    this.parseFills(obj, root);
    // innerShadows and shadows
    this.parseShadows(obj, root);
  }

  parseBlur(obj: SketchMSStyle, root: any) {
    const blur = obj.blur;
    if (blur && blur.radius > 0) {
      this.setStyle(obj, root, {
        filter: `blur(${blur.radius}px);`
      });
    }
  }

  parseBorders(obj: SketchMSStyle, root: any) {
    const borders = obj.borders;
    if (borders && borders.length > 0) {
      const bordersStyles = borders.reduce((acc, border) => {
        if (border.thickness > 0) {
          const color = this.parseColors(border.color);
          let shadow = `0 0 0 ${border.thickness}px ${color.rgba}`;
          if (border.position === BorderType.INSIDE) {
            shadow += ' inset';
          }
          return [shadow, ...acc];
        }
        return acc;
      }, []);

      if (bordersStyles.length > 0) {
        this.setStyle(obj, root, {
          'box-shadow': bordersStyles.join(',')
        });
      }
    }
  }

  parseFills(obj: SketchMSStyle, root: any) {
    const fills = obj.fills || [];
    if (fills.length > 0) {
      // we only support one fill: take the first one!
      // ignore the other fills
      const firstFill = fills[0];

      this.setStyle(obj, root, {
        'background-color': `${this.parseColors(firstFill.color).rgba}`
      });

      if (firstFill.gradient) {
        const fillsStyles: string[] = [];
        firstFill.gradient.stops.forEach(stop => {
          let fill = `${this.parseColors(stop.color).rgba}`;
          if (stop.position >= 0 && stop.position <= 1) {
            fill += ` ${stop.position * 100}%`;
          }
          fillsStyles.push(fill);
        });

        if (fillsStyles.length > 0) {
          // apply gradient, if multiple fills
          // default angle is 90deg
          this.setStyle(obj, root, {
            background: `linear-gradient(90deg, ${fillsStyles.join(',')})`
          });
        }
      }
    }
  }

  parseShadows(obj: SketchMSStyle, root: any) {
    const innerShadows = obj.innerShadows || [];
    const shadows = obj.shadows || [];
    const shadowsStyles: string[] = [];
    if (innerShadows) {
      innerShadows.forEach(innerShadow => {
        const color = this.parseColors(innerShadow.color);
        shadowsStyles.push(
          `${innerShadow.offsetX}px ${innerShadow.offsetY}px ${
            innerShadow.blurRadius
          }px ${innerShadow.spread}px ${color.rgba} inset`
        );
      });
    }
    if (shadows) {
      shadows.forEach(shadow => {
        const color = this.parseColors(shadow.color);
        shadowsStyles.push(
          `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${
            shadow.spread
          }px ${color.rgba}`
        );
      });
    }
    if (innerShadows.length > 0 || shadows.length > 0) {
      this.setStyle(obj, root, {
        'box-shadow': shadowsStyles.join(',')
      });
    }
  }

  parseColors(color: SketchMSColor | undefined) {
    if (typeof color === 'undefined') {
      return {
        hex: '#00FFFFFF',
        rgba: 'rgba(255,255,255,1)',
        raw: {
          red: 255,
          green: 255,
          blue: 255,
          alpha: 1
        }
      };
    }

    const styles = {};
    const { red, green, blue, alpha } = color;

    return {
      hex: this.sketch2hex(red, green, blue, alpha),
      rgba: this.sketch2rgba(red, green, blue, alpha),
      raw: {
        red: this.rgba(red),
        green: this.rgba(green),
        blue: this.rgba(blue),
        alpha
      }
    };
  }

  rgba(v: number) {
    const color = Math.round(v * 255);
    return color > 0 ? color : 0;
  }

  sketch2rgba(r: number, g: number, b: number, a: number) {
    return `rgba(${this.rgba(r)},${this.rgba(g)},${this.rgba(b)},${a})`;
  }

  setStyle(obj: any, root: any, style: { [key: string]: string }) {
    root.css = root.css || {};
    obj.css = obj.css || {};
    for (const property in style) {
      if (style.hasOwnProperty(property)) {
        root.css[property] = style[property];
        obj.css[property] = style[property];
      }
    }
  }

  sketch2hex(r: number, g: number, b: number, a: number) {
    if (r > 255 || g > 255 || b > 255 || a > 255) {
      return '';
    }
    return (
      '#' +
      ((256 + this.rgba(r)).toString(16).substr(1) +
        (
          ((1 << 24) + (this.rgba(g) << 16)) |
          (this.rgba(b) << 8) |
          this.rgba(a)
        )
          .toString(16)
          .substr(1))
    );
  }
}
