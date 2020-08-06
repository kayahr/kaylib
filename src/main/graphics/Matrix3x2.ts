/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { Constructor } from "../util/types";
import { AbstractMatrix } from "./AbstractMatrix";
import { Matrix, ReadonlyMatrixLike } from "./Matrix";
import { ReadonlyVectorLike } from "./Vector";

/**
 * JSON representation of a 3x2 matrix.
 */
export type Matrix3x2JSON = [
    number, number, number,
    number, number, number,
];

/**
 * 3x2 matrix using 32 bit floating point components.
 */
export class Matrix3x2 extends AbstractMatrix<6> implements Matrix<3, 2>, Serializable<Matrix3x2JSON>,
        Cloneable<Matrix3x2> {
    /** The number of columns. */
    public readonly columns: 3;

    /** The number of rows. */
    public readonly rows: 2;

    /**
     * Creates a matrix initialized to an identity matrix.
     */
    public constructor();

    /**
     * Creates a new matrix initialized to the given component values.
     *
     * @param components - The component values.
     */
    public constructor(...components: Matrix3x2JSON);

    /**
     * Creates a new matrix using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: ArrayBuffer | SharedArrayBuffer, offset?: number);

    public constructor(...args: [] | Matrix3x2JSON | [ ArrayBuffer | SharedArrayBuffer, number? ]) {
        if (args.length === 0) {
            super(6);
            this[0] = this[3] = 1;
        } else if (AbstractMatrix.isInitFromArrayBuffer(args)) {
            super(args[0], args[1] ?? 0, 6);
        } else {
            super(args);
        }
        this.columns = 3;
        this.rows = 2;
    }

    /**
     * Creates a new matrix with the component values copied from the given column vectors.
     *
     * @param columns - The column vectors.
     * @return The created matrix.
     */
    public static fromColumns(c1: ReadonlyVectorLike<2>, c2: ReadonlyVectorLike<2>, c3: ReadonlyVectorLike<2>):
            Matrix3x2 {
        return new Matrix3x2(
            c1[0], c1[1],
            c2[0], c2[1],
            c3[0], c3[1]
        );
    }

    /**
     * Creates a new matrix from the given JSON array.
     *
     * @param components - Array with the 9 matrix components.
     * @return The created matrix.
     */
    public static fromJSON<T extends Matrix3x2>(this: Constructor<T, Matrix3x2JSON>, components: Matrix3x2JSON): T {
        return new this(...components);
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

    /** Matrix component at row 1 column 3. */
    public get m31(): number {
        return this[4];
    }
    public set m31(v: number) {
        this[4] = v;
    }

    /** Matrix component at row 2 column 3. */
    public get m32(): number {
        return this[5];
    }
    public set m32(v: number) {
        this[5] = v;
    }

    /**
     * Sets the matrix component values.
     *
     * @param components - The component values to set.
     */
    public setComponents(...components: Matrix3x2JSON): this {
        this[0] = components[0]; this[1] = components[1];
        this[2] = components[2]; this[3] = components[3];
        this[4] = components[4]; this[5] = components[5];
        return this;
    }

    /**
     * Sets the component values by copying them from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public setColumns(c1: ReadonlyVectorLike<2>, c2: ReadonlyVectorLike<2>, c3: ReadonlyVectorLike<2>): this {
        this[0] = c1[0]; this[1] = c1[1];
        this[2] = c2[0]; this[3] = c2[1];
        this[4] = c3[0]; this[5] = c3[1];
        return this;
    }

    /** @inheritDoc */
    public clone(): Matrix3x2 {
        return Matrix3x2.fromMatrix(this);
    }

    /** @inheritDoc */
    public toJSON(): Matrix3x2JSON {
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
        return this[0] === 1 && this[1] === 0
            && this[2] === 0 && this[3] === 1
            && this[4] === 0 && this[5] === 0;
    }

    /** @inheritDoc */
    public reset(): this {
        this[0] = 1; this[1] = 0;
        this[2] = 0; this[3] = 1;
        this[4] = 0; this[5] = 0;
        return this;
    }

    /** @inheritDoc */
    public add(summand: number): this;

    /** @inheritDoc */
    public add(matrix: ReadonlyMatrixLike<3, 2>): this;

    public add(arg: number | ReadonlyMatrixLike<3, 2>): this {
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
    public sub(matrix: ReadonlyMatrixLike<3, 2>): this;

    public sub(arg: number | ReadonlyMatrixLike<3, 2>): this {
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
    public compMul(matrix: ReadonlyMatrixLike<3, 2>): this;

    /** @inheritDoc */
    public compMul(factor: number): this;

    public compMul(arg: ReadonlyMatrixLike<3, 2> | number): this {
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
    public compDiv(matrix: ReadonlyMatrixLike<3, 2>): this;

    /** @inheritDoc */
    public compDiv(divisor: number): this;

    public compDiv(arg: ReadonlyMatrixLike<3, 2> | number): this {
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
