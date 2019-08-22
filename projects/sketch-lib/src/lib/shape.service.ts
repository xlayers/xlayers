import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  parsePoint(point: string, offset: number, current: SketchMSLayer) {
    const parsedPoint = point.slice(1, -1).split(', ');
    return {
      x: Number.parseFloat(
        (
          current.frame.width * Number.parseFloat(parsedPoint[0]) +
          offset
        ).toFixed(3)
      ),
      y: Number.parseFloat(
        (
          current.frame.height * Number.parseFloat(parsedPoint[1]) +
          offset
        ).toFixed(3)
      )
    };
  }
}
