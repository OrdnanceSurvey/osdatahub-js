import { describe, expect, test } from "@jest/globals";
import {
  and,
  or,
  intersects,
  not,
  equals,
  lessThan,
  lessThanOrEqual,
  greaterThan,
  greaterThanOrEqual,
  like,
  between
} from "../build/filters/filters";
import { Point, Polygon } from "../build/filters/geometries";

describe("Logical Operators", () => {
  test("and", () => {
    const filter1 = "title=test_title";
    const filter2 = "description=test_description";
    expect(and(filter1, filter2)).toBe(
      "title=test_title%20AND%20description=test_description"
    );
  });

  test("or", () => {
    const filter1 = "title=test_title";
    const filter2 = "description=test_description";
    expect(or(filter1, filter2)).toBe(
      "title=test_title%20OR%20description=test_description"
    );
  });

  test("not", () => {
    const statement = "statement";
    expect(not(statement)).toBe("NOT%20statement");
  });
});

describe("Spatial Operators", () => {
  test("Intersects Point", () => {
    const point = new Point(-3.541582, 50.727613);
    expect(intersects(point)).toBe(
      "INTERSECTS(geometry,%20POINT(-3.541582%2050.727613))"
    );
  });

  test("Intersects Polygon", () => {
    const polygon = new Polygon([
      [-3.54248, 50.727334],
      [-3.54248, 50.727844],
      [-3.541138, 50.727844],
      [-3.541138, 50.727334],
      [-3.54248, 50.727334],
    ]);
    expect(intersects(polygon)).toBe(
      "INTERSECTS(geometry,%20POLYGON((-3.54248%2050.727334,-3.54248%2050.727844,-3.541138%2050.727844,-3.541138%2050.727334,-3.54248%2050.727334)))"
    );
  });
});

describe("Comparison Operators", () => {
  test("Equal", () => {
    expect(equals("description", "Building")).toBe(
      "description%20=%20'Building'"
    );
  });

  test("Less Than", () => {
    expect(lessThan("relativeheightmaximum", 10.5)).toBe(
      "relativeheightmaximum%20%3C%2010.5"
    );
  });

  test("Less Than Or Equal To", () => {
    expect(lessThanOrEqual("relativeheightmaximum", 10.5)).toBe(
      "relativeheightmaximum%20%3C=%2010.5"
    );
  });

  test("Greater Than", () => {
    expect(greaterThan("relativeheightmaximum", 10.5)).toBe(
      "relativeheightmaximum%20%3E%2010.5"
    );
  });

  test("Greater Than Or Equal To", () => {
    expect(greaterThanOrEqual("relativeheightmaximum", 10.5)).toBe(
      "relativeheightmaximum%20%3E=%2010.5"
    );
  });

    test("Like", () => {
      expect(like("description", "Archway%")).toBe(
        "description%20LIKE%20'Archway%25'"
      );
    });

  //   // test("In", () => {
  //   //     expect(in("description", "Archway%")).toBe("description%20LIKE%20'Archway%25")

  //   // });

    test("Between", () => {
      expect(between("geometry_area", 30.5, 60.5)).toBe(
        "geometry_area%20BETWEEN%2030.5%20and%2060.5"
      );
    });
});
