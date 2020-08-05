/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Serializable } from "../lang/Serializable";
import { WritableArrayLike } from "../util/types";
import { ReadonlyMatrixLike } from "./Matrix";

/**
 * Interface for a readonly vector like data structure.
 */
export interface ReadonlyVectorLike<Size extends number = 2 | 3 | 4> extends ArrayLike<number> {
    /** The number of vector components. */
    readonly length: Size;
}

/**
 * Interface for a writable vector like data structure.
 */
export interface VectorLike<Size extends number = 2 | 3 | 4> extends WritableArrayLike<number> {
    /** The number of vector components. */
    readonly length: Size;
}

/**
 * Interface for a readonly vector.
 */
export interface ReadonlyVector<Size extends number = 2 | 3 | 4> extends ReadonlyVectorLike<Size>, Equatable,
        Serializable<number[]> {
    /**
     * Returns the length of the vector. If you only need to compare vector lengths so the real length doesn't matter
     * then consider using the faster [[getSquareLength]] method which omits the expensive square root calculation.
     *
     * @return The vector length.
     */
    getLength(): number;

    /**
     * Returns the squared length of the vector. In some cases (Like comparing vector lengths) it is not necessary to
     * compare the real length, it is enough to compare the squared length. This is faster because it only does
     * addition and multiplication without a square root. If you need the real vector length then use the
     * [[getLength]] method instead.
     *
     * @return The squared vector length.
     */
    getSquareLength(): number;

    /**
     * Returns the distance between this vector and the specified one. If you only need to compare vector distances so
     * the real distance doesn't matter then consider using the faster [[getSquareDistance]] method which omits the
     * expensive square root calculation.
     *
     * @param v - The other vector.
     * @return The distance between this vector and the specified one.
     */
    getDistance(v: ReadonlyVectorLike<Size>): number;

    /**
     * Returns the squared distance between this vector and the specified one. In some cases (Like comparing
     * vector distances) it is not necessary to compare the real distance, it is enough to compare the squared
     * distance. This is faster because it only does addition and multiplication without a square root. If you need
     * the real vector distance then use the [[getDistance]] method instead.
     *
     * @param v - The other vector.
     * @return The squared distance between the two vectors.
     */
    getSquareDistance(v: ReadonlyVectorLike<Size>): number;

    /**
     * Returns the dot product of this vector and the specified one.
     *
     * @param v - The other vector.
     * @return The dot product.
     */
    dot(v: ReadonlyVectorLike<Size>): number;

    /** @inheritDoc  */
    toJSON(): number[];

    /**
     * Returns a human-readable string representation of the vector.
     *
     * @param maxFractionDigits - Optional number of maximum fraction digits to use in the string. Defaults to 5.
     * @return The human-readable string representation of the vector.
     */
    toString(maxFractionDigits?: number): string;
}

/**
 * Interface for a vector.
 */
export interface Vector<Size extends number = 2 | 3 | 4> extends ReadonlyVector<Size>, VectorLike<Size> {
    /**
     * Negates this vector.
     */
    negate(): this;

    /**
     * Adds the given vector or scalar to this vector.
     *
     * @param summand - The vector or scalar to add to this vector.
     */
    add(summand: ReadonlyVectorLike<Size> | number): this;

    /**
     * Subtracts the given vector or scalar from this vector.
     *
     * @param subtrahend - The vector or scalar to subtract from this vector.
     */
    sub(subtrahend: ReadonlyVectorLike<Size> | number): this;

    /**
     * Multiplies this vector with the specified matrix (In GLSL: `this = matrix * this`).
     *
     * @param matrix - The matrix to multiply this vector with.
     */
    mul(matrix: ReadonlyMatrixLike<Size, Size>): this;

    /**
     * Multiplies this vector with the transpose of the given matrix (In GLSL: `this = this * matrix`).
     *
     * @param matrix - The matrix to multiply this vector with.
     */
    transposeMul(matrix: ReadonlyMatrixLike<Size, Size>): this;

    /**
     * Multiplies this vector with the inverse of the specified matrix (In GLSL: `this = matrix / this`).
     *
     * @param matrix - The matrix to divide this vector by.
     */
    div(matrix: ReadonlyMatrixLike<Size, Size>): this;

    /**
     * Multiplies this vector with the inverted transpose of the given matrix (In GLSL: `this = this / matrix`).
     *
     * @param matrix - The matrix to multiply this vector with.
     */
    transposeDiv(matrix: ReadonlyMatrixLike<Size, Size>): this;

    /**
     * Multiplies this vector by the given vector or scalar component-wise.
     *
     * @param factor - The vector or scalar to multiply this vector by.
     */
    compMul(factor: ReadonlyVectorLike<Size> | number): this;

    /**
     * Divides this vector by the given vector or scalar component-wise.
     *
     * @param divisor - The vector or scalar to divide this vector by.
     */
    compDiv(divisor: ReadonlyVectorLike<Size> | number): this;

    /**
     * Reflects this vector at the surface described by the given normal vector.
     *
     * @param normal - The normal vector of the reflecting surface.
     */
    reflect(normal: ReadonlyVectorLike<Size>): this;

    /**
     * Refracts this vector at the surface described by the given normal vector.
     *
     * @param normal - The normal vector of the refracting surface.
     */
    refract(normal: ReadonlyVectorLike<Size>, eta: number): this;

    /**
     * Normalizes this vector to a length of 1.
     */
    normalize(): this;

    /**
     * Converts the vector components from degrees to radians.
     */
    radians(): this;

