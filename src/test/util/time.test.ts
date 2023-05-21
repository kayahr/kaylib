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
    });
});
