/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { sleep } from "../../main/util/time";

describe("time", () => {
    describe("sleep", () => {
        it("sleeps for the given number of milliseconds", async () => {
            const a = Date.now();
            await sleep(92);
            const b = Date.now();
            expect(b - a).toBeGreaterThanOrEqual(92);
        });
    });
});
