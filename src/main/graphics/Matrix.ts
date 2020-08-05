/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Serializable } from "../lang/Serializable";
import { WritableArrayLike } from "../util/types";

type MatrixSize<Columns extends number, Rows extends number> =
    Columns extends 2 ?
        Rows extends 2 ? 4 :
        Rows extends 3 ? 6 :
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
}
