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

export enum SupportScore {
  UNKNOWN = 1,
  DROPPED = 2,
  LEGACY = 3,
  LATEST = 4,
  EDGE = 5
}

@Injectable({
  providedIn: 'root'
})
export class SketchStyleParserService {
  constructor(private binaryPlistParser: BinaryPropertyListParserService) {}
  public visit(sketch: SketchData) {
    const supp = this.checkSupport(sketch);

    if (supp < SupportScore.DROPPED) {
      throw new Error('No longer supported version');
    }

    sketch.pages.forEach(page => {
      if (page.layers) {
        page.layers.map(layer => this.visitObject(layer, page, layer));
      }
    });
    return supp;
  }

  checkSupport(sketch: SketchData) {
    const ver = Number.parseInt(sketch.meta.appVersion.split('.')[0]);
    if (Number.isNaN(ver)) {
      return SupportScore.UNKNOWN;
    } else if (ver < 49) {
      return SupportScore.DROPPED;
    } else if (ver >= 49 && ver < 50) {
      return SupportScore.LEGACY;
    } else if (ver >= 50) {
      return SupportScore.LATEST;
    } else {
      return SupportScore.EDGE;
    }
  }

  visitObject(current: any, parent: any, root: any) {
    for (const property in current) {
      if (current.hasOwnProperty(property)) {
        if (typeof current[property] === 'object') {
          // visit child
          if (current[property].frame && current[property].frame._class === 'rect') {
            this.visitObject(current[property], current, current[property]);
          } else {
            this.visitObject(current[property], current, root);
          }
        } else if (property === '_class') {
          const obj = this.parseObject(current);
          const attr = this.parseAttributeString(current);
          const grp = this.parseGroup(current);
          const pol = this.polyfill(current);

          this.setText(current, root, attr.text);
          this.setText(current, root, obj.text);
          this.setText(current, root, pol.text);
          this.setStyle(current, root, obj.style);
          this.setStyle(current, root, grp.style);
        }
      }
    }
    return parent;
  }

  /**
   * Parse attibutes
   */
  parseAttributeString(node: SketchMSLayer) {
    const obj = node.attributedString;
    if (obj && obj.hasOwnProperty('archivedAttributedString')) {
      const archive = this.binaryPlistParser.parse64Content(obj.archivedAttributedString._archive);
      if (archive) {
        switch (archive.$key) {
          case 'ascii':
            return {
              text: archive.$value
            };
        }
      }
    }
    return {};
  }

  /**
   * Parse high level wapper attributes
   */
  parseGroup(layer: SketchMSLayer) {
    return {
      style: (layer as SketchMSLayer).frame ? {
        display: 'block',
        position: 'absolute',
        left: `${layer.frame.x}px`,
        top: `${layer.frame.y}px`,
        width: `${layer.frame.width}px`,
        height: `${layer.frame.height}px`,
        visibility: layer.isVisible ? 'visible' : 'hidden'
      } : {}
    };
  }

  /**
   * Parse object attribute
   */
  parseObject(layer: any) {
    switch (layer._class) {
    case 'symbolMaster':
      return {
        style: {
          ...this.transformSymbolMaster(layer)
        }
      };

    case 'style':
      return {
        style: {
          ...this.transformBlur(layer),
          ...this.transformBorders(layer),
          ...this.transformFills(layer),
          ...this.transformShadows(layer)
        }
      };

    case 'text':
      return {
        text: this.transformTextContent(layer),
        style: {
          ...this.transformTextColor(layer),
          ...this.transformParagraphStyle(layer),
          ...this.transformTextFont(layer)
        }
      };

    default:
      return {
        style: {
          ...(layer as SketchMSPage).rotation ? {
            transform: `rotate(${layer.rotation}deg)`
          } : {},
          ...(layer as SketchMSPage).fixedRadius ? {
            'border-radius': `${layer.fixedRadius}px`
          } : {},
          ...(layer as SketchMSGraphicsContextSettings).opacity ? {
            opacity: `${layer.opacity}`
          } : {}
        }
      };
    }
  }

  /**
   * Best effort fallback polyfill
   */
  polyfill(layer: any) {
    return {
      text: layer.name,
    };
  }

  transformSymbolMaster(node: SketchMSSymbolMaster) {
    const obj = node.backgroundColor;
    return {
      'background-color': this.parseColors(obj).rgba
    };
  }

  transformTextContent(node: SketchMSLayer) {
    return node.attributedString.string;
  }

  transformTextFont(node: SketchMSLayer) {
    const obj = node.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute;
    if (obj.hasOwnProperty('_class') && obj._class === 'fontDescriptor') {
      return {
        'font-family': `'${obj.attributes.name}', 'Roboto', 'sans-serif'`,
        'font-size': `${obj.attributes.size}px`
      };
    } else if (obj.hasOwnProperty('_archive')) {
      // TODO: Handle legacy
      // const archive = this.binaryPlistParser.parse64Content(obj._archive);
      // (scope.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute as any)._transformed = archive;
      return {};
    }
    return {};
  }

  transformParagraphStyle(node: SketchMSLayer) {
    const obj = node.style.textStyle.encodedAttributes;
    if (obj.hasOwnProperty('NSParagraphStyle')) {
      // TODO: Handle legacy
      // const archive = this.binaryPlistParser.parse64Content(scope.style.textStyle.encodedAttributes.NSParagraphStyle._archive);
      // (scope.style.textStyle.encodedAttributes.NSParagraphStyle as any)._transformed = archive;
      return {};
    }
    return {};
  }

  transformTextColor(node: SketchMSLayer) {
    const obj = node.style.textStyle.encodedAttributes;
    if (obj.hasOwnProperty('MSAttributedStringColorAttribute')) {
      return {
        color: this.parseColors(
          obj.MSAttributedStringColorAttribute
        ).rgba
      };
    } else if (obj.hasOwnProperty('NSColor')) {
      // TODO: Handle legacy
      // const archive = this.binaryPlistParser.parse64Content(obj.NSColor._archive);
      // (scope.style.textStyle.encodedAttributes.NSColor as any)._transformed = archive;
      return {};
    }
    return {
      color: 'black'
    };
  }

  transformBlur(node: SketchMSStyle) {
    const obj = node.blur;
    return obj && obj.radius > 0 ? {
      filter: `blur(${obj.radius}px);`
    } : {};
  }

  transformBorders(node: SketchMSStyle) {
    const obj = node.borders;
    if (!obj || obj.length === 0) {
      return {};
    }

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

    return bordersStyles.length > 0 ? {
      'box-shadow': bordersStyles.join(',')
    } : {};
  }

  transformFills(node: SketchMSStyle) {
    const obj = node.fills;
    if (!obj || obj.length === 0) {
      return {};
    }

    // we only support one fill: take the first one!
    // ignore the other fills
    const firstFill = obj[0];

    return {
      ...(() => {
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
            return {
              background: `linear-gradient(90deg, ${fillsStyles.join(',')})`
            };
          }
        }
      })(),
      'background-color': `${this.parseColors(firstFill.color).rgba}`
    };
  }

  transformShadows(node: SketchMSStyle) {
    const innerShadows = node.innerShadows;
    const shadows = node.shadows;
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

    return shadowsStyles.length > 0 ? {
      'box-shadow': shadowsStyles.join(',')
    } : {};
  }

  parseColors(color: SketchMSColor) {
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

  setText(obj: any, root: any, text: string) {
    if (text && (!root.text || !obj.text)) {
      root.text = text;
      obj.text = text;
    }
  }
}
