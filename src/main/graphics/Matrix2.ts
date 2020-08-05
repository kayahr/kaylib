/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { AbstractMatrix } from "./AbstractMatrix";
import { ReadonlyMatrixLike } from "./Matrix";
import { ReadonlySquareMatrixLike, SquareMatrix, SquareMatrixLike } from "./SquareMatrix";
import { ReadonlyVectorLike } from "./Vector";

/**
 * JSON representation of a matrix with 4 floating point components.
 */
export type Matrix2JSON = [
    number, number,
    number, number
];

export type Matrix2Like = SquareMatrixLike<2>;

/**
 * 2x2 matrix using 32 bit floating point components.
 */
export class Matrix2 extends AbstractMatrix<4> implements SquareMatrix<2>, Serializable<Matrix2JSON>,
        Cloneable<Matrix2> {
    /** The number of columns. */
    public readonly columns: 2;

    /** The number of rows. */
    public readonly rows: 2;

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
    public constructor(...components: Matrix2JSON);

    /**
     * Creates a new matrix with the component values copied from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public constructor(...columns: [ ReadonlyVectorLike<2>, ReadonlyVectorLike<2> ])

    /**
     * Creates a new matrix using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: ArrayBuffer | SharedArrayBuffer, offset?: number);

    public constructor(...args: Array<number | ReadonlyVectorLike> | [ ReadonlyMatrixLike ] |
            [ ArrayBuffer | SharedArrayBuffer, number? ]) {
        if (args.length === 0) {
            super(4);
            this[0] = this[3] = 1;
        } else if (AbstractMatrix.isInitFromMatrix(args)) {
            super(4);
            this[0] = this[3] = 1;
            const arg = args[0];
            const argRows = arg.rows;
            const columns = Math.min(2, arg.columns);
            const rows = Math.min(2, argRows);
            for (let y = 0; y < rows; ++y) {
                for (let x = 0; x < columns; ++x) {
                    this[y + x * 2] = arg[y + x * argRows];
                }
            }
        } else if (AbstractMatrix.isInitFromArrayBuffer(args)) {
            super(args[0], args[1] ?? 0, 4);
        } else {
            super(4);
            this.setValues(args);
        }
        this.columns = 2;
        this.rows = 2;
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

    /** Matrix component at row 1 column 2. */
    public get m21(): number {
        return this[2];
    }
    public set m21(v: number) {
        this[2] = v;
    }

    /** Matrix component at row 2 column 2. */
    public get m22(): number {
        return this[3];
    }
    public set m22(v: number) {
        this[3] = v;
    }

    /**
     * Sets the matrix component values.
     *
     * @param components - The component values to set.
     */
    public set(...components: Matrix2JSON): this;

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
    public set(...columns: [ ReadonlyVectorLike<2>, ReadonlyVectorLike<2> ]): this;

    public set(...args: Array<number | ReadonlyVectorLike> | [ ReadonlyMatrixLike ]): this {
        if (AbstractMatrix.isInitFromMatrix(args)) {
            this.reset();
            const arg = args[0];
            const argRows = arg.rows;
            const columns = Math.min(2, arg.columns);
            const rows = Math.min(2, argRows);
            for (let y = 0; y < rows; ++y) {
                for (let x = 0; x < columns; ++x) {
                    this[y + x * 2] = arg[y + x * argRows];
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
     * @param components - Array with the 4 matrix components.
     * @return The created matrix.
     */
    public static fromJSON(components: Matrix2JSON): Matrix2 {
        return new Matrix2(...components);
    }

    /** @inheritDoc */
    public clone(): Matrix2 {
        return new Matrix2(this);
    }

    /** @inheritDoc */
    public toJSON(): Matrix2JSON {
        return [
            this[0], this[1],
            this[2], this[3]
        ];
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.every((value, index) => value === other[index]));
    }

    /** @inheritDoc */
    public isIdentity(): boolean {
        return this[0] === 1 && this[1] === 0
            && this[2] === 0 && this[3] === 1;
    }

    /** @inheritDoc */
    public reset(): this {
        this[0] = 1; this[1] = 0;
        this[2] = 0; this[3] = 1;
        return this;
    }

    /** @inheritDoc */
    public add(summand: number): this;

    /** @inheritDoc */
    public add(matrix: ReadonlySquareMatrixLike<2>): this;

    public add(arg: number | ReadonlySquareMatrixLike<2>): this {
        if (typeof arg === "number") {
            this[0] += arg; this[1] += arg;
            this[2] += arg; this[3] += arg;
        } else {
            this[0] += arg[0]; this[1] += arg[1];
            this[2] += arg[2]; this[3] += arg[3];
        }
        return this;
    }

    /** @inheritDoc */
    public sub(subtrahend: number): this;

    /** @inheritDoc */
    public sub(matrix: ReadonlySquareMatrixLike<2>): this;

    public sub(arg: number | ReadonlySquareMatrixLike<2>): this {
        if (typeof arg === "number") {
            this[0] -= arg; this[1] -= arg;
            this[2] -= arg; this[3] -= arg;
        } else {
            this[0] -= arg[0]; this[1] -= arg[1];
            this[2] -= arg[2]; this[3] -= arg[3];
        }
        return this;
    }

    /** @inheritDoc */
    public compMul(matrix: ReadonlySquareMatrixLike<2>): this;

    /** @inheritDoc */
    public compMul(factor: number): this;

    public compMul(arg: ReadonlySquareMatrixLike<2> | number): this {
        if (typeof arg === "number") {
            this[0] *= arg; this[1] *= arg;
            this[2] *= arg; this[3] *= arg;
        } else {
            this[0] *= arg[0]; this[1] *= arg[1];
            this[2] *= arg[2]; this[3] *= arg[3];
        }
        return this;
    }

    /** @inheritDoc */
    public compDiv(matrix: ReadonlySquareMatrixLike<2>): this;

    /** @inheritDoc */
    public compDiv(divisor: number): this;

    public compDiv(arg: ReadonlySquareMatrixLike<2> | number): this {
        if (typeof arg === "number") {
            this[0] /= arg; this[1] /= arg;
            this[2] /= arg; this[3] /= arg;
        } else {
            this[0] /= arg[0]; this[1] /= arg[1];
            this[2] /= arg[2]; this[3] /= arg[3];
        }
        return this;
    }

    /** @inheritDoc */
    public mul(other: ReadonlySquareMatrixLike<2>): this {
        const a11 = this[0], a12 = this[1];
        const a21 = this[2], a22 = this[3];
        const b11 = other[0], b12 = other[1];
        const b21 = other[2], b22 = other[3];

        // | a11 a12 | * | b11 b12 | = | a11b11+a21b12 a12b11+a22b12 |
        // | a21 a22 |   | b21 b22 |   | a11b21+a21b22 a12b21+a22b22 |
        this[0] = a11 * b11 + a21 * b12;
        this[1] = a12 * b11 + a22 * b12;
        this[2] = a11 * b21 + a21 * b22;
        this[3] = a12 * b21 + a22 * b22;

        return this;
    }

    /** @inheritDoc */
    public div(other: ReadonlySquareMatrixLike<2>): this {
        // a = this, b = other
        const a11 = this[0], a12 = this[1];
        const a21 = this[2], a22 = this[3];
        const b11 = other[0], b12 = other[1];
        const b21 = other[2], b22 = other[3];

        // d = determinant(b)
        const d = b11 * b22 - b12 * b21;

        // c = invert(b)
        const c11 =  b22 / d, c12 = -b12 / d;
        const c21 = -b21 / d, c22 =  b11 / d;

        // this = this * c
        this[0] = a11 * c11 + a21 * c12;
        this[1] = a12 * c11 + a22 * c12;
        this[2] = a11 * c21 + a21 * c22;
        this[3] = a12 * c21 + a22 * c22;

        return this;
    }

    /** @inheritDoc */
    public getDeterminant(): number {
        return this[0] * this[3] - this[1] * this[2];
    }

    /** @inheritDoc */
    public invert(): this {
        const m11 = this[0], m12 = this[1];
        const m21 = this[2], m22 = this[3];
        const d = m11 * m22 - m12 * m21;
        this[0] = m22 / d;
        this[1] = -m12 / d;
        this[2] = -m21 / d;
        this[3] = m11 / d;
        return this;
    }

    /** @inheritDoc */
    public transpose(): this {
        const tmp = this[1];
        this[1] = this[2];
        this[2] = tmp;
        return this;
    }

    /** @inheritDoc */
    public adjugate(): this {
        const m11 = this[0], m12 = this[1];
        this[0] = this[3];
        this[1] = -this[2];
        this[2] = -m12;
        this[3] = m11;
        return this;
    }
}
