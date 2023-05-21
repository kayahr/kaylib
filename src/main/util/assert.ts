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
 * @param message   - Optional exception message when assertion fails.
 */
export function assert(condition: boolean, message = "Assertion failed"): asserts condition {
    if (!condition) {
        throw new AssertException(message);
    }
}

/**
 * Asserts that the given value is not null and not undefined.
 *
 * @param value - The value to check.
 */
export function assertDefined<T>(value: T): asserts value is NonNullable<T> {
    return assert(value != null, "Must be defined");
}

/**
 * Asserts that the given value is not null.
 *
 * @param value - The value to check.
 */
export function assertNotNull<T>(value: T): asserts value is Exclude<T, null> {
    assert(value !== null, "Must not be null");
}

/**
 * Asserts that the given value is not undefined.
 *
 * @param value - The value to check.
 */
export function assertNotUndefined<T>(value: T): asserts value is Exclude<T, undefined> {
    assert(value !== undefined, "Must not be undefined");
}

/**
 * Asserts that the given value is a string.
 *
 * @param value - The value to check.
 */
export function assertString(value: unknown): asserts value is string {
    assert(typeof value === "string", "Must be a string");
}

/**
 * Asserts that the given value is a number.
 *
 * @param value - The value to check.
 */
export function assertNumber(value: unknown): asserts value is number {
    assert(typeof value === "number", "Must be a number");
}

/**
 * Asserts that the given value is a number and not NaN.
 *
 * @param value - The value to check.
 */
export function assertNotNaN(value: unknown): asserts value is number {
    assertNumber(value);
    assert(!Number.isNaN(value), "Must not be NaN");
}

/**
 * Asserts that the given value is a number and not Infinity.
 *
 * @param value - The value to check.
 */
export function assertNotInfinity(value: unknown): asserts value is number {
    assertNumber(value);
    assert(value !== Infinity && value !== -Infinity, "Must not be Infinity");
}

/**
 * Asserts that the given value is a finite number (Not NaN and not Infinity).
 *
 * @param value - The value to check.
 */
export function assertFiniteNumber(value: unknown): asserts value is number {
    assertNumber(value);
    assert(Number.isFinite(value), "Must be a finite number");
}
