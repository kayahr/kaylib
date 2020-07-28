/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isList, List } from "../../main/lang/List";

class TestList<T> {
    public constructor(private readonly items: T[]) {}

    public item(index: number): T {
        return this.items[index];
    }

    public get length(): number {
        return this.items.length;
    }
}

describe("List", () => {
    describe("isList", () => {
        it("returns true for standard array", () => {
            expect(isList(new TestList([ 1, 2, 3 ]))).toBe(true);
        });
        it("returns false for non arrays", () => {
            expect(isList([ 1, 2, 3 ])).toBe(false);
            expect(isList({})).toBe(false);
            expect(isList(34)).toBe(false);
            expect(isList("34")).toBe(false);
            expect(isList(null)).toBe(false);
            expect(isList(undefined)).toBe(false);
            expect(isList(true)).toBe(false);
        });
        it("supports optional list item type parameter", () => {
            const a = new TestList([ 1, 2, 3, 4, 5, 6 ]) as List | number;
            if (isList<number>(a)) {
                expect(a.item(0).toFixed(2)).toBe("1.00");
            }
        });
    });
});
