/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isMatrixLike, Matrix, MatrixLike, ReadonlyMatrix, ReadonlyMatrixLike } from "./Matrix";

/**
 * Interface for a readonly square matrix like data structure.
 */
export type ReadonlySquareMatrixLike<Dimensions extends number = 2 | 3 | 4> =
    ReadonlyMatrixLike<Dimensions, Dimensions>;

/**
 * Interface for a writeable square matrix like data structure.
 */
export type SquareMatrixLike<Dimensions extends number = 2 | 3 | 4> = MatrixLike<Dimensions, Dimensions>;

/**
 * Checks if given object is a square matrix like structure.
 *
 * @param obj - The object to check.
 * @return True if given object is a square matrix like structure.
 */
export function isSquareMatrixLike(obj: unknown): obj is SquareMatrixLike {
    return isMatrixLike(obj) && obj.columns === obj.rows;
}

/**
 * Interface for a readonly square matrix.
 */
export interface ReadonlySquareMatrix<Dimensions extends number = 2 | 3 | 4>
        extends ReadonlyMatrix<Dimensions, Dimensions> {
    /**
     * Returns the determinant of this matrix.
     *
     * @return The determinant of this matrix.
     */
    getDeterminant(): number;
}

/**
 * Interface for a square matrix.
 */
export interface SquareMatrix<Dimensions extends number = 2 | 3 | 4> extends Matrix<Dimensions, Dimensions>,
        ReadonlyMatrix<Dimensions, Dimensions>, MatrixLike<Dimensions, Dimensions> {
    /**
     * Multiplies this matrix with the specified matrix (`this = this * other`).
     *
     * @param other - The other matrix to multiply this one with.
     */
    mul(other: ReadonlySquareMatrixLike<Dimensions>): this;

    /**
     * Divides this matrix by the specified matrix (`this = this / other` which is the same as
     * `this = this * inverse(other)`).
     *
     * @param other - The other matrix to divide this one by.
     */
    div(other: ReadonlySquareMatrixLike<Dimensions>): this;

    /**
     * Inverts this matrix.
     */
    invert(): this;

    /**
     * Transposes this matrix.
     */
    transpose(): this;

    /**
     * Converts this matrix into the "adjoint matrix".
     */
    adjugate(): this;
}
