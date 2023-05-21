/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { assert, AssertException } from "../../main/util/assert";

describe("assert", () => {
    describe("assert", () => {
        console.log((23).toLocaleString());
        it("throws exception if condition is false", () => {
            expect(() => assert(2 < 1)).toThrowWithMessage(AssertException, "Assertion failed");
        });
        it("throws exception with custom message if condition is false", () => {
            expect(() => assert(2 < 1, "Custom message")).toThrowWithMessage(AssertException, "Custom message");
        });
        it("does not throw error if condition is true", () => {
            const value = "Foo" as string | null;
            assert(value != null);
            expect(value.length).toBe(3); // Type inference check
        });
    });
});
