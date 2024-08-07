/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Equatable, isEqual } from "../../main/lang/Equatable";
import { equals, getObjectId, isRecord } from "../../main/util/object";

describe("object", () => {
    describe("getObjectId", () => {
        it("returns the unique object ID for an object", () => {
            const o1 = {};
            const o2 = {};
            const o3: number[] = [];
            const o4 = new Date();
            const id1 = getObjectId(o1);
            const id2 = getObjectId(o2);
            const id3 = getObjectId(o3);
            const id4 = getObjectId(o4);
            expect(id1).not.toBe(id2);
            expect(id1).not.toBe(id3);
            expect(id1).not.toBe(id4);
            expect(id2).not.toBe(id3);
            expect(id2).not.toBe(id4);
            expect(id3).not.toBe(id4);
            expect(getObjectId(o4)).toBe(id4);
            expect(getObjectId(o3)).toBe(id3);
            expect(getObjectId(o2)).toBe(id2);
            expect(getObjectId(o1)).toBe(id1);
        });
    });

    describe("isRecord", () => {
        it("returns true for record objects", () => {
            expect(isRecord({})).toBe(true);
        });
        it("returns false for non-record objects", () => {
            expect(isRecord(23)).toBe(false);
            expect(isRecord("23")).toBe(false);
            expect(isRecord([ 1 ])).toBe(false);
            expect(isRecord(true)).toBe(false);
            expect(isRecord(null)).toBe(false);
            expect(isRecord(undefined)).toBe(false);
            expect(isRecord(new Date())).toBe(false);
        });
    });

    describe("equals", () => {
        it("returns true if objects are equal", () => {
            const f = (): void => {};
            expect(equals(f, f)).toBe(true);
            expect(equals(null, null)).toBe(true);
            expect(equals(undefined, undefined)).toBe(true);
            expect(equals(2, 2)).toBe(true);
            expect(equals("foo", "foo")).toBe(true);
            expect(equals(true, true)).toBe(true);
            expect(equals({ a: 1, b: [ false ] }, { a: 1, b: [ false ] })).toBe(true);
            expect(equals([ 1, 2 ], [ 1, 2 ])).toBe(true);
            expect(equals(new Set([ 1, 2, 3 ]), new Set([ 3, 2, 1 ]))).toBe(true);
        });
        it("returns false if objects are not equal", () => {
            const f1 = (): void => {};
            const f2 = (): void => {};
            expect(equals(f1, f2)).toBe(false);
            expect(equals(null, undefined)).toBe(false);
            expect(equals(1, 2)).toBe(false);
            expect(equals(1, "1")).toBe(false);
            expect(equals([ 1 ], [ 2 ])).toBe(false);
            expect(equals([ 1 ], [ 1, 2 ])).toBe(false);
            expect(equals([ 1 ], 1)).toBe(false);
            expect(equals([ 1 ], { a: 1 })).toBe(false);
            expect(equals(new Set([ 1, 2, 3 ]), new Set([ 3, 1 ]))).toBe(false);
            expect(equals(new Set([ 1, 2, 3 ]), new Set([ 1, 3, 4 ]))).toBe(false);
            expect(equals({ a: 1 }, { a: 2 })).toBe(false);
            expect(equals({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        });
        it("can handle recursion loops", () => {
            const o1 = { a: 1, b: {} };
            o1.b = o1;
            const o2 = { a: 1, b: {} };
            o2.b = o2;
            const o3 = { a: 1, c: {} };
            o3.c = o3;
            expect(equals(o1, o2)).toBe(true);
            expect(equals(o1, o3)).toBe(false);
        });
        it("supports equatable objects", () => {
            class Test implements Equatable {
                public constructor(public readonly value: number) {}

                public equals(other: unknown): boolean {
                    return isEqual(this, other, other => this.value === other.value);
                }
            }
            expect(equals(new Test(1), new Test(1))).toBe(true);
            expect(equals(new Test(1), new Test(2))).toBe(false);
        });
        it("can compare typed arrays", () => {
            expect(equals(new Uint8Array([ 1, 2, 3 ]), new Uint8Array([ 1, 2, 3 ]))).toBe(true);
            expect(equals(new Uint8Array([ 1, 2, 3 ]), new Uint8Array([ 1, 2, 4 ]))).toBe(false);
            expect(equals(new Uint8Array([ 1, 2, 3 ]), new Uint8Array([ 1, 2 ]))).toBe(false);
            expect(equals(new Uint8Array([ 1, 2, 3 ]), new Uint8ClampedArray([ 1, 2, 3 ]))).toBe(false);
            expect(equals(new Uint8Array([ 1, 2, 3 ]), [ 1, 2, 3 ])).toBe(false);
        });
    });
});
