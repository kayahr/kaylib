/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Exception } from "./exception";

/**
 * Thrown when an assertion fails.
 */
export class AssertException extends Exception {}

/**
 * Asserts that the given condition is true.
 *
 * @param condition - The condition to check.
 * @param message   - Optional message or function returning this message for the thrown exception when assert fails.
 */
export function assert(condition: boolean, message: string | (() => string) = "Assertion failed"): asserts condition {
    if (!condition) {
        throw new AssertException(typeof message === "string" ? message : message());
    }
}

/**
 * Asserts that the given value is not null and not undefined.
 *
 * @param value - The value to check.
 * @param name  - Optional property name used in the assert exception message. Defaults to `value`.
 */
export function assertDefined<T>(value: T, name = "value"): asserts value is NonNullable<T> {
    return assert(value != null, () => `${name} must be defined`);
}

/**
 * Asserts that the given value is not null.
 *
 * @param value - The value to check.
 * @param name  - Optional property name used in the assert exception message. Defaults to `value`.
 */
export function assertNotNull<T>(value: T, name = "value"): asserts value is Exclude<T, null> {
    assert(value !== null, () => `${name} must not be null`);
}

/**
 * Asserts that the given value is not undefined.
 *
 * @param value - The value to check.
 * @param name  - Optional property name used in the assert exception message. Defaults to `value`.
 */
export function assertNotUndefined<T>(value: T, name = "value"): asserts value is Exclude<T, undefined> {
    assert(value !== undefined, () => `${name} must not be undefined`);
}

/**
 * Asserts that the given value is a string.
 *
 * @param value - The value to check.
 * @param name  - Optional property name used in the assert exception message. Defaults to `value`.
 */
export function assertString(value: unknown, name = "value"): asserts value is string {
    assert(typeof value === "string", () => `${name} must be a string`);
}

/**
 * Asserts that the given value is a number (including NaN and Infinity).
 *
 * @param value - The value to check.
 * @param name  - Optional property name used in the assert exception message. Defaults to `value`.
 */
export function assertNumber(value: unknown, name = "value"): asserts value is number {
    assert(typeof value === "number", () => `${name} must be a number`);
}

/**
 * Asserts that the given value is a number (including Infinity) and not NaN.
 *
 * @param value - The value to check.
 * @param name  - Optional property name used in the assert exception message. Defaults to `value`.
 */
export function assertNotNaN(value: unknown, name = "value"): asserts value is number {
    assertNumber(value);
    assert(!Number.isNaN(value), () => `${name} must not be NaN`);
}

/**
 * Asserts that the given value is a number (including NaN) and not Infinity.
 *
 * @param value - The value to check.
 * @param name  - Optional property name used in the assert exception message. Defaults to `value`.
 */
export function assertNotInfinity(value: unknown, name = "value"): asserts value is number {
    assertNumber(value);
    assert(value !== Infinity && value !== -Infinity, () => `${name} must not be Infinity`);
}

/**
 * Asserts that the given value is a finite number (Not NaN and not Infinity).
 *
 * @param value - The value to check.
 * @param name  - Optional property name used in the assert exception message. Defaults to `value`.
 */
export function assertFiniteNumber(value: unknown, name = "value"): asserts value is number {
    assertNumber(value);
    assert(Number.isFinite(value), () => `${name} must be a finite number`);
}
