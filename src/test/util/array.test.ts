/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { concat, findLast, findLastIndex, isArrayLike } from "../../main/util/array";

describe("array", () => {
    describe("isArrayLike", () => {
        it("returns true for standard array", () => {
            expect(isArrayLike([ 1, 2, 3 ])).toBe(true);
        });
        it("returns true for typed arrays", () => {
            expect(isArrayLike(new Uint8Array(10))).toBe(true);
            expect(isArrayLike(new Uint16Array(10))).toBe(true);
            expect(isArrayLike(new Uint32Array(10))).toBe(true);
            expect(isArrayLike(new Int8Array(10))).toBe(true);
            expect(isArrayLike(new Int16Array(10))).toBe(true);
            expect(isArrayLike(new Int32Array(10))).toBe(true);
            expect(isArrayLike(new Float32Array(10))).toBe(true);
            expect(isArrayLike(new Float64Array(10))).toBe(true);
        });
        it("returns false for non arrays", () => {
            expect(isArrayLike({})).toBe(false);
            expect(isArrayLike(34)).toBe(false);
            expect(isArrayLike(null)).toBe(false);
            expect(isArrayLike(undefined)).toBe(false);
            expect(isArrayLike(true)).toBe(false);
        });
        it("supports optional array item type parameter", () => {
            const a = [ 1, 2, 3, 4, 5, 6 ] as ArrayLike<unknown> | number;
            if (isArrayLike<number>(a)) {
                expect(a[0].toFixed(2)).toBe("1.00");
            }
        });
    });

    describe("concat", () => {
        it("concatenates two standard arrays", () => {
            const a = [ 1, 2, 3 ];
            const b = [ 4, 5 ];
            const c = concat(a, b);
            expect(c).toEqual([ 1, 2, 3, 4, 5 ]);
            expect(c).not.toBe(a);
            expect(c).not.toBe(b);
        });
        it("concatenates three standard arrays", () => {
            const a = [ 1, 2, 3 ];
            const b = [ 4, 5 ];
            const c = [ 6 ];
            const d = concat(a, b, c);
            expect(d).toEqual([ 1, 2, 3, 4, 5, 6 ]);
            expect(d).not.toBe(a);
            expect(d).not.toBe(b);
            expect(d).not.toBe(c);
        });
        it("concatenates two Uint16Array", () => {
            const a = new Uint16Array([ 1, 2, 3 ]);
            const b = new Uint16Array([ 4, 65535 ]);
            const c = concat(a, b);
            expect(c).toBeInstanceOf(Uint16Array);
            expect(c).toEqual(new Uint16Array([ 1, 2, 3, 4, 65535 ]));
            expect(c).not.toBe(a);
            expect(c).not.toBe(b);
        });
        it("concatenates three Int16Array", () => {
            const a = new Int16Array([ 1, 2, 3 ]);
            const b = new Int16Array([ 4, 32767 ]);
            const c = new Int16Array([ -10000 ]);
            const d = concat(a, b, c);
            expect(d).toBeInstanceOf(Int16Array);
            expect(d).toEqual(new Int16Array([ 1, 2, 3, 4, 32767, -10000 ]));
            expect(d).not.toBe(a);
            expect(d).not.toBe(b);
            expect(d).not.toBe(c);
        });
        it("concatenates four Uint8Arrays", () => {
            const a = new Uint8Array([ 1, 2, 3 ]);
            const b = new Uint8Array([ 4, 5 ]);
            const c = new Uint8Array([ 6 ]);
            const d = new Uint8Array([ 10, 255 ]);
            const e = concat(a, b, c, d);
            expect(e).toBeInstanceOf(Uint8Array);
            expect(e).toEqual(new Uint8Array([ 1, 2, 3, 4, 5, 6, 10, 255 ]));
            expect(e).not.toBe(a);
            expect(e).not.toBe(b);
            expect(e).not.toBe(c);
            expect(e).not.toBe(d);
        });
    });

    describe("findLast", () => {
        it("returns the last value that satisfies the provided testing function", () => {
            const a = [ 1, 2, 3, 4, 5, 6 ];
            const v = findLast(a, v => v < 5);
            expect(v).toBe(4);
        });
        it("returns undefined when no matching value is found", () => {
            const a = [ 1, 2, 3, 4, 5, 6 ];
            const v = findLast(a, v => v < 1);
            expect(v).toBeUndefined();
        });
        it("passes index and array to the callback function", () => {
            const a = [ 1, 2, 3, 4, 5, 6 ];
            const v = findLast(a, (value, index, array) => {
                expect(array).toBe(a);
                expect(array.slice().pop()).toBe(6);
                expect(array.indexOf(2)).toBe(1);
                expect(array[index]).toBe(value);
                return value < 2;
            });
            expect(v).toBe(1);
        });
        it("calls callback with specified this argument", () => {
            const a = [ 1, 2, 3, 4, 5, 6 ];
            const ctx = { foo: 23 };
            const v = findLast(a, function(v) {
                expect(this).toBe(ctx);
                expect(this.foo).toBe(23);
                return v < 3;
            }, ctx);
            expect(v).toBe(2);
        });
        it("works with typed arrays", () => {
            const a = new Uint8Array([ 1, 2, 3, 4, 5, 6 ]);
            const ctx = { foo: 23 };
            const v = findLast(a, function(value, index, array) {
                expect(array).toBe(a);
                expect(array).toBeInstanceOf(Uint8Array);
                expect(array.buffer).toBeInstanceOf(ArrayBuffer);
                expect(array.indexOf(2)).toBe(1);
                expect(array[index]).toBe(value);
                expect(this).toBe(ctx);
                expect(this.foo).toBe(23);
                return value < 3;
            }, ctx);
            expect(v).toBe(2);
        });
    });

    describe("findLastIndex", () => {
        it("returns the index of the last value that satisfies the provided testing function", () => {
            const a = [ 1, 2, 3, 4, 5, 6 ];
            const v = findLastIndex(a, v => v < 5);
            expect(v).toBe(3);
        });
        it("returns -1 when no matching value is found", () => {
            const a = [ 1, 2, 3, 4, 5, 6 ];
            const v = findLastIndex(a, v => v < 1);
            expect(v).toBe(-1);
        });
        it("passes index and array to the callback function", () => {
            const a = [ 1, 2, 3, 4, 5, 6 ];
            const v = findLastIndex(a, (value, index, array) => {
                expect(array).toBe(a);
                expect(array.slice().pop()).toBe(6);
                expect(array.indexOf(2)).toBe(1);
                expect(array[index]).toBe(value);
                return value < 2;
            });
            expect(v).toBe(0);
        });
        it("calls callback with specified this argument", () => {
            const a = [ 1, 2, 3, 4, 5, 6 ];
            const ctx = { foo: 23 };
            const v = findLastIndex(a, function(v) {
                expect(this).toBe(ctx);
                expect(this.foo).toBe(23);
                return v < 3;
            }, ctx);
            expect(v).toBe(1);
        });
        it("works with typed arrays", () => {
            const a = new Uint8Array([ 1, 2, 3, 4, 5, 6 ]);
            const ctx = { foo: 23 };
            const v = findLastIndex(a, function(value, index, array) {
                expect(array).toBe(a);
                expect(array).toBeInstanceOf(Uint8Array);
                expect(array.buffer).toBeInstanceOf(ArrayBuffer);
                expect(array.indexOf(2)).toBe(1);
                expect(array[index]).toBe(value);
                expect(this).toBe(ctx);
                expect(this.foo).toBe(23);
                return value < 3;
            }, ctx);
            expect(v).toBe(1);
        });
    });
});
