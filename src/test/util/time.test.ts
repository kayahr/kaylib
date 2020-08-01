/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { getHRTime, sleep } from "../../main/util/time";

describe("time", () => {
    describe("getHRTime", () => {
        it("returns a high resolution timestamp", async () => {
            const a = Date.now();
            await sleep(100);
            const b = getHRTime();
            await sleep(1);
            const c = getHRTime();
            expect(b).toBeGreaterThan(a);
            expect(c).toBeGreaterThan(b);
        });
    });

    describe("sleep", () => {
        it("sleeps for the given number of milliseconds", async () => {
            const a = Date.now();
            await sleep(92);
            const b = Date.now();
            expect(b - a).toBeGreaterThanOrEqual(92);
        });
    });
});
