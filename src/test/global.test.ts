/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { global } from "../main/global";

describe("global", () => {
    it("is the global context of the environment", () => {
        expect(global.Uint8Array).toBe(Uint8Array);
    });
    it("easily allows setting custom data by using Record typing", () => {
        global.customValue = 23;
        expect(global.customValue).toBe(23);
        delete global.customValue;
    });
});
