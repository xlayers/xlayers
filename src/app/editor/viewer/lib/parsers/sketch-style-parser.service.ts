import { BinaryPropertyListParserService } from './bplist-parser.service';
import { Injectable } from '@angular/core';
import { SketchData } from '../sketch.service';

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

  visit(sketch: SketchData) {
    sketch.pages.forEach((page: SketchMSPage) => {
      if (page.layers) {
        page.layers.map((layer: SketchMSLayer) => {
          this.visitObject(layer, page, layer);
        });
      }
    });
  }

  /**
   * Recurse over all layers properties and parse
   * valuable class to CSS
   */
  visitObject(curr: any, parent: any, root: SketchMSLayer) {
    for (const property in curr) {
      if (curr.hasOwnProperty(property)) {
        // Check if the current property is a exploirable
        // if not ignore it or exploit current data
        if (typeof curr[property] === 'object') {
          // Check if the next object is a new root scope
          if (curr[property].frame && curr[property].frame._class === 'rect') {
            this.visitObject(curr[property], curr, curr[property]);
          } else {
            this.visitObject(curr[property], curr, root);
          }
        } else if (property === '_class') {
          switch (curr[property]) {
            case 'color':
              curr._values = this.parseColors(curr as SketchMSColor);
              break;

            case 'symbolMaster':
              this.setStyle(curr, root, {
                'background-color': this.parseColors(
                  (curr as SketchMSSymbolMaster).backgroundColor
                ).rgba
              });
              break;

            case 'style':
              this.parseBlur(curr, root);
              this.parseBorders(curr, root);
              this.parseFills(curr, root);
              this.parseShadows(curr, root);
              break;

            case 'text':
              this.parseTextContent(curr, root);
              this.parseTextColor(curr, root);
              this.parseParagraphStyle(curr, root);
              this.parseTextFont(curr, root);
              this.parseAttributeString(curr, root);
              break;

            default:
              if ((curr as SketchMSPage).rotation) {
                this.setStyle(curr, root, {
                  transform: `rotate(${curr.rotation}deg)`
                });
              }

              if ((curr as SketchMSPage).fixedRadius) {
                this.setStyle(curr, root, {
                  'border-radius': `${curr.fixedRadius}px`
                });
              }

              if ((curr as SketchMSGraphicsContextSettings).opacity) {
                this.setStyle(curr, root, {
                  opacity: `${curr.opacity}`
                });
              }
          }

          if ((curr as SketchMSLayer).frame) {
            this.setStyle(curr, root, {
              display: 'block',
              position: 'absolute',
              left: `${curr.frame.x}px`,
              top: `${curr.frame.y}px`,
              width: `${curr.frame.width}px`,
              height: `${curr.frame.height}px`,
              visibility: curr.isVisible ? 'visible' : 'hidden'
            });
          }
        }
      }
    }
    return parent;
  }

  parseTextContent(curr: SketchMSLayer, root: SketchMSLayer) {
    (root as any).content = curr.attributedString.string;
  }

  /**
   * Parse text font if nothing is found
   * fallback to current page font.
   */
  parseTextFont(curr: SketchMSLayer, root: SketchMSLayer) {
    const obj = curr.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute;
    if (obj.hasOwnProperty('_class') && obj._class === 'fontDescriptor') {
      this.setStyle(curr, root, {
        'font-family': `${obj.attributes.name}, 'Roboto', sans-serif`,
        'font-size': `${obj.attributes.size}px`
      });
    } else if (obj.hasOwnProperty('_archive')) {
      const archive = this.binaryPlistParser.parse64Content(obj._archive);
      (root.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute as any)._transformed = archive;
    }
  }

  /**
   * Parse attibutes (not used at the moment)
   */
  parseAttributeString(curr: SketchMSLayer, root: SketchMSLayer) {
    const obj = curr.attributedString;
    if (obj.hasOwnProperty('archivedAttributedString')) {
      const archive = this.binaryPlistParser.parse64Content(obj.archivedAttributedString._archive);
      if (archive) {
        switch (archive.$key) {
          case 'ascii':
            (root as any).content = archive.$value;
            break;

          default:
            break;
        }
      }
    }
  }

  /**
   * Parse paragraph alignment (not used at the moment)
   */
  parseParagraphStyle(curr: SketchMSLayer, root: SketchMSLayer) {
    const obj = curr.style.textStyle.encodedAttributes;
    if (obj.hasOwnProperty('NSParagraphStyle')) {
      const archive = this.binaryPlistParser.parse64Content(root.style.textStyle.encodedAttributes.NSParagraphStyle._archive);
      (root.style.textStyle.encodedAttributes.NSParagraphStyle as any)._transformed = archive;
    }
  }

  /**
   * Parse text colors, if nothing is found
   * fallback to black color
   */
  parseTextColor(curr: SketchMSLayer, root: SketchMSLayer) {
    const obj = curr.style.textStyle.encodedAttributes;
    if (obj.hasOwnProperty('MSAttributedStringColorAttribute')) {
      this.setStyle(curr, root, {
        color: this.parseColors(
          obj.MSAttributedStringColorAttribute
        ).rgba
      });
    } else if (obj.hasOwnProperty('NSColor')) {
      const archive = this.binaryPlistParser.parse64Content(obj.NSColor._archive);
      (root.style.textStyle.encodedAttributes.NSColor as any)._transformed = archive;
    } else {
      this.setStyle(curr, root, {
        color: 'black'
      });
    }
  }

  parseBlur(curr: SketchMSStyle, root: SketchMSLayer) {
    const obj = curr.blur;
    if (obj && obj.radius > 0) {
      this.setStyle(curr, root, {
        filter: `blur(${obj.radius}px);`
      });
    }
  }

  parseBorders(curr: SketchMSStyle, root: SketchMSLayer) {
    const obj = curr.borders;
    if (obj && obj.length > 0) {
      const bordersStyles = obj.reduce((acc, border) => {
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
        this.setStyle(curr, root, {
          'box-shadow': bordersStyles.join(',')
        });
      }
    }
  }

  parseFills(curr: SketchMSStyle, root: SketchMSLayer) {
    const obj = curr.fills;
    if (obj && obj.length > 0) {
      // we only support one fill: take the first one!
      // ignore the other fills
      const firstFill = obj[0];

      this.setStyle(curr, root, {
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
          this.setStyle(curr, root, {
            background: `linear-gradient(90deg, ${fillsStyles.join(',')})`
          });
        }
      }
    }
  }

  parseShadows(curr: SketchMSStyle, root: SketchMSLayer) {
    const innerShadows = curr.innerShadows;
    const shadows = curr.shadows;
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
    if (shadowsStyles.length > 0) {
      this.setStyle(curr, root, {
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

  setStyle(curr: any, root: SketchMSLayer, style: { [key: string]: string }) {
    root.css = root.css || {};
    curr.css = curr.css || {};
    for (const property in style) {
      if (style.hasOwnProperty(property)) {
        root.css[property] = style[property];
        curr.css[property] = style[property];
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
