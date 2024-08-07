/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Comparable, compare, isComparable } from "../../main/lang/Comparable";

class Test implements Comparable<Test> {
    public constructor(public readonly value: number) {}

    public compareTo(other: Test): number {
        return this.value - other.value;
    }
}

describe("Comparable", () => {
    describe("isComparable", () => {
        it("returns true for cloneable object", () => {
            expect(isComparable(new Test(1))).toBe(true);
        });
        it("returns false for non-cloneable objects", () => {
            expect(isComparable([ 1, 2, 3 ])).toBe(false);
            expect(isComparable({})).toBe(false);
            expect(isComparable(34)).toBe(false);
            expect(isComparable("34")).toBe(false);
            expect(isComparable(null)).toBe(false);
            expect(isComparable(undefined)).toBe(false);
            expect(isComparable(true)).toBe(false);
        });
    });

    describe("compare", () => {
        it("compares two comparable objects", () => {
            const a = new Test(5);
            const b = new Test(3);
            expect(compare(a, b)).toBe(2);
            expect(compare(b, a)).toBe(-2);
        });
    });
});
