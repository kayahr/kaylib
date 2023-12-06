/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import {
    assert, assertDefined, AssertException, assertFiniteNumber, assertNotInfinity, assertNotNaN, assertNotNull,
    assertNotUndefined, assertNumber, assertString
} from "../../main/util/assert";

describe("assert", () => {
    describe("assert", () => {
        it("throws exception if condition is false", () => {
            expect(() => assert(2 < 1)).toThrowWithMessage(AssertException, "Assertion failed");
        });
        it("throws exception with custom message if condition is false", () => {
            expect(() => assert(2 < 1, "Custom message")).toThrowWithMessage(AssertException, "Custom message");
        });
        it("throws exception with custom message created by callback if condition is false", () => {
            expect(() => assert(2 < 1, () => "Custom message")).toThrowWithMessage(AssertException, "Custom message");
        });
        it("does not throw error if condition is true", () => {
            const value = "Foo" as string | null;
            assert(value != null);
            expect(value.length).toBe(3); // Type inference check
        });
    });
    describe("assertDefined", () => {
        it("throws exception when value is undefined or null", () => {
            expect(() => assertDefined(undefined)).toThrowWithMessage(AssertException, "value must be defined");
            expect(() => assertDefined(null)).toThrowWithMessage(AssertException, "value must be defined");
        });
        it("throws exception with custom name if specified", () => {
            expect(() => assertDefined(null, "foo")).toThrowWithMessage(AssertException, "foo must be defined");
        });
        it("throws no exception when value is defined", () => {
            expect(() => assertDefined(0)).not.toThrow();
            expect(() => assertDefined(1)).not.toThrow();
            expect(() => assertDefined(NaN)).not.toThrow();
            expect(() => assertDefined(Infinity)).not.toThrow();
            expect(() => assertDefined(false)).not.toThrow();
            expect(() => assertDefined(true)).not.toThrow();
            expect(() => assertDefined("")).not.toThrow();
            expect(() => assertDefined("foo")).not.toThrow();
            expect(() => assertDefined([])).not.toThrow();
            expect(() => assertDefined([ 1 ])).not.toThrow();
            expect(() => assertDefined({})).not.toThrow();
            expect(() => assertDefined({ foo: true })).not.toThrow();
        });
    });
    describe("assertNotNull", () => {
        it("throws exception when value is null", () => {
            expect(() => assertNotNull(null)).toThrowWithMessage(AssertException, "value must not be null");
        });
        it("throws exception with custom name if specified", () => {
            expect(() => assertNotNull(null, "foo")).toThrowWithMessage(AssertException, "foo must not be null");
        });
        it("throws no exception when value is not null", () => {
            expect(() => assertNotNull(undefined)).not.toThrow();
            expect(() => assertNotNull(0)).not.toThrow();
            expect(() => assertNotNull(1)).not.toThrow();
            expect(() => assertNotNull(NaN)).not.toThrow();
            expect(() => assertNotNull(Infinity)).not.toThrow();
            expect(() => assertNotNull(false)).not.toThrow();
            expect(() => assertNotNull(true)).not.toThrow();
            expect(() => assertNotNull("")).not.toThrow();
            expect(() => assertNotNull("foo")).not.toThrow();
            expect(() => assertNotNull([])).not.toThrow();
            expect(() => assertNotNull([ 1 ])).not.toThrow();
            expect(() => assertNotNull({})).not.toThrow();
            expect(() => assertNotNull({ foo: true })).not.toThrow();
        });
    });
    describe("assertNotUndefined", () => {
        it("throws exception when value is undefined", () => {
            expect(() => assertNotUndefined(undefined)).toThrowWithMessage(AssertException,
                "value must not be undefined");
        });
        it("throws exception with custom name if specified", () => {
            expect(() => assertNotUndefined(undefined, "foo")).toThrowWithMessage(AssertException,
                "foo must not be undefined");
        });
        it("throws no exception when value is not null", () => {
            expect(() => assertNotUndefined(null)).not.toThrow();
            expect(() => assertNotUndefined(0)).not.toThrow();
            expect(() => assertNotUndefined(1)).not.toThrow();
            expect(() => assertNotUndefined(NaN)).not.toThrow();
            expect(() => assertNotUndefined(Infinity)).not.toThrow();
            expect(() => assertNotUndefined(false)).not.toThrow();
            expect(() => assertNotUndefined(true)).not.toThrow();
            expect(() => assertNotUndefined("")).not.toThrow();
            expect(() => assertNotUndefined("foo")).not.toThrow();
            expect(() => assertNotUndefined([])).not.toThrow();
            expect(() => assertNotUndefined([ 1 ])).not.toThrow();
            expect(() => assertNotUndefined({})).not.toThrow();
            expect(() => assertNotUndefined({ foo: true })).not.toThrow();
        });
    });
    describe("assertString", () => {
        it("throws exception when value is not a string", () => {
            expect(() => assertString(null)).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString(undefined)).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString(0)).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString(1)).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString(NaN)).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString(Infinity)).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString(false)).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString(true)).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString([])).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString([ 1 ])).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString({})).toThrowWithMessage(AssertException, "value must be a string");
            expect(() => assertString({ foo: true })).toThrowWithMessage(AssertException, "value must be a string");
        });
        it("throws exception with custom name if specified", () => {
            expect(() => assertString(2, "foo")).toThrowWithMessage(AssertException, "foo must be a string");
        });
        it("throws no exception when value is a string", () => {
            expect(() => assertString("")).not.toThrow();
            expect(() => assertString("foo")).not.toThrow();
        });
    });
    describe("assertNumber", () => {
        it("throws exception when value is not a number", () => {
            expect(() => assertNumber(null)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNumber(undefined)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNumber("")).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNumber("foo")).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNumber(false)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNumber(true)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNumber([])).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNumber([ 1 ])).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNumber({})).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNumber({ foo: true })).toThrowWithMessage(AssertException, "value must be a number");
        });
        it("throws exception with custom name if specified", () => {
            expect(() => assertNumber(true, "foo")).toThrowWithMessage(AssertException, "foo must be a number");
        });
        it("throws no exception when value is a string", () => {
            expect(() => assertNumber(0)).not.toThrow();
            expect(() => assertNumber(1)).not.toThrow();
            expect(() => assertNumber(NaN)).not.toThrow();
            expect(() => assertNumber(Infinity)).not.toThrow();
        });
    });
    describe("assertNotNaN", () => {
        it("throws exception when value is not a number", () => {
            expect(() => assertNotNaN(null)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotNaN(undefined)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotNaN("")).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotNaN("foo")).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotNaN(false)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotNaN(true)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotNaN([])).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotNaN([ 1 ])).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotNaN({})).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotNaN({ foo: true })).toThrowWithMessage(AssertException, "value must be a number");
        });
        it("throws exception when value is NaN", () => {
            expect(() => assertNotNaN(NaN)).toThrowWithMessage(AssertException, "value must not be NaN");
        });
        it("throws exception with custom name if specified", () => {
            expect(() => assertNotNaN(NaN, "foo")).toThrowWithMessage(AssertException, "foo must not be NaN");
        });
        it("throws no exception when value is a valid number", () => {
            expect(() => assertNotNaN(0)).not.toThrow();
            expect(() => assertNotNaN(1)).not.toThrow();
            expect(() => assertNotNaN(Infinity)).not.toThrow();
        });
    });
    describe("assertNotInfinity", () => {
        it("throws exception when value is not a number", () => {
            expect(() => assertNotInfinity(null)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotInfinity(undefined)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotInfinity("")).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotInfinity("foo")).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotInfinity(false)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotInfinity(true)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotInfinity([])).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotInfinity([ 1 ])).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotInfinity({})).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertNotInfinity({ foo: true })).toThrowWithMessage(AssertException,
                "value must be a number");
        });
        it("throws exception when value is Infinity", () => {
            expect(() => assertNotInfinity(Infinity)).toThrowWithMessage(AssertException, "value must not be Infinity");
            expect(() => assertNotInfinity(-Infinity)).toThrowWithMessage(AssertException,
                "value must not be Infinity");
        });
        it("throws exception with custom name if specified", () => {
            expect(() => assertNotInfinity(Infinity, "foo")).toThrowWithMessage(AssertException,
                "foo must not be Infinity");
        });
        it("throws no exception when value is a valid number", () => {
            expect(() => assertNotInfinity(0)).not.toThrow();
            expect(() => assertNotInfinity(1)).not.toThrow();
            expect(() => assertNotInfinity(NaN)).not.toThrow();
        });
    });
    describe("assertFiniteNumber", () => {
        it("throws exception when value is not a number", () => {
            expect(() => assertFiniteNumber(null)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertFiniteNumber(undefined)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertFiniteNumber("")).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertFiniteNumber("foo")).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertFiniteNumber(false)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertFiniteNumber(true)).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertFiniteNumber([])).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertFiniteNumber([ 1 ])).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertFiniteNumber({})).toThrowWithMessage(AssertException, "value must be a number");
            expect(() => assertFiniteNumber({ foo: true })).toThrowWithMessage(AssertException,
                "value must be a number");
        });
        it("throws exception when value is finite number", () => {
            expect(() => assertFiniteNumber(Infinity)).toThrowWithMessage(AssertException,
                "value must be a finite number");
            expect(() => assertFiniteNumber(-Infinity)).toThrowWithMessage(AssertException,
                "value must be a finite number");
            expect(() => assertFiniteNumber(NaN)).toThrowWithMessage(AssertException,
                "value must be a finite number");
        });
        it("throws exception with custom name if specified", () => {
            expect(() => assertFiniteNumber(Infinity, "foo")).toThrowWithMessage(AssertException,
                "foo must be a finite number");
        });
        it("throws no exception when value is a valid number", () => {
            expect(() => assertFiniteNumber(0)).not.toThrow();
            expect(() => assertFiniteNumber(1)).not.toThrow();
        });
    });
});
