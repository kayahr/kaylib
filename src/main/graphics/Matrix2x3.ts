/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { StrictArrayBufferLike } from "../util/types";
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
     * Creates a new matrix initialized to the given component values.
     *
     * @param components - The component values.
     */
    public constructor(...components: Matrix2x3JSON);

    /**
     * Creates a new matrix using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: StrictArrayBufferLike, offset?: number);

    public constructor(...args: [] | Matrix2x3JSON | [ StrictArrayBufferLike, number? ]) {
        if (args.length === 0) {
            super(6);
            this[0] = this[4] = 1;
        } else if (AbstractMatrix.isInitFromArrayBuffer(args)) {
            super(args[0], args[1] ?? 0, 6);
        } else {
            super(args);
        }
        this.columns = 2;
        this.rows = 3;
    }

    /**
     * Creates a new matrix with the component values copied from the given column vectors.
     *
     * @param columns - The column vectors.
     * @return The created matrix.
     */
    public static fromColumns(c1: ReadonlyVectorLike<3>, c2: ReadonlyVectorLike<3>): Matrix2x3 {
        return new Matrix2x3(
            c1[0], c1[1], c1[2],
            c2[0], c2[1], c2[2]
        );
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
    public setComponents(...components: Matrix2x3JSON): this {
        this[0] = components[0]; this[1] = components[1]; this[2] = components[2];
        this[3] = components[3]; this[4] = components[4]; this[5] = components[5];
        return this;
    }

    /**
     * Sets the component values by copying them from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public setColumns(c1: ReadonlyVectorLike<3>, c2: ReadonlyVectorLike<3>): this {
        this[0] = c1[0]; this[1] = c1[1]; this[2] = c1[2];
        this[3] = c2[0]; this[4] = c2[1]; this[5] = c2[2];
        return this;
    }

    /** @inheritDoc */
    public clone(): Matrix2x3 {
        return Matrix2x3.fromMatrix(this);
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

    /** @inheritDoc */
    public add(summand: number): this;

    /** @inheritDoc */
    public add(matrix: ReadonlyMatrixLike<2, 3>): this;

    public add(arg: number | ReadonlyMatrixLike<2, 3>): this {
        if (typeof arg === "number") {
            this[0] += arg; this[1] += arg; this[2] += arg;
            this[3] += arg; this[4] += arg; this[5] += arg;
        } else {
            this[0] += arg[0]; this[1] += arg[1]; this[2] += arg[2];
            this[3] += arg[3]; this[4] += arg[4]; this[5] += arg[5];
        }
        return this;
    }

    /** @inheritDoc */
    public sub(subtrahend: number): this;

    /** @inheritDoc */
    public sub(matrix: ReadonlyMatrixLike<2, 3>): this;

    public sub(arg: number | ReadonlyMatrixLike<2, 3>): this {
        if (typeof arg === "number") {
            this[0] -= arg; this[1] -= arg; this[2] -= arg;
            this[3] -= arg; this[4] -= arg; this[5] -= arg;
        } else {
            this[0] -= arg[0]; this[1] -= arg[1]; this[2] -= arg[2];
            this[3] -= arg[3]; this[4] -= arg[4]; this[5] -= arg[5];
        }
        return this;
    }

    /** @inheritDoc */
    public compMul(matrix: ReadonlyMatrixLike<2, 3>): this;

    /** @inheritDoc */
    public compMul(factor: number): this;

    public compMul(arg: ReadonlyMatrixLike<2, 3> | number): this {
        if (typeof arg === "number") {
            this[0] *= arg; this[1] *= arg; this[2] *= arg;
            this[3] *= arg; this[4] *= arg; this[5] *= arg;
        } else {
            this[0] *= arg[0]; this[1] *= arg[1]; this[2] *= arg[2];
            this[3] *= arg[3]; this[4] *= arg[4]; this[5] *= arg[5];
        }
        return this;
    }

    /** @inheritDoc */
    public compDiv(matrix: ReadonlyMatrixLike<2, 3>): this;

    /** @inheritDoc */
    public compDiv(divisor: number): this;

    public compDiv(arg: ReadonlyMatrixLike<2, 3> | number): this {
        if (typeof arg === "number") {
            this[0] /= arg; this[1] /= arg; this[2] /= arg;
            this[3] /= arg; this[4] /= arg; this[5] /= arg;
        } else {
            this[0] /= arg[0]; this[1] /= arg[1]; this[2] /= arg[2];
            this[3] /= arg[3]; this[4] /= arg[4]; this[5] /= arg[5];
        }
        return this;
    }
}
