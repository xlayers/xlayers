// class to recognise if sketchapp shape is a rectangle, a line, a circle(TODO) or something else

class Point {
    x: number;
    y: number;

    constructor(strOrX: string | number, y: number = null) {
        // a string containing the coords is input
        if (y === null) {
            const coords: any = this.stringToCoords(strOrX as string);
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
        const regex = /{(?<x>\-?\d(?:\.\d+)?(?:e\-?\d+)?),\s?(?<y>\-?\d(?:\.\d+)?(?:e\-?\d+)?)}/;
        const match = string.match(regex);
        if (!!match) {
            return match.groups;
        }
        return false;
    }
}

class Cluster {
    points: Point[] = [];
    barycenter: Point;

    constructor(point: Point = null) {
        if (point !== null) {
            this.addPoint(point);
        }
    }

    updateBarycenter(): void {
        let avgX = 0;
        let avgY = 0;
        this.points.forEach(point => {
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
    Points: Point[];
    topLeft: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;

    static get error(): number {
        return 0.05;
    }

    // check if ABC is orthogonal on B
    static isOrthogonal(A: Point, B: Point, C: Point): boolean {
        return Math.abs(A.distanceSquared(B) + B.distanceSquared(C) - A.distanceSquared(C)) < Shape.error;
    }

    constructor(points: SketchMSCurvePoint[]) {
        this.Points = [];

        points.forEach(point => {
            this.Points.push(new Point(point.point));

            if (point.hasCurveFrom === true) {
                this.Points.push(new Point(point.curveFrom));
            }
            if (point.hasCurveTo === true) {
                this.Points.push(new Point(point.curveTo));
            }
        });
    }

    // divide the points in 4 clusters
    clusterPoints4(): any {
        let tempBarycenterX = 0,
            tempBarycenterY = 0;
        this.Points.forEach(point => {
            tempBarycenterX += point.x;
            tempBarycenterY += point.y;
        });
        const barycenter = new Point(tempBarycenterX / this.Points.length, tempBarycenterY / this.Points.length);

        const Clusters: any = {};
        Clusters.topLeft = new Cluster();
        Clusters.topRight = new Cluster();
        Clusters.bottomLeft = new Cluster();
        Clusters.bottomRight = new Cluster();

        this.Points.forEach(point => {
            if (point.y < barycenter.y) {
                // TOP
                if (point.x < barycenter.x) {
                    // LEFT
                    Clusters.topLeft.addPoint(point);
                } else {
                    // RIGHT
                    Clusters.topRight.addPoint(point);
                }
                // BOTTOM
            } else {
                if (point.x < barycenter.x) {
                    // LEFT
                    Clusters.bottomLeft.addPoint(point);
                } else {
                    // RIGHT
                    Clusters.bottomRight.addPoint(point);
                }
            }
        });

        return Clusters;
    }

    isRectangle(): boolean {
        if (this.Points.length < 4) {
            return false;
        }

        const Clusters: any = this.clusterPoints4();

        for (const corner in Clusters) {
            if (Clusters[corner].points.length === 0) {
                return false;
            }
        }

        const topLength = Clusters.topLeft.barycenter.distance(Clusters.topRight.barycenter);
        const bottomLength = Clusters.bottomLeft.barycenter.distance(Clusters.bottomRight.barycenter);
        const leftLength = Clusters.topLeft.barycenter.distance(Clusters.bottomLeft.barycenter);
        const rightLength = Clusters.topRight.barycenter.distance(Clusters.bottomRight.barycenter);

        return Math.abs(topLength - bottomLength) < Shape.error
            && Math.abs(leftLength - rightLength) < Shape.error
            && Shape.isOrthogonal(Clusters.bottomLeft.barycenter, Clusters.topLeft.barycenter, Clusters.topRight.barycenter);
    }

    isLine(): boolean {
        return this.Points.length === 2
            && Math.abs(this.Points[0].y - this.Points[1].y) < Shape.error;
    }

    isRound(): boolean {
        if (this.isRectangle() || this.isLine()) {
            return false;
        }

        const circle = new Cluster();
        this.Points.forEach(point => {
            circle.addPoint(point);
        });

        // if the points are not equally sprayed around the circle,
        // the barycenter may be different from the actual center of the circle
        const center = new Point(0.5, 0.5);
        const radius2 = circle.points[0].distanceSquaredRounded(circle.barycenter);
        const radiusCenter2 = circle.points[0].distanceSquaredRounded(center);

        let isCircle = true;
        let isCircleCentered = true;

        circle.points.some(point => {
            if (Math.abs(point.distanceSquaredRounded(circle.barycenter) - radius2) > Shape.error * 2) {
                isCircle = false;
                return true;
            }
        });
        circle.points.some(point => {
            if (Math.abs(point.distanceSquaredRounded(center) - radiusCenter2) > Shape.error * 2) {
                isCircleCentered = false;
                return true;
            }
        });

        return isCircle || isCircleCentered;
    }
}
