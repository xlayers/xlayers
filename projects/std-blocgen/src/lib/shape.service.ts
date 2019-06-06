import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  parsePoint(point: string, offset: number, node: SketchMSLayer) {
    const parsedPoint = point.slice(1, -1).split(', ');
    return {
      x: Number.parseFloat(
        (node.frame.width * Number.parseFloat(parsedPoint[0]) + offset).toFixed(
          3
        )
      ),
      y: Number.parseFloat(
        (
          node.frame.height * Number.parseFloat(parsedPoint[1]) +
          offset
        ).toFixed(3)
      )
    };
  }
}
