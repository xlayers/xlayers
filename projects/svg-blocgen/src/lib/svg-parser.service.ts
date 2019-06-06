import { Injectable } from "@angular/core";
import { ShapeService } from "@xlayers/std-blocgen";
import { StyleService } from "@xlayers/std-blocgen";
import { SvgContextService } from "./svg-context.service";

@Injectable({
  providedIn: "root"
})
export class SvgParserService {
  constructor(
    private shapeHelperService: ShapeService,
    private styleHelperService: StyleService,
    private svgContextService: SvgContextService
  ) {}

  compute(current: SketchMSLayer) {
    this.svgContextService.putContext(current, {
      ...this.svgContextService.contextOf(current),
      ...this.extractShapes(current)
    });
  }

  private extractShapes(current: SketchMSLayer) {
    switch (current._class as string) {
      case "shapePath":
        return this.extractShapePath(current);
      case "shapeGroup":
        return this.extractShapeGroup(current);
      case "triangle":
        return this.extractTriangleShape(current);
      default:
        return {};
    }
  }

  private extractShapePath(current: SketchMSLayer) {
    const config = [];
    let offset = 0;

    // TODO: Support multiple border
    if (
      current.style.borders &&
      current.style.borders.length > 0 &&
      current.style.borders[0].thickness
    ) {
      config.push(`stroke-width="${current.style.borders[0].thickness}"`);
      const color = this.styleHelperService.parseColorAsHex(
        current.style.borders[0].color
      );

      config.push(`stroke="${color}"`);
      offset = current.style.borders[0].thickness;
    }

    // TODO: move to @types/sketchapp
    const origin = this.shapeHelperService.parsePoint(
      (current as any).points[0].point,
      offset,
      current
    );
    const segments = (current as any).points.slice(1).map(curvePoint => {
      const curveFrom = this.shapeHelperService.parsePoint(
        curvePoint.curveFrom,
        offset,
        current
      );
      const curveTo = this.shapeHelperService.parsePoint(
        curvePoint.curveTo,
        offset,
        current
      );
      const currPoint = this.shapeHelperService.parsePoint(
        curvePoint.point,
        offset,
        current
      );
      if (curveTo.x === curveFrom.x && curveTo.y === curveFrom.y) {
        return `L ${currPoint.x} ${currPoint.y}`;
      }
      return `S ${curveTo.x} ${curveTo.y}, ${currPoint.x} ${currPoint.y}`;
    });

    segments.unshift(`M${origin.x} ${origin.y}`);

    if ((current as any).isClosed) {
      segments.push("z");
    }
    const fillStyle = this.extractFillStyle(current);

    return {
      offset,
      paths: [
        {
          type: "path",
          attributes: [...config, fillStyle, `d="${segments}"`]
        }
      ]
    };
  }

  private extractTriangleShape(current: SketchMSLayer) {
    const config = [];
    let offset = 0;

    // TODO: Support multiple border
    if (
      current.style.borders &&
      current.style.borders.length > 0 &&
      current.style.borders[0].thickness
    ) {
      config.push(`stroke-width="${current.style.borders[0].thickness / 2}"`);
      const color = this.styleHelperService.parseColorAsHex(
        current.style.borders[0].color
      );
      config.push(`stroke="${color}"`);
      offset = current.style.borders[0].thickness;
    }

    const segments = (current as any).points
      .map(curvePoint => {
        const currPoint = this.shapeHelperService.parsePoint(
          curvePoint.point,
          offset / 2,
          current
        );
        return `${currPoint.x}, ${currPoint.y}`;
      })
      .join(" ");

    const fillStyle = this.extractFillStyle(current);

    return {
      offset,
      paths: [
        {
          type: "polygon",
          attributes: [...config, fillStyle, `points="${segments}"`]
        }
      ]
    };
  }

  private extractShapeGroup(current: SketchMSLayer) {
    const offset = 0;
    const paths = current.layers.map(layer => {
      // TODO: move to @types/sketchapp
      const origin = this.shapeHelperService.parsePoint(
        (layer as any).points[0].point,
        offset,
        layer
      );
      const segments = (layer as any).points.slice(1).map(curvePoint => {
        const curveFrom = this.shapeHelperService.parsePoint(
          curvePoint.curveFrom,
          offset,
          layer
        );
        const curveTo = this.shapeHelperService.parsePoint(
          curvePoint.curveTo,
          offset,
          layer
        );
        const currPoint = this.shapeHelperService.parsePoint(
          curvePoint.point,
          offset,
          layer
        );
        if (curveTo.x === curveFrom.x && curveTo.y === curveFrom.y) {
          return `L ${layer.frame.x + currPoint.x} ${layer.frame.y +
            currPoint.y}`;
        }
        return `S ${layer.frame.x + curveTo.x} ${layer.frame.y +
          curveTo.y}, ${layer.frame.x + currPoint.x} ${layer.frame.y +
          currPoint.y}`;
      });

      segments.unshift(
        `M${layer.frame.x + origin.x} ${layer.frame.y + origin.y}`
      );

      // TODO: isClosed to type
      if ((layer as any).isClosed) {
        segments.push("z");
      }

      return segments.join(" ");
    });

    const fillStyle = this.extractFillStyle(current);

    return {
      offset,
      paths: [
        {
          type: "path",
          attributes: [fillStyle, `d="${paths.join(" ")}"`]
        }
      ]
    };
  }

  private extractFillStyle(current: SketchMSLayer) {
    const obj = (current as any).style.fills;

    if (obj && obj.length > 0) {
      // we only support one fill: take the first one!
      // ignore the other fills
      const firstFill = obj[0];

      if (firstFill.isEnabled) {
        const fillColor = this.styleHelperService.parseColorAsRgba(
          firstFill.color
        );

        return `fill="${fillColor}"`;
      }
    }

    return 'fill="none"';
  }
}