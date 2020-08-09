/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import {
    clamp, degrees, fract, mix, normalizeDegrees, normalizeRadians, radians, roundEven, smoothStep, step
} from "../../main/util/math";

describe("math", () => {
    describe("fract", () => {
        it("returns the fractional part of a number", () => {
            expect(fract(100.91)).toBeCloseTo(0.91);
            expect(fract(0.123)).toBeCloseTo(0.123);
            expect(fract(-2.918)).toBeCloseTo(0.082);
            expect(fract(0)).toBeCloseTo(0);
            expect(fract(5012)).toBeCloseTo(0);
            expect(fract(-1123)).toBeCloseTo(0);
        });
    });

    describe("radians", () => {
        it("converts degrees to radians", () => {
            expect(radians(-45)).toBeCloseTo(-45 * Math.PI / 180);
            expect(radians(73.19)).toBeCloseTo(73.19 * Math.PI / 180);
        });
    });

    describe("sanitizeRadians", () => {
        it("sanitizes angle in radians", () => {
            expect(normalizeRadians(0)).toBeCloseTo(0);
            expect(normalizeRadians(Math.PI * 2)).toBeCloseTo(0);
            expect(normalizeRadians(Math.PI * 2 - 0.01)).toBeCloseTo(Math.PI * 2 - 0.01);
            expect(normalizeRadians(-0.05)).toBeCloseTo(Math.PI * 2 - 0.05);
            expect(normalizeRadians(-Math.PI * 2 - 0.05)).toBeCloseTo(Math.PI * 2 - 0.05);
            expect(normalizeRadians(radians(780.05))).toBeCloseTo(radians(60.05));
        });
    });

    describe("sanitizeDegrees", () => {
        it("sanitizes angle in degrees", () => {
            expect(normalizeDegrees(0)).toBeCloseTo(0);
            expect(normalizeDegrees(360)).toBeCloseTo(0);
            expect(normalizeDegrees(359.99)).toBeCloseTo(359.99);
            expect(normalizeDegrees(-0.05)).toBeCloseTo(359.95);
            expect(normalizeDegrees(-360.05)).toBeCloseTo(359.95);
            expect(normalizeDegrees(780.05)).toBeCloseTo(60.05);
        });
    });

    describe("degrees", () => {
        it("converts radians to degrees", () => {
            expect(degrees(-45 * Math.PI / 180)).toBeCloseTo(-45);
            expect(degrees(73.19 * Math.PI / 180)).toBeCloseTo(73.19);
        });
    });

    describe("clamp", () => {
        it("clamps a value to the given range", () => {
            expect(clamp(-3, -1, 2)).toBeCloseTo(-1);
            expect(clamp(3, 1, 2)).toBeCloseTo(2);
            expect(clamp(1, -10, 10)).toBeCloseTo(1);
        });
    });

    describe("mix", () => {
        it("linearly interpolates between two values", () => {
            expect(mix(-123.45, 51.23, 0.3)).toBeCloseTo(-71.046);
        });
    });

    describe("step", () => {
        it("returns 0 if value is smaller then edge, 1 otherwise", () => {
            expect(step(0.3, 0)).toBeCloseTo(0);
            expect(step(0.3, 0.29)).toBeCloseTo(0);
            expect(step(0.3, 0.3)).toBeCloseTo(1);
            expect(step(0.3, 123)).toBeCloseTo(1);
        });
    });

    describe("smoothStep", () => {
        it("returns 0 if value is smaller than first edge and 1 if larger than second edge. Interpolate otherwise",
                () => {
            expect(smoothStep(-1.31, 10.98, 5.91)).toBeCloseTo(0.629866);
            expect(smoothStep(-1.31, 10.98, 20.0)).toBeCloseTo(1);
            expect(smoothStep(-1.31, 10.98, -40.0)).toBeCloseTo(0);
        });
    });

    describe("roundEven", () => {
        it("rounds the given value to the nearest integer", () => {
            expect(roundEven(12.34)).toBeCloseTo(12);
            expect(roundEven(1.5)).toBeCloseTo(2);
            expect(roundEven(2.5)).toBeCloseTo(2);
            expect(roundEven(-1.5)).toBeCloseTo(-2);
            expect(roundEven(-2.5)).toBeCloseTo(-2);
            expect(roundEven(13.11)).toBeCloseTo(13);
            expect(roundEven(69.79)).toBeCloseTo(70);
            expect(roundEven(-30.30)).toBeCloseTo(-30);
            expect(roundEven(-1.98)).toBeCloseTo(-2);
        });
    });
});
