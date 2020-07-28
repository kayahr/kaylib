/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/** Factor to convert radians to degrees. */
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Computes the fractional part of the given value.
 *
 * @param value - The value to evaluate.
 * @return The fractional part of the given value.
 */
export function fract(value: number): number {
    return value - Math.floor(value);
}

/**
 * Converts degrees to radians.
 *
 * @param degrees - The value in degrees to convert to radians.
 * @return The given value converted to radians.
 */
export function radians(degrees: number): number {
    return degrees / RAD_TO_DEG;
}

/**
 * Converts radians to degrees.
 *
 * @param radians - The value in radians to convert to degrees.
 * @return The given value converted to degrees.
 */
export function degrees(radians: number): number {
    return radians * RAD_TO_DEG;
}

/**
 * Sanitizes an angle in radians so it is between 0 (inclusive) and 2*PI (exclusive).
 *
 * @param degrees - The angle to sanitize.
 * @return The sanitized angle.
 */
export function sanitizeRadians(angle: number): number {
    const pi2 = Math.PI * 2;
    return ((angle % pi2) + pi2) % pi2;
}

/**
 * Sanitizes an angle in degrees so it is between 0 (inclusive) and 360 (exclusive).
 *
 * @param degrees - The angle to sanitize.
 * @return The sanitized angle.
 */
export function sanitizeDegrees(degrees: number): number {
    return ((degrees % 360) + 360) % 360;
}

/**
 * Clamps a value to the given range.
 *
 * @param value - The value to clamp.
 * @param min   - The minimum value.
 * @param max   - The maximum value.
 * @return The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(Math.min(max, value), min);
}

/**
 * Linearly interpolates between two values.
 *
 * @param value1        - The first value to interpolate between.
 * @param value2        - The second value to interpolate between.
 * @param interpolation - The value (usually between 0.0 and 1.0) used for the linear interpolation.
 * @return The interpolated value.
 */
export function mix(value1: number, value2: number, interpolation: number): number {
    return value1 * (1 - interpolation) + value2 * interpolation;
}

/**
 * Returns 0 if value is smaller then edge, 1 otherwise.
 *
 * @param edge  - The edge.
 * @param value - The value to evaluate.
 * @return 0 if value is smaller than edge, 1 if larger or equal.
 */
export function step(edge: number, value: number): number {
    return value < edge ? 0 : 1;
}

/**
 * Returns 0 if value is smaller than first edge and 1 if larger than second edge. Otherwise the return value
 * is Hermite interpolated between 0 and 1.
 *
 * @param edge1 - The first edge.
 * @param edge2 - The second edge.
 * @param value - The source value for interpolation.
 * @return The interpolated value.
 */
export function smoothStep(edge1: number, edge2: number, value: number): number {
    if (value <= edge1) {
        return 0;
    }
    if (value >= edge2) {
        return 1;
    }
    const x = (value - edge1) / (edge2 - edge1);
    return (3 - 2 * x) * x * x;
}

/**
 * Rounds the given value to the nearest integer. Fractional part of 0.5 is rounded to next even integer. So
 * 0.5 is rounded down to 0 and 1.5 is rounded up to 2 and so on.
 *
 * @param value - The value to round.
 * @return The rounded value.
 */
export function roundEven(value: number): number {
    const integerPart = value | 0;
    const fractionalPart = value - Math.floor(value);
    if (fractionalPart < 0.5 || fractionalPart > 0.5) {
        return Math.round(value);
    } else if (integerPart % 2 === 0) {
        return integerPart;
    } else if (value <= 0) {
        return integerPart - 1;
    } else {
        return integerPart + 1;
    }
}
