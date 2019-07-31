import { Injectable } from "@angular/core";
import { StyleService } from "@xlayers/sketch-lib";
import { CssContextService } from "./css-context.service";

@Injectable({
  providedIn: "root"
})
export class CssParserService {
  constructor(
    private styleHelperService: StyleService,
    private cssContextService: CssContextService
  ) {}

  compute(current: SketchMSLayer) {
    const rules = {
      ...this.extractObjectStyles(current),
      ...this.extractFrameStyles(current)
    };

    this.cssContextService.putContext(current, {
      rules
    });
  }

  private extractFrameStyles(current: SketchMSLayer) {
    return current.frame
      ? {
          display: "block",
          position: "absolute",
          left: `${current.frame.x}px`,
          top: `${current.frame.y}px`,
          width: `${current.frame.width}px`,
          height: `${current.frame.height}px`,
          visibility: current.isVisible ? "visible" : "hidden"
        }
      : {};
  }

  private extractObjectStyles(current: SketchMSLayer) {
    switch (current._class as string) {
      case "symbolMaster":
        return this.extractFills(current);
      case "rectangle":
        return this.extractLayerStyle(current);
      case "text":
        return this.extractTextStyle(current);
      case "oval":
        return {
          ...this.addOvalShape(),
          ...this.extractLayerStyle(current)
        };
      default:
        return this.extractContainerStyle(current);
    }
  }

  private extractContainerStyle(current: SketchMSLayer) {
    return {
      ...this.extractRotation(current),
      ...this.extractBorderRadius(current),
      ...this.extractOpacity(current)
    };
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
      ...this.extractTextFont(current),
      ...this.extractTextColor(current),
      ...this.extractParagraphStyle(current)
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

  private extractOpacity(current: SketchMSLayer) {
    return (current as any).opacity
      ? {
          opacity: `${(current as any).opacity}`
        }
      : {};
  }

  private extractBorderRadius(current: SketchMSLayer) {
    const obj = (current as any).fixedRadius;
    return obj
      ? {
          "border-radius": `${obj.fixedRadius}px`
        }
      : {};
  }

  private extractRotation(current: SketchMSLayer) {
    const obj = (current as any).rotation;
    return obj
      ? {
          transform: `rotate(${current.rotation}deg)`
        }
      : {};
  }

  private extractBlur(current: SketchMSLayer) {
    const obj = (current as any).style.blur;
    return obj && obj.hasOwnProperty("radius") && obj.radius > 0
      ? {
          filter: `blur(${obj.radius}px);`
        }
      : {};
  }

  private extractBorders(current: SketchMSLayer) {
    enum BorderType {
      INSIDE = 1,
      OUTSIDE = 2,
      CENTER = 0
    }

    const obj = (current as any).style.borders;

    if (obj && obj.length > 0) {
      const bordersStyles = obj.reduce((acc, border) => {
        if (border.thickness > 0) {
          const borderColor = this.styleHelperService.parseColorAsRgba(
            border.color
          );
          const inset = border.position === BorderType.INSIDE ? "inset" : "";
          const shadow = [
            `0 0 0 ${border.thickness}px ${borderColor}`,
            inset
          ].join(" ");

          return [shadow, ...acc];
        }

        return acc;
      }, []);

      if (bordersStyles.length > 0) {
        return {
          "box-shadow": bordersStyles.join(",")
        };
      }
    }

    return {};
  }

  private extractFills(current: SketchMSLayer) {
    const obj = (current as any).style.fills;

    if (obj && obj.length > 0) {
      // we only support one fill: take the first one!
      // ignore the other fills
      const firstFill = obj[0];

      if (firstFill.isEnabled) {
        const fillColor = this.styleHelperService.parseColorAsRgba(
          firstFill.color
        );

        return {
          ...this.extractFillGradient(firstFill),
          "background-color": fillColor
        };
      }
    }

    return {};
  }

  private extractFillGradient(fill) {
    if (fill.gradient) {
      const fillsStyles = fill.gradient.stops.map(stop => {
        const position =
          stop.position >= 0 && stop.position <= 1
            ? ` ${stop.position * 100}%`
            : "";
        const fillColor = this.styleHelperService.parseColorAsRgba(stop.color);

        return `${fillColor}${position}`;
      });

      if (fillsStyles.length > 0) {
        // apply gradient, if multiple fills
        // default angle is 90deg
        return {
          background: `linear-gradient(90deg, ${fillsStyles.join(",")})`
        };
      }
    }

    return {};
  }

  private extractShadows(current: SketchMSLayer) {
    const innerShadow = this.extractInnerShadow(current);
    const outterShadow = this.extractOuterShadow(current);

    return innerShadow + outterShadow !== ""
      ? {
          "box-shadow": innerShadow + outterShadow
        }
      : {};
  }

  private extractInnerShadow(current: SketchMSLayer) {
    const innerShadows = (current as any).style.innerShadows;

    if (innerShadows) {
      return innerShadows.map(innerShadow => {
        const shadowColor = this.styleHelperService.parseColorAsRgba(
          innerShadow.color
        );

        return [
          `${innerShadow.offsetX}px`,
          `${innerShadow.offsetY}px`,
          `${innerShadow.blurRadius}px`,
          `${innerShadow.spread}px`,
          `${shadowColor}`,
          `inset`
        ].join(" ");
      });
    }

    return "";
  }

  private extractOuterShadow(current: SketchMSLayer) {
    const outerShadows = (current as any).style.shadows;
    if (outerShadows) {
      return outerShadows.map(shadow => {
        const shadowColor = this.styleHelperService.parseColorAsRgba(
          shadow.color
        );

        return [
          `${shadow.offsetX}px`,
          `${shadow.offsetY}px`,
          `${shadow.blurRadius}px`,
          `${shadow.spread}px`,
          `${shadowColor}`
        ].join(" ");
      });
    }

    return "";
  }
}
