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
  between,
} from "../build/utils/filters";

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
    expect(not(statement)).toBe("NOT%20'statement'");
  });
});

describe("Spatial Operators", () => {
  test("Intersects Point w/ geojson geometry", () => {
    const point = {
      coordinates: [-0.72799, 52.400505],
      type: "Point",
    };
    expect(intersects(point)).toBe(
      "INTERSECTS(geometry,%20POINT%20(-0.72799%2052.400505))"
    );
  });

  test("Intersects Polygon w/ geojson geometry", () => {
    const polygon = {
      coordinates: [
        [
          [-3.54248, 50.727334],
          [-3.54248, 50.727844],
          [-3.541138, 50.727844],
          [-3.541138, 50.727334],
          [-3.54248, 50.727334],
        ],
      ],
      type: "Polygon",
    };
    expect(intersects(polygon)).toBe(
      "INTERSECTS(geometry,%20POLYGON%20((-3.54248%2050.727334%2C%20-3.54248%2050.727844%2C%20-3.541138%2050.727844%2C%20-3.541138%2050.727334%2C%20-3.54248%2050.727334)))"
    );
  });

  test("Intersects Point w/ WKT geometry", () => {
    const point = "POINT (-0.72799 52.400505)";
    expect(intersects(point)).toBe(
      "INTERSECTS(geometry,%20POINT%20(-0.72799%2052.400505))"
    );
  });

  test("Intersects Polygon w/ WKT geometry", () => {
    const polygon =
      "POLYGON ((-3.54248 50.727334, -3.54248 50.727844, -3.541138 50.727844, -3.541138 50.727334, -3.54248 50.727334))";
    expect(intersects(polygon)).toBe(
      "INTERSECTS(geometry,%20POLYGON%20((-3.54248%2050.727334%2C%20-3.54248%2050.727844%2C%20-3.541138%2050.727844%2C%20-3.541138%2050.727334%2C%20-3.54248%2050.727334)))"
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
