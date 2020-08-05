/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { AbstractMatrix } from "./AbstractMatrix";
import { Matrix, ReadonlyMatrixLike } from "./Matrix";
import { ReadonlyVectorLike } from "./Vector";

/**
 * JSON representation of a 3x2 matrix.
 */
export type Matrix2x3JSON = [
    number, number, number,
    number, number, number,
];

/**
 * 2x3 matrix using 32 bit floating point components.
 */
export class Matrix2x3 extends AbstractMatrix<6> implements Matrix<2, 3>, Serializable<Matrix2x3JSON>,
        Cloneable<Matrix2x3> {
    /** The number of columns. */
    public readonly columns: 2;

    /** The number of rows. */
    public readonly rows: 3;

    /**
     * Creates a matrix initialized to an identity matrix.
     */
    public constructor();

    /**
     * Creates a new matrix initialized to the given matrix. If given matrix has smaller dimensions then the missing
     * columns/rows are filled from an identity matrix.
     *
     * @param matrix - The matrix to copy the components from.
     */
    public constructor(matrix: ReadonlyMatrixLike);

    /**
     * Creates a new matrix initialized to the given component values.
     *
     * @param components - The component values.
     */
    public constructor(...components: Matrix2x3JSON);

    /**
     * Creates a new matrix with the component values copied from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public constructor(...columns: [ ReadonlyVectorLike<3>, ReadonlyVectorLike<3> ]);

    /**
     * Creates a new matrix using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: ArrayBuffer | SharedArrayBuffer, offset?: number);

    public constructor(...args: Array<number | ReadonlyVectorLike> | [ ReadonlyMatrixLike ] | [ ArrayBuffer
            | SharedArrayBuffer, number? ]) {
        if (args.length === 0) {
            super(6);
            this[0] = this[4] = 1;
        } else if (AbstractMatrix.isInitFromMatrix(args)) {
            super(6);
            const arg = args[0];
            const argRows = arg.rows;
            const argColumns = arg.columns;
            const columns = Math.min(2, argColumns);
            const rows = Math.min(3, argRows);
            for (let y = 0; y < rows; ++y) {
                for (let x = 0; x < columns; ++x) {
                    this[y + x * rows] = arg[y + x * argRows];
                }
            }
        } else if (AbstractMatrix.isInitFromArrayBuffer(args)) {
            super(args[0], args[1] ?? 0, 6);
        } else {
            super(6);
            this.setValues(args);
        }
        this.columns = 2;
        this.rows = 3;
    }

    /** Matrix component at row 1 column 1. */
    public get m11(): number {
        return this[0];
    }
    public set m11(v: number) {
        this[0] = v;
    }

    /** Matrix component at row 2 column 1. */
    public get m12(): number {
        return this[1];
    }
    public set m12(v: number) {
        this[1] = v;
    }

    /** Matrix component at row 3 column 1. */
    public get m13(): number {
        return this[2];
    }
    public set m13(v: number) {
        this[2] = v;
    }

    /** Matrix component at row 1 column 2. */
    public get m21(): number {
        return this[3];
    }
    public set m21(v: number) {
        this[3] = v;
    }

    /** Matrix component at row 2 column 2. */
    public get m22(): number {
        return this[4];
    }
    public set m22(v: number) {
        this[4] = v;
    }

    /** Matrix component at row 3 column 2. */
    public get m23(): number {
        return this[5];
    }
    public set m23(v: number) {
        this[5] = v;
    }

    /**
     * Sets the matrix component values.
     *
     * @param components - The component values to set.
     */
    public set(...components: Matrix2x3JSON): this;

    /**
     * Sets the matrix component values from another matrix. If given matrix has smaller dimensions then the missing
     * columns/rows are filled from an identity matrix.
     *
     * @param matrix - The matrix to copy the component values from.
     */
    public set(matrix: ReadonlyMatrixLike): this;

    /**
     * Sets the component values by copying them from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public set(...columns: [ ReadonlyVectorLike<3>, ReadonlyVectorLike<3> ]): this;

    public set(...args: Array<number | ReadonlyVectorLike> | [ ReadonlyMatrixLike ]): this {
        if (AbstractMatrix.isInitFromMatrix(args)) {
            this.reset();
            const arg = args[0];
            const argRows = arg.rows;
            const argColumns = arg.columns;
            const columns = Math.min(2, argColumns);
            const rows = Math.min(3, argRows);
            for (let y = 0; y < rows; ++y) {
                for (let x = 0; x < columns; ++x) {
                    this[y + x * rows] = arg[y + x * argRows];
                }
            }
            return this;
        } else {
            return this.setValues(args);
        }
    }

    /**
     * Creates a new matrix from the given JSON array.
     *
     * @param components - Array with the 9 matrix components.
     * @return The created matrix.
     */
    public static fromJSON(components: Matrix2x3JSON): Matrix2x3 {
        return new Matrix2x3(...components);
    }

    /** @inheritDoc */
    public clone(): Matrix2x3 {
        return new Matrix2x3(this);
    }

    /** @inheritDoc */
    public toJSON(): Matrix2x3JSON {
        return [
            this[0], this[1], this[2],
            this[3], this[4], this[5]
        ];
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.every((value, index) => value === other[index]));
    }

    /** @inheritDoc */
    public isIdentity(): boolean {
        return this[0] === 1 && this[1] === 0 && this[2] === 0
            && this[3] === 0 && this[4] === 1 && this[5] === 0;
    }

    /** @inheritDoc */
    public reset(): this {
        this[0] = 1; this[1] = 0; this[2] = 0;
        this[3] = 0; this[4] = 1; this[5] = 0;
        return this;
    }
}
