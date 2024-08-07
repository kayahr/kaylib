/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Equatable, isEqual, isEquatable } from "../../main/lang/Equatable";

class Test1 implements Equatable {
    public constructor(public readonly value: number) {}

    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.value === other.value);
    }
}

class Test2 extends Test1 {
    public constructor(value: number) {
        super(value);
    }
}

class Test3 extends Test2 {
    public constructor(value: number) {
        super(value);
    }

    public override equals(other: unknown): boolean {
        return isEqual(this, other, other => this.value === other.value);
    }
}

describe("Equatable", () => {
    describe("isEquatable", () => {
        it("returns true for equatable object", () => {
            expect(isEquatable(new Test1(1))).toBe(true);
            expect(isEquatable(new Test2(2))).toBe(true);
            expect(isEquatable(new Test3(3))).toBe(true);
        });
        it("returns false for non-equatable objects", () => {
            expect(isEquatable([ 1, 2, 3 ])).toBe(false);
            expect(isEquatable({})).toBe(false);
            expect(isEquatable(34)).toBe(false);
            expect(isEquatable("34")).toBe(false);
            expect(isEquatable(null)).toBe(false);
            expect(isEquatable(undefined)).toBe(false);
            expect(isEquatable(true)).toBe(false);
        });
    });

    describe("isEqual", () => {
        it("correctly identifies equal objects", () => {
            expect(new Test1(1).equals(new Test1(1))).toBe(true);
            expect(new Test1(1).equals(new Test1(2))).toBe(false);
            expect(new Test1(1).equals(new Test2(1))).toBe(true);
            expect(new Test1(1).equals(new Test2(2))).toBe(false);
            expect(new Test1(1).equals(new Test3(1))).toBe(false);
            const a = new Test1(1);
            expect(a.equals(a)).toBe(true);
            expect(a.equals(null)).toBe(false);
            expect(a.equals(undefined)).toBe(false);
            expect(a.equals(1)).toBe(false);
        });
    });
});
