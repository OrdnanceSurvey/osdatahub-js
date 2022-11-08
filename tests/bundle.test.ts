import * as osdatahub from "../dist/bundle.min.js"
import { describe, expect, test } from "@jest/globals";


describe("All modules are available", () => {
    test("Places", () => {
      expect(osdatahub.placesAPI).toBeTruthy()
    });

    test("Names", () => {
        expect(osdatahub.namesAPI).toBeTruthy()
      });

      test("NGD", () => {
        expect(osdatahub.ngd).toBeTruthy()
      });
})
