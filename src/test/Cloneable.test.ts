/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable, isCloneable } from "../main/Cloneable";

class Test implements Cloneable<Test> {
    public clone(): Test {
        return new Test();
    }
}

describe("Cloneable", () => {
    describe("isCloneable", () => {
        it("returns true for cloneable object", () => {
            expect(isCloneable(new Test())).toBe(true);
        });
        it("returns false for non-cloneable objects", () => {
            expect(isCloneable([ 1, 2, 3 ])).toBe(false);
            expect(isCloneable({})).toBe(false);
            expect(isCloneable(34)).toBe(false);
            expect(isCloneable("34")).toBe(false);
            expect(isCloneable(null)).toBe(false);
            expect(isCloneable(undefined)).toBe(false);
            expect(isCloneable(true)).toBe(false);
        });
    });
});
