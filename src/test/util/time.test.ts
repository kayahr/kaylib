/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { sleep } from "../../main/util/time";

describe("time", () => {
    describe("sleep", () => {
        it("sleeps for the given number of milliseconds", async () => {
            const a = performance.now();
            await sleep(100);
            const b = performance.now();
            expect(b - a).toBeGreaterThanOrEqual(50);
        });
        it("sleeps for minimum number of milliseconds when no parameter is given", async () => {
            const a = performance.now();
            await sleep();
            const b = performance.now();
            expect(b - a).toBeGreaterThan(0);
        });
    });
});
