/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Enableable, isEnableable } from "../../main/lang/Enableable";

class Test implements Enableable {
    public isEnabled(): boolean {
        return false;
    }

    public enable(): void {
    }
}

describe("Enableable", () => {
    describe("isEnableable", () => {
        it("returns true for enableable object", () => {
            expect(isEnableable(new Test())).toBe(true);
        });
        it("returns false for non-enableable objects", () => {
            expect(isEnableable([ 1, 2, 3 ])).toBe(false);
            expect(isEnableable({})).toBe(false);
            expect(isEnableable(34)).toBe(false);
            expect(isEnableable("34")).toBe(false);
            expect(isEnableable(null)).toBe(false);
            expect(isEnableable(undefined)).toBe(false);
            expect(isEnableable(true)).toBe(false);
        });
    });
});
