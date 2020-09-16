// class to recognise if sketchapp shape is a rectangle, a line, a circle(TODO) or something else

import { SketchMSCurvePoint } from '@xlayers/sketchtypes';

class Point {
  x: number;
  y: number;

  constructor(str: string);
  constructor(x: number, y: number);
  constructor(strOrX, y?) {
    // a string containing the coords is input
    if (y === undefined) {
      const coords: any = this.stringToCoords(strOrX);
      if (coords) {
        this.x = this.decRound(coords.x);
        this.y = this.decRound(coords.y);
      }
      // the coords numbers are input
    } else {
      this.x = this.decRound(strOrX as number);
      this.y = this.decRound(y);
    }
  }

  // 2 decimals rounding
  decRound(number: number): number {
    return Math.round(number * 100 + 0.001) / 100;
  }

  distanceRounded(point: Point): number {
    return this.decRound(this.distance(point));
  }
  distance(point: Point): number {
    return Math.sqrt(this.distanceSquared(point));
  }
  distanceSquaredRounded(point: Point): number {
    return this.decRound(this.distanceSquared(point));
  }
  distanceSquared(point: Point): number {
    return Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2);
  }

  stringToCoords(string: string): RegExpMatchArray['groups'] | boolean {
    // match two numbers in a string of the form '{123, 456}'
    // and place them in two capturing groups named 'x' and 'y'
    // numbers may be negatives and may be int or float
    const regex =
      '{(?<x>-?d(?:.d+)?(?:e-?d+)?),s?(?<y>-?d(?:.d+)?(?:e-?d+)?)}/';
    const match = string.match(regex);
    if (!!match) {
      // match.groups: {x: number, y: number}
      return match.groups;
    }
    return false;
  }
}

class Cluster {
  points: Point[] = [];
  barycenter: Point;

  constructor(point?: Point) {
    if (point !== undefined) {
      this.addPoint(point);
    }
  }

  updateBarycenter(): void {
    let avgX = 0;
    let avgY = 0;
    this.points.forEach((point) => {
      avgX += point.x;
      avgY += point.y;
    });
    avgX /= this.points.length;
    avgY /= this.points.length;
    this.barycenter = new Point(avgX, avgY);
  }

  addPoint(point: Point): void {
    this.points.push(point);
    this.updateBarycenter();
  }
}

export class Shape {
  static readonly shapeRecognitionPrecision = 0.05;
  points: Point[];
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;

  // check if ABC is orthogonal on B
  static isOrthogonal(A: Point, B: Point, C: Point): boolean {
    return (
      Math.abs(
        A.distanceSquared(B) + B.distanceSquared(C) - A.distanceSquared(C)
      ) < Shape.shapeRecognitionPrecision
    );
  }

  constructor(points: SketchMSCurvePoint[]) {
    this.points = [];

    points.forEach((point) => {
      this.points.push(new Point(point.point));

      if (point.hasCurveFrom === true) {
        this.points.push(new Point(point.curveFrom));
      }
      if (point.hasCurveTo === true) {
        this.points.push(new Point(point.curveTo));
      }
    });
  }

  // divide the points in 4 clusters
  clusterPoints4(): any {
    let tempBarycenterX = 0,
      tempBarycenterY = 0;
    this.points.forEach((point) => {
      tempBarycenterX += point.x;
      tempBarycenterY += point.y;
    });
    const barycenter = new Point(
      tempBarycenterX / this.points.length,
      tempBarycenterY / this.points.length
    );

    const clusters: any = {};
    clusters.topLeft = new Cluster();
    clusters.topRight = new Cluster();
    clusters.bottomLeft = new Cluster();
    clusters.bottomRight = new Cluster();

    this.points.forEach((point) => {
      if (point.y < barycenter.y) {
        // TOP
        if (point.x < barycenter.x) {
          // LEFT
          clusters.topLeft.addPoint(point);
        } else {
          // RIGHT
          clusters.topRight.addPoint(point);
        }
        // BOTTOM
      } else {
        if (point.x < barycenter.x) {
          // LEFT
          clusters.bottomLeft.addPoint(point);
        } else {
          // RIGHT
          clusters.bottomRight.addPoint(point);
        }
      }
    });

    return clusters;
  }

  isRectangle(): boolean {
    if (this.points.length < 4) {
      return false;
    }

    const clusters: any = this.clusterPoints4();

    for (const corner in clusters) {
      if (clusters[corner].points.length === 0) {
        return false;
      }
    }

    const topLength = clusters.topLeft.barycenter.distance(
      clusters.topRight.barycenter
    );
    const bottomLength = clusters.bottomLeft.barycenter.distance(
      clusters.bottomRight.barycenter
    );
    const leftLength = clusters.topLeft.barycenter.distance(
      clusters.bottomLeft.barycenter
    );
    const rightLength = clusters.topRight.barycenter.distance(
      clusters.bottomRight.barycenter
    );

    return (
      Math.abs(topLength - bottomLength) < Shape.shapeRecognitionPrecision &&
      Math.abs(leftLength - rightLength) < Shape.shapeRecognitionPrecision &&
      Shape.isOrthogonal(
        clusters.bottomLeft.barycenter,
        clusters.topLeft.barycenter,
        clusters.topRight.barycenter
      )
    );
  }

  isLine(): boolean {
    return (
      this.points.length === 2 &&
      Math.abs(this.points[0].y - this.points[1].y) <
        Shape.shapeRecognitionPrecision
    );
  }

  isRound(): boolean {
    if (this.isRectangle() || this.isLine()) {
      return false;
    }

    const circle = new Cluster();
    this.points.forEach((point) => {
      circle.addPoint(point);
    });

    // if the points are not equally sprayed around the circle,
    // the barycenter may be different from the actual center of the circle
    const center = new Point(0.5, 0.5);
    const radius2 = circle.points[0].distanceSquaredRounded(circle.barycenter);
    const radiusCenter2 = circle.points[0].distanceSquaredRounded(center);

    let isCircle = true;
    let isCircleCentered = true;

    circle.points.some((point) => {
      if (
        Math.abs(point.distanceSquaredRounded(circle.barycenter) - radius2) >
        Shape.shapeRecognitionPrecision * 2
      ) {
        isCircle = false;
        return true;
      }
    });
    circle.points.some((point) => {
      if (
        Math.abs(point.distanceSquaredRounded(center) - radiusCenter2) >
        Shape.shapeRecognitionPrecision * 2
      ) {
        isCircleCentered = false;
        return true;
      }
    });

    return isCircle || isCircleCentered;
  }
}
