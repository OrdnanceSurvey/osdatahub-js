import { osfetch } from '../src/index.mjs'

test("Runs sanitise without api key and expects error", () => {

    expect(osfetch.names({})).toThrow();
});