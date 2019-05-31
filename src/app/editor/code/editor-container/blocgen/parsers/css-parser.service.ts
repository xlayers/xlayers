import { Injectable } from "@angular/core";
import { ParserFacade, WithLocalContext } from "../blocgen";
import { StyleHelperService } from "../style-helper.service";
import { FormatHelperService } from "../format-helper.service";

export interface CssParserContext {
  rules: { [key: string]: string };
  className: string;
}

export interface CssParserOptions {
  classNamePrefix?: string;
}

@Injectable({
  providedIn: "root"
})
export class CssParserService
  implements ParserFacade, WithLocalContext<CssParserContext> {
  constructor(
    private readonly styleHelperService: StyleHelperService,
    private readonly formatHelperService: FormatHelperService
  ) {}

  private classNamePrefix: string;

  transform(
    _data: SketchMSData,
    current: SketchMSLayer,
    options: CssParserOptions = {}
  ) {
    this.classNamePrefix = options.classNamePrefix || "xly_";

    if (!this.hasContext(current)) {
      this.compute(current);
    }

    const context = this.contextOf(current);
    return [this.renderCssRessourceFile(context, current.name)];
  }

  identify(current: SketchMSLayer) {
    return ["rect", "page", "rectangle", "group", "symbolMaster"].includes(
      current._class as string
    );
  }

  hasContext(current: SketchMSLayer) {
    return !!this.contextOf(current);
  }

  contextOf(current: SketchMSLayer) {
    if (!current.css) {
      return undefined;
    }

    return {
      rules:
        ((current.css as unknown) as CssParserContext).rules || current.css,
      className:
        ((current.css as unknown) as CssParserContext).className ||
        (current as any).css__className
    };
  }

  private formatCss(context: CssParserContext) {
    return Object.entries(context.rules)
      .map(([key, value]) =>
        this.formatHelperService.indent(1, `${key}: ${value};`)
      )
      .join("\n");
  }

  private renderCssRessourceFile(context: CssParserContext, path: string) {
    return {
      kind: "css",
      language: "css",
      value: this.formatCss(context),
      uri: `${path}.css`
    };
  }

  private compute(current: SketchMSLayer) {
    const generateCssClassName = () => {
      const randomString = () =>
        Math.random()
          .toString(36)
          .substring(2, 6);

      return `${this.classNamePrefix}${randomString()}`;
    };

    const rules = this.extractStyles(current);

    if (Object.entries(rules).length > 0) {
      (current as any).css = {
        ...this.contextOf(current),
        rules,
        className: `${generateCssClassName()}`
      };
    } else {
      (current as any).css = {
        ...this.contextOf(current),
        rules: {},
        className: ""
      };
    }
  }

  private extractStyles(current: SketchMSLayer) {
    switch (current._class as string) {
      case "symbolMaster":
        return {
          ...this.maybeUnstableProperty(this.extractFills(current))
        };
      case "rectangle":
        return {
          ...this.extractLayerStyle(current)
        };
      case "text":
        return {
          ...this.extractTextStyle(current)
        };
      case "oval":
        return {
          ...this.addOvalShape(),
          ...this.extractLayerStyle(current)
        };
      case "shapePath":
        return {
          ...this.maybeUnstableProperty(this.extractFills(current))
        };
      case "shapeGroup":
        return {
          ...this.maybeUnstableProperty(this.extractFills(current))
        };
      case "triangle":
        return {
          ...this.maybeUnstableProperty(this.extractFills(current))
        };
      default:
        return {
          ...((current as any).rotation
            ? {
                transform: `rotate(${current.rotation}deg)`
              }
            : {}),
          ...((current as any).fixedRadius
            ? {
                "border-radius": `${(current as any).fixedRadius}px`
              }
            : {}),
          ...((current as any).opacity
            ? {
                opacity: `${(current as any).opacity}`
              }
            : {})
        };
    }
  }

  private extractLayerStyle(current: SketchMSLayer) {
    return {
      ...this.extractBlur(current),
      ...this.extractBorders(current),
      ...this.extractFills(current),
      ...this.extractShadows(current)
    };
  }

  private extractTextStyle(current: SketchMSLayer) {
    return {
      ...this.maybeUnstableProperty(this.extractTextFont(current)),
      ...this.maybeUnstableProperty(this.extractTextColor(current)),
      ...this.maybeUnstableProperty(this.extractParagraphStyle(current))
    };
  }

  private extractTextColor(current: SketchMSLayer) {
    const obj = current.style.textStyle.encodedAttributes;

    if (obj.hasOwnProperty("MSAttributedStringColorAttribute")) {
      return {
        color: this.styleHelperService.parseColorAsRgba(
          obj.MSAttributedStringColorAttribute
        )
      };
    } else if (obj.hasOwnProperty("NSColor")) {
      // TODO: Handle legacy
      // const archive = this.binaryPlistParser.parse64Content(obj.NSColor._archive);
      // (scope.style.textStyle.encodedAttributes.NSColor as any)._transformed = archive;
      return {};
    }

    return {
      color: "black"
    };
  }

  private extractParagraphStyle(current: SketchMSLayer) {
    const obj = current.style.textStyle.encodedAttributes;

    if (obj.hasOwnProperty("NSParagraphStyle")) {
      // TODO: Handle legacy
      // const archive = this.binaryPlistParser.parse64Content(scope.style.textStyle.encodedAttributes.NSParagraphStyle._archive);
      // (scope.style.textStyle.encodedAttributes.NSParagraphStyle as any)._transformed = archive;
      return {};
    }

    return {};
  }

  private extractTextFont(current: SketchMSLayer) {
    const obj =
      current.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute;

    if (obj.hasOwnProperty("_class") && obj._class === "fontDescriptor") {
      return {
        "font-family": `'${obj.attributes.name}', 'Roboto', 'sans-serif'`,
        "font-size": `${obj.attributes.size}px`
      };
    } else if (obj.hasOwnProperty("_archive")) {
      // TODO: Handle legacy
      // const archive = this.binaryPlistParser.parse64Content(obj._archive);
      // (scope.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute as any)._transformed = archive;
      return {};
    }

    return {};
  }

  private addOvalShape() {
    return {
      "border-radius": "50%"
    };
  }

  private extractBlur(current: SketchMSLayer) {
    const obj = (current as any).blur;

    if (!obj) {
      return {};
    }

    if (obj.radius <= 0) {
      return {};
    }

    return {
      filter: `blur(${obj.radius}px);`
    };
  }

  private extractBorders(current: SketchMSLayer) {
    enum BorderType {
      INSIDE = 1,
      OUTSIDE = 2,
      CENTER = 0
    }

    const obj = (current as any).borders;

    if (!obj) {
      return {};
    }

    if (obj.length === 0) {
      return {};
    }

    const bordersStyles = obj.reduce((acc, border) => {
      if (border.thickness > 0) {
        const color = this.styleHelperService.parseColors(border.color);
        let shadow = `0 0 0 ${border.thickness}px ${color}`;
        if (border.position === BorderType.INSIDE) {
          shadow += " inset";
        }
        return [shadow, ...acc];
      }
      return acc;
    }, []);

    if (bordersStyles.length <= 0) {
      return {};
    }

    return {
      "box-shadow": bordersStyles.join(",")
    };
  }

  private extractFills(current: SketchMSLayer) {
    const obj = (current as any).fills;

    if (!obj) {
      return {};
    }

    if (obj.length === 0) {
      return {};
    }

    // we only support one fill: take the first one!
    // ignore the other fills
    const firstFill = obj[0];

    if (!firstFill.isEnabled) {
      return {};
    }

    const computeGradient = () => {
      if (!firstFill.gradient) {
        return {};
      }

      const fillsStyles: string[] = [];
      firstFill.gradient.stops.forEach(stop => {
        let fill = `${this.styleHelperService.parseColorAsRgba(stop.color)}`;
        if (stop.position >= 0 && stop.position <= 1) {
          fill += ` ${stop.position * 100}%`;
        }
        fillsStyles.push(fill);
      });

      if (fillsStyles.length <= 0) {
        return {};
      }

      // apply gradient, if multiple fills
      // default angle is 90deg
      return {
        background: `linear-gradient(90deg, ${fillsStyles.join(",")})`
      };
    };

    return {
      ...computeGradient(),
      "background-color": `${this.styleHelperService.parseColorAsRgba(
        firstFill.color
      )}`
    };
  }

  private extractShadows(current: SketchMSLayer) {
    const innerShadows = (current as any).innerShadows;
    const shadows = (current as any).shadows;
    const shadowsStyles: string[] = [];

    if (innerShadows) {
      innerShadows.forEach(innerShadow => {
        const color = this.styleHelperService.parseColorAsRgba(
          innerShadow.color
        );
        shadowsStyles.push(
          `${innerShadow.offsetX}px ${innerShadow.offsetY}px ${
            innerShadow.blurRadius
          }px ${innerShadow.spread}px ${color} inset`
        );
      });
    }

    if (shadows) {
      shadows.forEach(shadow => {
        const color = this.styleHelperService.parseColorAsRgba(shadow.color);
        shadowsStyles.push(
          `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${
            shadow.spread
          }px ${color}`
        );
      });
    }

    if (shadowsStyles.length <= 0) {
      return {};
    }

    return {
      "box-shadow": shadowsStyles.join(",")
    };
  }

  private maybeUnstableProperty(data) {
    try {
      return data;
    } catch (e) {
      if (e instanceof TypeError) {
        return {};
      } else {
        throw e;
      }
    }
  }
}
