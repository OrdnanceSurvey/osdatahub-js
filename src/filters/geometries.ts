export { Point, Polygon };

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `POINT(${this.x}%20${this.y})`;
  }
}

class Polygon {
  coordinates: number[][];

  constructor(coordinates: number[][]) {
    this.coordinates = coordinates;
  }

  toString(): string {
    let coordinateStrings: string[] = [];
    this.coordinates.forEach((coord) => {
      coordinateStrings.push(coord.join("%20"));
    });
    return `POLYGON((${coordinateStrings.join(",")}))`;
  }
}
