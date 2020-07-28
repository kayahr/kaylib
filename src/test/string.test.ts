/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import { IllegalArgumentException } from "../main/exception";
import {
    capitalize, extractWords, formatNumber, toLowerCamelCase, toLowerDashCase, toLowerSnakeCase, toUpperCamelCase,
    toUpperDashCase, toUpperSnakeCase
} from "../main/string";

describe("string", () => {
    describe("extractWords", () => {
        it("extracts words from a string", () => {
            expect(extractWords("Foo  Bar-Baz__test__HelloWorld")).toEqual([
                "Foo", "Bar", "Baz", "test", "Hello", "World"
            ]);
        });
    });

    describe("capitalize", () => {
        it("capitalizes a string", () => {
            expect(capitalize("")).toBe("");
            expect(capitalize("a")).toBe("A");
            expect(capitalize("test")).toBe("Test");
            expect(capitalize("TEst")).toBe("Test");
            expect(capitalize("tEST")).toBe("Test");
        });
    });

    describe("toUpperSnakeCase", () => {
        it("converts a string to upper snake case", () => {
            expect(toUpperSnakeCase("foo Bar  baz")).toBe("FOO_BAR_BAZ");
            expect(toUpperSnakeCase("foo-BAR--baz")).toBe("FOO_BAR_BAZ");
            expect(toUpperSnakeCase("foo_bar__baz")).toBe("FOO_BAR_BAZ");
            expect(toUpperSnakeCase("Foobar23")).toBe("FOOBAR23");
            expect(toUpperSnakeCase("FooBarBaz")).toBe("FOO_BAR_BAZ");
        });
    });

    describe("toLowerSnakeCase", () => {
        it("converts a string to lower snake case", () => {
            expect(toLowerSnakeCase("foo Bar  baz")).toBe("foo_bar_baz");
            expect(toLowerSnakeCase("foo-BAR--baz")).toBe("foo_bar_baz");
            expect(toLowerSnakeCase("foo_bar__baz")).toBe("foo_bar_baz");
            expect(toLowerSnakeCase("Foobar23")).toBe("foobar23");
            expect(toLowerSnakeCase("FooBarBaz")).toBe("foo_bar_baz");
        });
    });

    describe("toUpperDashCase", () => {
        it("converts a string to upper dash case", () => {
            expect(toUpperDashCase("foo Bar  baz")).toBe("FOO-BAR-BAZ");
            expect(toUpperDashCase("foo-BAR--baz")).toBe("FOO-BAR-BAZ");
            expect(toUpperDashCase("foo_bar__baz")).toBe("FOO-BAR-BAZ");
            expect(toUpperDashCase("Foobar23")).toBe("FOOBAR23");
            expect(toUpperDashCase("FooBarBaz")).toBe("FOO-BAR-BAZ");
        });
    });

    describe("toLowerDashCase", () => {
        it("converts a string to lower dash case", () => {
            expect(toLowerDashCase("foo Bar  baz")).toBe("foo-bar-baz");
            expect(toLowerDashCase("foo-BAR--baz")).toBe("foo-bar-baz");
            expect(toLowerDashCase("foo_bar__baz")).toBe("foo-bar-baz");
            expect(toLowerDashCase("Foobar23")).toBe("foobar23");
            expect(toLowerDashCase("FooBarBaz")).toBe("foo-bar-baz");
        });
    });

    describe("toLowerCamelCase", () => {
        it("converts a string to camel case", () => {
            expect(toLowerCamelCase("foo Bar  baz")).toBe("fooBarBaz");
            expect(toLowerCamelCase("foo-BAR--baz")).toBe("fooBarBaz");
            expect(toLowerCamelCase("foo_bar__baz")).toBe("fooBarBaz");
            expect(toLowerCamelCase("Foobar23")).toBe("foobar23");
            expect(toLowerCamelCase("FooBarBaz")).toBe("fooBarBaz");
        });
    });

    describe("toUpperCamelCase", () => {
        it("converts a string to camel case", () => {
            expect(toUpperCamelCase("foo Bar  baz")).toBe("FooBarBaz");
            expect(toUpperCamelCase("foo-BAR--baz")).toBe("FooBarBaz");
            expect(toUpperCamelCase("foo_bar__baz")).toBe("FooBarBaz");
            expect(toUpperCamelCase("Foobar23")).toBe("Foobar23");
            expect(toUpperCamelCase("FooBarBaz")).toBe("FooBarBaz");
        });
    });

    describe("formatNumber", () => {
        it("throws exception when number is NaN", () => {
            expect(() => formatNumber(NaN)).toThrowWithMessage(IllegalArgumentException,
                "Unable to convert NaN to string");
        });
        it("throws exception when number is infinite", () => {
            expect(() => formatNumber(Infinity)).toThrowWithMessage(IllegalArgumentException,
                "Unable convert infinite value to string");
            expect(() => formatNumber(-Infinity)).toThrowWithMessage(IllegalArgumentException,
                "Unable convert infinite value to string");
        });
        it("formats numbers with default settings", () => {
            expect(formatNumber(0)).toBe("0");
            expect(formatNumber(-1)).toBe("-1");
            expect(formatNumber(0.0000001)).toBe("0");
            expect(formatNumber(0.000001)).toBe("0.000001");
            expect(formatNumber(0.23456789)).toBe("0.234568");
            expect(formatNumber(1.6e23)).toBe("160000000000000000000000");
            expect(formatNumber(Number.MAX_VALUE).length).toBe(309);
            expect(formatNumber(Number.MAX_SAFE_INTEGER)).toBe("9007199254740991");
            expect(formatNumber(Number.MIN_SAFE_INTEGER)).toBe("-9007199254740991");
        });
        it("formats numbers with custom settings", () => {
            expect(formatNumber(123456.123456, { locales: "de", maximumFractionDigits: 3, useGrouping: true }))
                .toBe("123.456,123");
        });
    });
});
