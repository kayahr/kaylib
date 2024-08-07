/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isSerializable, Serializable } from "../../main/lang/Serializable";

interface TestJSON {
    value: number;
}

class Test implements Serializable<TestJSON> {
    public constructor(public readonly value: number) {}

    public toJSON(): TestJSON {
        return { value: this.value };
    }
}

describe("Serializable", () => {
    describe("isSerializable", () => {
        it("returns true for serializable object", () => {
            expect(isSerializable(new Test(2))).toBe(true);
        });
        it("returns true for date object", () => {
            expect(isSerializable(new Date())).toBe(true);
        });
        it("returns false for non-serializable objects", () => {
            expect(isSerializable([ 1, 2, 3 ])).toBe(false);
            expect(isSerializable({})).toBe(false);
            expect(isSerializable(34)).toBe(false);
            expect(isSerializable("34")).toBe(false);
            expect(isSerializable(null)).toBe(false);
            expect(isSerializable(undefined)).toBe(false);
            expect(isSerializable(true)).toBe(false);
        });
    });
});
