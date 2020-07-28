/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isIterable } from "../../main/lang/Iterable";

class Test<T> implements Iterable<T> {
    public [Symbol.iterator](): Iterator<T> {
        throw new Error("Method not implemented");
    }
}

describe("Iterable", () => {
    describe("isIterable", () => {
        it("returns true for iterable object", () => {
            expect(isIterable(new Test())).toBe(true);
            expect(isIterable([ 1, 2, 3 ])).toBe(true);
            expect(isIterable(new Uint8Array([ 1, 2, 3 ]))).toBe(true);
            expect(isIterable("34")).toBe(true);
        });
        it("returns false for non-Iterable objects", () => {
            expect(isIterable({})).toBe(false);
            expect(isIterable(34)).toBe(false);
            expect(isIterable(null)).toBe(false);
            expect(isIterable(undefined)).toBe(false);
            expect(isIterable(true)).toBe(false);
        });
        it("supports optional value type parameter", () => {
            const a = [ 1 ] as Iterable<unknown> | number;
            if (isIterable<number>(a)) {
                for (const value of a) {
                    expect(value.toFixed(2)).toBe("1.00");
                }
            }
        });
    });
});
