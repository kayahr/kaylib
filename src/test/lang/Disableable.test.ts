/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Disableable, isDisableable } from "../../main/lang/Disableable";

class Test implements Disableable {
    public isDisabled(): boolean {
        return false;
    }

    public disable(): void {
    }
}

describe("Disableable", () => {
    describe("isDisableable", () => {
        it("returns true for disableable object", () => {
            expect(isDisableable(new Test())).toBe(true);
        });
        it("returns false for non-disableable objects", () => {
            expect(isDisableable([ 1, 2, 3 ])).toBe(false);
            expect(isDisableable({})).toBe(false);
            expect(isDisableable(34)).toBe(false);
            expect(isDisableable("34")).toBe(false);
            expect(isDisableable(null)).toBe(false);
            expect(isDisableable(undefined)).toBe(false);
            expect(isDisableable(true)).toBe(false);
        });
    });
});
