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

    /**
     * Serializes the object to the given JSON object.
     *
     * @param fractionDigits - Optional number of maximum fraction digits to round the vector components to. By default
     *                         the values are not rounded.
     * @return The serialized JSON object.
     */
    toJSON(fractionDigits?: number): number[];

    /**
     * Checks if the given vector is equal to this one. By default the component values are checked for exact matches.
     * Use the optional `fractionDigits` parameter to specify the compare precision.
     *
     * @param object         - The object to check for equality.
     * @param fractionDigits - Optional parameter specifying the number of fraction digits to compare for the
     *                         equality check.
     * @return True if object is equal, false if not.
     */
    equals(obj: unknown, fractionDigits?: number): boolean;

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
    negate<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Adds the given vector or scalar to this vector.
     *
     * @param summand - The vector or scalar to add to this vector.
     */
    add<T extends VectorLike<Size>>(summand: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Subtracts the given vector or scalar from this vector.
     *
     * @param subtrahend - The vector or scalar to subtract from this vector.
     */
    sub<T extends VectorLike<Size>>(subtrahend: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Multiplies this vector with the specified matrix (In GLSL: `result = matrix * this`).
     *
     * @param matrix - The matrix to multiply this vector with.
     */
    mul<T extends VectorLike<Size>>(matrix: ReadonlyMatrixLike<Size, Size>, result?: T): T;

    /**
     * Multiplies this vector with the transpose of the given matrix (In GLSL: `result = this * matrix`).
     *
     * @param matrix - The matrix to multiply this vector with.
     */
    transposeMul<T extends VectorLike<Size>>(matrix: ReadonlyMatrixLike<Size, Size>, result?: T): T;

    /**
     * Multiplies this vector with the inverse of the specified matrix (In GLSL: `result = matrix / this`).
     *
     * @param matrix - The matrix to divide this vector by.
     */
    div<T extends VectorLike<Size>>(matrix: ReadonlyMatrixLike<Size, Size>, result?: T): T;

    /**
     * Multiplies this vector with the inverted transpose of the given matrix (In GLSL: `result = this / matrix`).
     *
     * @param matrix - The matrix to multiply this vector with.
     */
    transposeDiv<T extends VectorLike<Size>>(matrix: ReadonlyMatrixLike<Size, Size>, result?: T): T;

    /**
     * Multiplies this vector by the given vector or scalar component-wise.
     *
     * @param factor - The vector or scalar to multiply this vector by.
     */
    compMul<T extends VectorLike<Size>>(factor: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Divides this vector by the given vector or scalar component-wise.
     *
     * @param divisor - The vector or scalar to divide this vector by.
     */
    compDiv<T extends VectorLike<Size>>(divisor: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Reflects this vector at the surface described by the given normal vector.
     *
     * @param normal - The normal vector of the reflecting surface.
     */
    reflect<T extends VectorLike<Size>>(normal: ReadonlyVectorLike<Size>, result?: T): T;

    /**
     * Refracts this vector at the surface described by the given normal vector.
     *
     * @param normal - The normal vector of the refracting surface.
     */
    refract<T extends VectorLike<Size>>(normal: ReadonlyVectorLike<Size>, eta: number, result?: T): T;

    /**
     * Normalizes this vector to a length of 1.
     */
    normalize<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Converts the vector components from degrees to radians.
     */
    radians<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Converts the vector components from radians to degrees.
     */
    degrees<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the sine for each component.
     */
    sin<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the cosine for each component.
     */
    cos<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the tangent for each component.
     */
    tan<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the arc-sine for each component.
     */
    asin<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the arc-cosine for each component.
     */
    acos<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the arc-tangent for each component.
     */
    atan<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the 2-argument arc-tangent for each component.
     *
     * @param v - The second argument for the arc-tangent. Either a scalar used for all vector components or
     *            a vector for individual values.
     */
    atan2<T extends VectorLike<Size>>(v: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Calculates the hyperbolic sine for each component.
     */
    sinh<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the hyperbolic cosine for each component.
     */
    cosh<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the hyperbolic tangent for each component.
     */
    tanh<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the hyperbolic arc-sine for each component.
     */
    asinh<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the hyperbolic arc-cosine for each component.
     */
    acosh<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the hyperbolic arc-tangent for each component.
     */
    atanh<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the vector components taken to the power of the given exponent.
     *
     * @param exponent - The exponent as a scalar or a vector for individual exponent values.
     */
    pow<T extends VectorLike<Size>>(exponent: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Calculates the constant e raised to the power of the vector components.
     */
    exp<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the power to which the constant e has to be raised to produce the component values.
     */
    log<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates 2 raised to the power of the vector components.
     */
    exp2<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the power to which the value 2 has to be raised to produce the component values.
     */
    log2<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the cosine for each component.
     */
    sqrt<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the square root for each component.
     */
    inverseSqrt<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Converts the vector components to their absolute values.
     */
    abs<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Converts the vector components to their sign values (-1, 0 or 1).
     */
    sign<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Rounds all vector components down to the nearest integer.
     */
    floor<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Replaces all vector components with their integer part by removing any fractional digits.
     */
    trunc<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Rounds all vector components up or down to the nearest integer.
     */
    round<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Rounds all vector components to the nearest even integer.
     */
    roundEven<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Rounds all vector components up to the nearest integer.
     */
    ceil<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Replaces all vector components with their fractional value.
     */
    fract<T extends VectorLike<Size>>(result?: T): T;

    /**
     * Calculates the modulo for each component.
     *
     * @param v - The modulo argument. Either a scalar used for all vector components or a vector for individual values.
     */
    mod<T extends VectorLike<Size>>(v: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Splits the vector components into their integer and fractional parts. The integer parts are stored in the given
     * vector. The fractional parts are written back into this vector.
     *
     * @param i - The vector to write the integer parts of this vector to.
     */
    modf<T extends VectorLike<Size>>(i: VectorLike<Size>, result?: T): T;

    /**
     * Clamps the vector components to the given minimum.
     *
     * @param min - The minimum value to clamp to. Either a scalar used for all vector components or a vector for
     *              individual values.
     */
    min<T extends VectorLike<Size>>(min: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Clamps the vector components to the given maximum.
     *
     * @param max - The maximum value to clamp to. Either a scalar used for all vector components or a vector for
     *              individual values.
     */
    max<T extends VectorLike<Size>>(max: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Clamps the vector components to the given range.
     *
     * @param min - The minimum value to clamp to. Either a scalar used for all vector components or a vector for
     *              individual values.
     * @param max - The maximum value to clamp to. Either a scalar used for all vector components or a vector for
     *              individual values.
     */
    clamp<T extends VectorLike<Size>>(min: ReadonlyVectorLike<Size> | number,
        max: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Linearly interpolates the vector components. The result is stored back into this vector.
     *
     * @param v     - The target value to interpolate the components to. Either a scalar used for all vector components
     *                or a vector for individual values.
     * @param blend - Blend factor (usually between 0.0 and 1.0) used for the linear interpolation.
     */
    mix<T extends VectorLike<Size>>(v: ReadonlyVectorLike<Size> | number,
        blend: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Converts the component values to 0 if smaller than given edge or 1 if larger or equal.
     *
     * @param edge - The edge as a scalar used for all vector components or a vector for individual edge values.
     */
    step<T extends VectorLike<Size>>(edge: ReadonlyVectorLike<Size> | number, result?: T): T;

    /**
     * Converts the component values to 0 if smaller than first edge, 1 if larger than second edge or to a value
     * Hermite interpolated between 0 and 1 if between the edges.
     *
     * @param edge1 - The first edge as a scalar used for all vector components or a vector for individual edge values.
     * @param edge2 - The second edge as a scalar used for all vector components or a vector for individual edge values.
     */
    smoothStep<T extends VectorLike<Size>>(edge1: ReadonlyVectorLike<Size> | number,
        edge2: ReadonlyVectorLike<Size> | number, result?: T): T;
}
