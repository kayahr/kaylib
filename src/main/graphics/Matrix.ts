/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Serializable } from "../lang/Serializable";
import { WritableArrayLike } from "../util/types";

type MatrixSize<Columns extends number, Rows extends number> =
    Columns extends 2 ?
        Rows extends 2 ? 4 :
        never :
    Columns extends 3 ?
        Rows extends 3 ? 9 :
        Rows extends 2 ? 6 :
        never :
    Columns extends 4 ?
        Rows extends 4 ? 16 :
        never :
    never;

/**
 * Interface for a readonly matrix like data structure.
 */
export interface ReadonlyMatrixLike<
            Columns extends number = 2 | 3 | 4,
            Rows extends number = 2 | 3 | 4
        > extends ArrayLike<number> {
    /** The number of matrix elements. */
    readonly length: MatrixSize<Columns, Rows>;

    /** The number of columns. */
    readonly columns: Columns;

    /** The number of rows. */
    readonly rows: Rows;
}

/**
 * Interface for a writable matrix like data structure.
 */
export interface MatrixLike<
            Columns extends number = 2 | 3 | 4,
            Rows extends number = 2 | 3 | 4
        > extends WritableArrayLike<number> {
    /** The number of vector components. */
    readonly length: MatrixSize<Columns, Rows>;

    /** The number of columns. */
    readonly columns: Columns;

    /** The number of rows. */
    readonly rows: Rows;
}

/**
 * Checks if given object is a matrix-like structure.
 *
 * @param obj - The object to check.
 * @return True if given object is a matrix-like structure.
 */
export function isMatrixLike(obj: unknown): obj is MatrixLike {
    return obj != null && typeof (obj as MatrixLike).length === "number"
        && typeof (obj as MatrixLike).rows === "number" && typeof (obj as MatrixLike).columns === "number";
}

/**
 * Interface for a readonly matrix.
 */
export interface ReadonlyMatrix<
            Columns extends number = 2 | 3 | 4,
            Rows extends number = 2 | 3 | 4
        > extends ReadonlyMatrixLike<Columns, Rows>, Equatable, Serializable<number[]> {
    /**
     * Checks if the given matrix is equal to this one. By default the values are checked for exact matches. Use
     * the optional `fractionDigits` parameter to specify the compare precision.
     *
     * @param object         - The object to check for equality.
     * @param fractionDigits - Optional parameter specifying the number of fraction digits to compare for the
     *                         equality check.
     * @return True if object is equal, false if not.
     */
    equals(obj: unknown, fractionDigits?: number): boolean;

    /**
     * Checks if matrix is identity.
     *
     * @return True if identity, false if not.
     */
    isIdentity(): boolean;
}

/**
 * Interface for a matrix.
 */
export interface Matrix<
            Columns extends number = 2 | 3 | 4,
            Rows extends number = 2 | 3 | 4,
        > extends ReadonlyMatrix<Columns, Rows>, MatrixLike<Columns, Rows> {
    /**
     * Resets this matrix to identity.
     */
    reset(): this;

    /**
     * Adds the given value to each matrix component.
     *
     * @param summand - The value to add to each matrix component.
     */
    add<T extends Matrix<Columns, Rows>>(summand: number, result?: T): T;

    /**
     * Adds the given matrix to this one component-wise.
     *
     * @param matrix - The matrix to add.
     */
    add<T extends Matrix<Columns, Rows>>(matrix: ReadonlyMatrixLike<Columns, Rows>, result?: T): T;

    /**
     * Subtracts the given value from each matrix component.
     *
     * @param subtrahend - The value to subtract from each matrix component.
     */
    sub<T extends Matrix<Columns, Rows>>(subtrahend: number, result?: T): T;

    /**
     * Subtracts the given matrix from this one component-wise.
     *
     * @param matrix - The matrix to subtract.
     */
    sub<T extends Matrix<Columns, Rows>>(matrix: ReadonlyMatrixLike<Columns, Rows>, result?: T): T;

    /**
     * Multiplies this matrix with the specified matrix component-wise.
     *
     * @param matrix - The other matrix to multiply this one with.
     */
    compMul<T extends Matrix<Columns, Rows>>(matrix: ReadonlyMatrixLike<Columns, Rows>, result?: T): T;

    /**
     * Multiplies all components of this matrix with the given factor.
     *
     * @param factor - The factor to multiply each component with.
     */
    compMul<T extends Matrix<Columns, Rows>>(factor: number, result?: T): T;

    /**
     * Divides this matrix by the specified matrix component-wise.
     *
     * @param matrix - The other matrix to divide this one by.
     */
    compDiv<T extends Matrix<Columns, Rows>>(matrix: ReadonlyMatrixLike<Columns, Rows>, result: T): T;

    /**
     * Divides all components of this matrix by the given factor.
     *
     * @param divisor - The divisor to divide each component by.
     */
    compDiv<T extends Matrix<Columns, Rows>>(divisor: number, result?: T): T;

    /**
     * Multiplies this matrix with the specified matrix (`result = this * other`).
     *
     * TODO Currently only implemented for uniform matrices
     *
     * @param other - The other matrix to multiply this one with.
     */
    mul<T extends Matrix<Columns & Rows, Columns & Rows>>(other: ReadonlyMatrixLike<Columns & Rows, Columns & Rows>,
        result?: T): T;

    /**
     * Divides this matrix by the specified matrix (`result = this / matrix` which is the same as
     * `result = this * inverse(matrix)`).
     *
     * TODO Currently only implemented for uniform matrices
     *
     * @param other - The other matrix to divide this one by.
     */
    div<T extends Matrix<Columns & Rows, Columns & Rows>>(other: ReadonlyMatrixLike<Columns & Rows, Columns & Rows>,
        result?: T): T;

    /**
     * Returns the determinant of this matrix.
     *
     * @return The determinant of this matrix.
     */
    getDeterminant(): number;

    /**
     * Inverts this matrix.
     */
    invert<T extends Matrix<Columns, Rows>>(result?: T): T;

    /**
     * Transposes this matrix.
     */
    transpose<T extends Matrix<Rows, Columns>>(result?: T): T;

    /**
     * Converts this matrix into the "adjoint matrix".
     */
    adjugate<T extends Matrix<Rows & Columns, Columns & Rows>>(result?: T): T;
}