    /**
     * Converts the vector components from radians to degrees.
     */
    degrees(): this;

    /**
     * Calculates the sine for each component.
     */
    sin(): this;

    /**
     * Calculates the cosine for each component.
     */
    cos(): this;

    /**
     * Calculates the tangent for each component.
     */
    tan(): this;

    /**
     * Calculates the arc-sine for each component.
     */
    asin(): this;

    /**
     * Calculates the arc-cosine for each component.
     */
    acos(): this;

    /**
     * Calculates the arc-tangent for each component.
     */
    atan(): this;

    /**
     * Calculates the 2-argument arc-tangent for each component.
     *
     * @param v - The second argument for the arc-tangent. Either a scalar used for all vector components or
     *            a vector for individual values.
     */
    atan2(v: ReadonlyVectorLike<Size> | number): this;

    /**
     * Calculates the hyperbolic sine for each component.
     */
    sinh(): this;

    /**
     * Calculates the hyperbolic cosine for each component.
     */
    cosh(): this;

    /**
     * Calculates the hyperbolic tangent for each component.
     */
    tanh(): this;

    /**
     * Calculates the hyperbolic arc-sine for each component.
     */
    asinh(): this;

    /**
     * Calculates the hyperbolic arc-cosine for each component.
     */
    acosh(): this;

    /**
     * Calculates the hyperbolic arc-tangent for each component.
     */
    atanh(): this;

    /**
     * Calculates the vector components taken to the power of the given exponent.
     *
     * @param exponent - The exponent as a scalar or a vector for individual exponent values.
     */
    pow(exponent: ReadonlyVectorLike<Size> | number): this;

    /**
     * Calculates the constant e raised to the power of the vector components.
     */
    exp(): this;

    /**
     * Calculates the power to which the constant e has to be raised to produce the component values.
     */
    log(): this;

    /**
     * Calculates 2 raised to the power of the vector components.
     */
    exp2(): this;

    /**
     * Calculates the power to which the value 2 has to be raised to produce the component values.
     */
    log2(): this;

    /**
     * Calculates the cosine for each component.
     */
    sqrt(): this;

    /**
     * Calculates the square root for each component.
     */
    inverseSqrt(): this;

    /**
     * Converts the vector components to their absolute values.
     */
    abs(): this;

    /**
     * Converts the vector components to their sign values (-1, 0 or 1).
     */
    sign(): this;

    /**
     * Rounds all vector components down to the nearest integer.
     */
    floor(): this;

    /**
     * Replaces all vector components with their integer part by removing any fractional digits.
     */
    trunc(): this;

    /**
     * Rounds all vector components up or down to the nearest integer.
     */
    round(): this;

    /**
     * Rounds all vector components to the nearest even integer.
     */
    roundEven(): this;

    /**
     * Rounds all vector components up to the nearest integer.
     */
    ceil(): this;

    /**
     * Replaces all vector components with their fractional value.
     */
    fract(): this;

    /**
     * Calculates the modulo for each component.
     *
     * @param v - The modulo argument. Either a scalar used for all vector components or a vector for individual values.
     */
    mod(v: ReadonlyVectorLike<Size> | number): this;

    /**
     * Splits the vector components into their integer and fractional parts. The integer parts are stored in the given
     * vector. The fractional parts are written back into this vector.
     *
     * @param i - The vector to write the integer parts of this vector to.
     */
    modf(i: VectorLike<Size>): this;

    /**
     * Clamps the vector components to the given minimum.
     *
     * @param min - The minimum value to clamp to. Either a scalar used for all vector components or a vector for
     *              individual values.
     */
    min(min: ReadonlyVectorLike<Size> | number): this;

    /**
     * Clamps the vector components to the given maximum.
     *
     * @param max - The maximum value to clamp to. Either a scalar used for all vector components or a vector for
     *              individual values.
     */
    max(max: ReadonlyVectorLike<Size> | number): this;

    /**
     * Clamps the vector components to the given range.
     *
     * @param min - The minimum value to clamp to. Either a scalar used for all vector components or a vector for
     *              individual values.
     * @param max - The maximum value to clamp to. Either a scalar used for all vector components or a vector for
     *              individual values.
     */
    clamp(min: ReadonlyVectorLike<Size> | number, max: ReadonlyVectorLike<Size> | number): this;

    /**
     * Linearly interpolates the vector components. The result is stored back into this vector.
     *
     * @param v     - The target value to interpolate the components to. Either a scalar used for all vector components
     *                or a vector for individual values.
     * @param blend - Blend factor (usually between 0.0 and 1.0) used for the linear interpolation.
     */
    mix(v: ReadonlyVectorLike<Size> | number, blend: ReadonlyVectorLike<Size> | number): this;

    /**
     * Converts the component values to 0 if smaller than given edge or 1 if larger or equal.
     *
     * @param edge - The edge as a scalar used for all vector components or a vector for individual edge values.
     */
    step(edge: ReadonlyVectorLike<Size> | number): this;

    /**
     * Converts the component values to 0 if smaller than first edge, 1 if larger than second edge or to a value
     * Hermite interpolated between 0 and 1 if between the edges.
     *
     * @param edge1 - The first edge as a scalar used for all vector components or a vector for individual edge values.
     * @param edge2 - The second edge as a scalar used for all vector components or a vector for individual edge values.
     */
    smoothStep(edge1: ReadonlyVectorLike<Size> | number, edge2: ReadonlyVectorLike<Size> | number): this;
}
