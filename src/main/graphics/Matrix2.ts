/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { StrictArrayBufferLike } from "../util/types";
import { AbstractMatrix } from "./AbstractMatrix";
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
export class Matrix2 extends AbstractMatrix<2, 2> implements SquareMatrix<2>, Serializable<Matrix2JSON>,
        Cloneable<Matrix2> {
    public override readonly length = 4;

    /**
     * Creates a matrix initialized to an identity matrix.
     */
    public constructor();

    /**
     * Creates a new matrix initialized to the given component values.
     *
     * @param components - The component values.
     */
    public constructor(...components: Matrix2JSON);

    /**
     * Creates a new matrix using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: StrictArrayBufferLike, offset?: number);

    public constructor(...args: [] | Matrix2JSON | [ StrictArrayBufferLike, number? ]) {
        if (args.length === 0) {
            super(2, 2);
            this[0] = this[3] = 1;
        } else if (AbstractMatrix.isInitFromComponents(args)) {
            super(2, 2);
            // Manually setting elements is much faster than passing them as array to Float32Array constructor
            this[0] = args[0]; this[1] = args[1];
            this[2] = args[2]; this[3] = args[3];
        } else {
            super(2, 2, args[0], args[1]);
        }
    }

    /**
     * Creates a new matrix with the component values copied from the given column vectors.
     *
     * @param c1 - The first column vector.
     * @param c2 - The first column vector.
     * @return The created matrix.
     */
    public static fromColumns(c1: ReadonlyVectorLike<2>, c2: ReadonlyVectorLike<2>): Matrix2 {
        return new Matrix2(c1[0], c1[1], c2[0], c2[1]);
    }

    /**
     * Creates a new matrix with the component values copied from the given row vectors.
     *
     * @param r1 - The first row vector.
     * @param r2 - The first row vector.
     * @return The created matrix.
     */
    public static fromRows(r1: ReadonlyVectorLike<2>, r2: ReadonlyVectorLike<2>): Matrix2 {
        return new Matrix2(r1[0], r2[0], r1[1], r2[1]);
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
    public setComponents(...components: Matrix2JSON): this {
        this[0] = components[0];
        this[1] = components[1];
        this[2] = components[2];
        this[3] = components[3];
        return this;
    }

    /**
     * Sets the component values by copying them from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public setColumns(c1: ReadonlyVectorLike<2>, c2: ReadonlyVectorLike<2>): this {
        this[0] = c1[0];
        this[1] = c1[1];
        this[2] = c2[0];
        this[3] = c2[1];
        return this;
    }

    /** @inheritDoc */
    public clone(): Matrix2 {
        return Matrix2.fromMatrix(this);
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
