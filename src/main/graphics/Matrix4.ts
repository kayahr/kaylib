/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
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
 * JSON representation of a matrix with 16 floating point components.
 */
export type Matrix4JSON = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
];

export type Matrix4Like = SquareMatrixLike<4>;

/**
 * 4x4 matrix using 32 bit floating point components.
 */
export class Matrix4 extends AbstractMatrix<16> implements SquareMatrix<4>, Serializable<Matrix4JSON>,
        Cloneable<Matrix4> {
    /** The number of columns. */
    public override readonly columns: 4;

    /** The number of rows. */
    public override readonly rows: 4;

    /**
     * Creates a matrix initialized to an identity matrix.
     */
    public constructor();

    /**
     * Creates a new matrix initialized to the given component values.
     *
     * @param components - The component values.
     */
    public constructor(...components: Matrix4JSON);

    /**
     * Creates a new matrix using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: StrictArrayBufferLike, offset?: number);

    public constructor(...args: [] | Matrix4JSON | [ StrictArrayBufferLike, number? ]) {
        if (args.length === 0) {
            super(16);
            this[0] = this[5] = this[10] = this[15] = 1;
        } else if (AbstractMatrix.isInitFromComponents(args)) {
            super(16);
            // Manually setting elements is much faster than passing them as array to Float32Array constructor
            this[ 0] = args[ 0]; this[ 1] = args[ 1]; this[ 2] = args[ 2]; this[ 3] = args[ 3];
            this[ 4] = args[ 4]; this[ 5] = args[ 5]; this[ 6] = args[ 6]; this[ 7] = args[ 7];
            this[ 8] = args[ 8]; this[ 9] = args[ 9]; this[10] = args[10]; this[11] = args[11];
            this[12] = args[12]; this[13] = args[13]; this[14] = args[14]; this[15] = args[15];
        } else {
            super(args[0], args[1] ?? 0, 16);
        }
        this.columns = 4;
        this.rows = 4;
    }

    /**
     * Creates a new matrix with the component values copied from the given column vectors.
     *
     * @param c1 - The first column vector.
     * @param c2 - The second column vector.
     * @param c3 - The third column vector.
     * @param c4 - The fourth column vector.
     * @return The created matrix.
     */
    public static fromColumns(c1: ReadonlyVectorLike<4>, c2: ReadonlyVectorLike<4>,
            c3: ReadonlyVectorLike<4>, c4: ReadonlyVectorLike<4>): Matrix4 {
        return new Matrix4(
            c1[0], c1[1], c1[2], c1[3],
            c2[0], c2[1], c2[2], c2[3],
            c3[0], c3[1], c3[2], c3[3],
            c4[0], c4[1], c4[2], c4[3]
        );
    }

    /**
     * Creates a new matrix with the component values copied from the given row vectors.
     *
     * @param r1 - The first row vector.
     * @param r2 - The second row vector.
     * @param r3 - The third row vector.
     * @param r4 - The fourth row vector.
     * @return The created matrix.
     */
    public static fromRows(r1: ReadonlyVectorLike<4>, r2: ReadonlyVectorLike<4>,
            r3: ReadonlyVectorLike<4>, r4: ReadonlyVectorLike<4>): Matrix4 {
        return new Matrix4(
            r1[0], r2[0], r3[0], r4[0],
            r1[1], r2[1], r3[1], r4[1],
            r1[2], r2[2], r3[2], r4[2],
            r1[3], r2[3], r3[3], r4[3]
        );
    }

    /**
     * Creates a new matrix from the given JSON array.
     *
     * @param components - Array with the 16 matrix components.
     * @return The created matrix.
     */
    public static fromJSON(components: Matrix4JSON): Matrix4 {
        return new Matrix4(...components);
    }

    /**
     * Creates a new matrix from the given DOM matrix object.
     *
     * @aram domMatrix - The DOM matrix object.
     * @return The created matrix.
     */
    public static fromDOMMatrix(domMatrix: DOMMatrix): Matrix4 {
        return new Matrix4(domMatrix.toFloat32Array().buffer);
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

    /** Matrix component at row 4 column 1. */
    public get m14(): number {
        return this[3];
    }
    public set m14(v: number) {
        this[3] = v;
    }

    /** Matrix component at row 1 column 2. */
    public get m21(): number {
        return this[4];
    }
    public set m21(v: number) {
        this[4] = v;
    }

    /** Matrix component at row 2 column 2. */
    public get m22(): number {
        return this[5];
    }
    public set m22(v: number) {
        this[5] = v;
    }

    /** Matrix component at row 3 column 2. */
    public get m23(): number {
        return this[6];
    }
    public set m23(v: number) {
        this[6] = v;
    }

    /** Matrix component at row 4 column 2. */
    public get m24(): number {
        return this[7];
    }
    public set m24(v: number) {
        this[7] = v;
    }

    /** Matrix component at row 1 column 3. */
    public get m31(): number {
        return this[8];
    }
    public set m31(v: number) {
        this[8] = v;
    }

    /** Matrix component at row 2 column 3. */
    public get m32(): number {
        return this[9];
    }
    public set m32(v: number) {
        this[9] = v;
    }

    /** Matrix component at row 3 column 3. */
    public get m33(): number {
        return this[10];
    }
    public set m33(v: number) {
        this[10] = v;
    }

    /** Matrix component at row 4 column 3. */
    public get m34(): number {
        return this[11];
    }
    public set m34(v: number) {
        this[11] = v;
    }

    /** Matrix component at row 1 column 4. */
    public get m41(): number {
        return this[12];
    }
    public set m41(v: number) {
        this[12] = v;
    }

    /** Matrix component at row 2 column 4. */
    public get m42(): number {
        return this[13];
    }
    public set m42(v: number) {
        this[13] = v;
    }

    /** Matrix component at row 3 column 4. */
    public get m43(): number {
        return this[14];
    }
    public set m43(v: number) {
        this[14] = v;
    }

    /** Matrix component at row 4 column 4. */
    public get m44(): number {
        return this[15];
    }
    public set m44(v: number) {
        this[15] = v;
    }

    /**
     * Sets the matrix component values.
     *
     * @param components - The component values to set.
     */
    public setComponents(...components: Matrix4JSON): this {
        this[ 0] = components[ 0]; this[ 1] = components[ 1]; this[ 2] = components[ 2]; this[ 3] = components[ 3];
        this[ 4] = components[ 4]; this[ 5] = components[ 5]; this[ 6] = components[ 6]; this[ 7] = components[ 7];
        this[ 8] = components[ 8]; this[ 9] = components[ 9]; this[10] = components[10]; this[11] = components[11];
        this[12] = components[12]; this[13] = components[13]; this[14] = components[14]; this[15] = components[15];
        return this;
    }

    /**
     * Sets the component values by copying them from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public setColumns(c1: ReadonlyVectorLike<4>, c2: ReadonlyVectorLike<4>,
            c3: ReadonlyVectorLike<4>, c4: ReadonlyVectorLike<4>): this {
        this[ 0] = c1[0]; this[ 1] = c1[1]; this[ 2] = c1[2]; this[ 3] = c1[3];
        this[ 4] = c2[0]; this[ 5] = c2[1]; this[ 6] = c2[2]; this[ 7] = c2[3];
        this[ 8] = c3[0]; this[ 9] = c3[1]; this[10] = c3[2]; this[11] = c3[3];
        this[12] = c4[0]; this[13] = c4[1]; this[14] = c4[2]; this[15] = c4[3];
        return this;
    }

    /** @inheritDoc */
    public clone(): Matrix4 {
        return Matrix4.fromMatrix(this);
    }

    /** @inheritDoc */
    public toJSON(): Matrix4JSON {
        return Array.from(this) as Matrix4JSON;
    }

    /**
     * Converts this matrix into DOM matrix.
     *
     * @return The created DOM matrix.
     */
    public toDOMMatrix(): DOMMatrix {
        return DOMMatrix.fromMatrix(this);
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.every((value, index) => value === other[index]));
    }

    /** @inheritDoc */
    public isIdentity(): boolean {
        return this[ 0] === 1 && this[ 1] === 0 && this[ 2] === 0 && this[ 3] === 0
            && this[ 4] === 0 && this[ 5] === 1 && this[ 6] === 0 && this[ 7] === 0
            && this[ 8] === 0 && this[ 9] === 0 && this[10] === 1 && this[11] === 0
            && this[12] === 0 && this[13] === 0 && this[14] === 0 && this[15] === 1;
    }

    /** @inheritDoc */
    public reset(): this {
        this[ 0] = 1; this[ 1] = 0; this[ 2] = 0; this[ 3] = 0;
        this[ 4] = 0; this[ 5] = 1; this[ 6] = 0; this[ 7] = 0;
        this[ 8] = 0; this[ 9] = 0; this[10] = 1; this[11] = 0;
        this[12] = 0; this[13] = 0; this[14] = 0; this[15] = 1;
        return this;
    }

    /** @inheritDoc */
    public add(summand: number): this;

    /** @inheritDoc */
    public add(matrix: ReadonlySquareMatrixLike<4>): this;

    public add(arg: number | ReadonlySquareMatrixLike<4>): this {
        if (typeof arg === "number") {
            this[ 0] += arg; this[ 1] += arg; this[ 2] += arg; this[ 3] += arg;
            this[ 4] += arg; this[ 5] += arg; this[ 6] += arg; this[ 7] += arg;
            this[ 8] += arg; this[ 9] += arg; this[10] += arg; this[11] += arg;
            this[12] += arg; this[13] += arg; this[14] += arg; this[15] += arg;
        } else {
            this[ 0] += arg[ 0]; this[ 1] += arg[ 1]; this[ 2] += arg[ 2]; this[ 3] += arg[ 3];
            this[ 4] += arg[ 4]; this[ 5] += arg[ 5]; this[ 6] += arg[ 6]; this[ 7] += arg[ 7];
            this[ 8] += arg[ 8]; this[ 9] += arg[ 9]; this[10] += arg[10]; this[11] += arg[11];
            this[12] += arg[12]; this[13] += arg[13]; this[14] += arg[14]; this[15] += arg[15];
        }
        return this;
    }

    /** @inheritDoc */
    public sub(subtrahend: number): this;

    /** @inheritDoc */
    public sub(matrix: ReadonlySquareMatrixLike<4>): this;

    public sub(arg: number | ReadonlySquareMatrixLike<4>): this {
        if (typeof arg === "number") {
            this[ 0] -= arg; this[ 1] -= arg; this[ 2] -= arg; this[ 3] -= arg;
            this[ 4] -= arg; this[ 5] -= arg; this[ 6] -= arg; this[ 7] -= arg;
            this[ 8] -= arg; this[ 9] -= arg; this[10] -= arg; this[11] -= arg;
            this[12] -= arg; this[13] -= arg; this[14] -= arg; this[15] -= arg;
        } else {
            this[ 0] -= arg[ 0]; this[ 1] -= arg[ 1]; this[ 2] -= arg[ 2]; this[ 3] -= arg[ 3];
            this[ 4] -= arg[ 4]; this[ 5] -= arg[ 5]; this[ 6] -= arg[ 6]; this[ 7] -= arg[ 7];
            this[ 8] -= arg[ 8]; this[ 9] -= arg[ 9]; this[10] -= arg[10]; this[11] -= arg[11];
            this[12] -= arg[12]; this[13] -= arg[13]; this[14] -= arg[14]; this[15] -= arg[15];
        }
        return this;
    }

    /** @inheritDoc */
    public compMul(matrix: ReadonlySquareMatrixLike<4>): this;

    /** @inheritDoc */
    public compMul(factor: number): this;

    public compMul(arg: ReadonlySquareMatrixLike<4> | number): this {
        if (typeof arg === "number") {
            this[ 0] *= arg; this[ 1] *= arg; this[ 2] *= arg; this[ 3] *= arg;
            this[ 4] *= arg; this[ 5] *= arg; this[ 6] *= arg; this[ 7] *= arg;
            this[ 8] *= arg; this[ 9] *= arg; this[10] *= arg; this[11] *= arg;
            this[12] *= arg; this[13] *= arg; this[14] *= arg; this[15] *= arg;
        } else {
            this[ 0] *= arg[ 0]; this[ 1] *= arg[ 1]; this[ 2] *= arg[ 2]; this[ 3] *= arg[ 3];
            this[ 4] *= arg[ 4]; this[ 5] *= arg[ 5]; this[ 6] *= arg[ 6]; this[ 7] *= arg[ 7];
            this[ 8] *= arg[ 8]; this[ 9] *= arg[ 9]; this[10] *= arg[10]; this[11] *= arg[11];
            this[12] *= arg[12]; this[13] *= arg[13]; this[14] *= arg[14]; this[15] *= arg[15];
        }
        return this;
    }

    /** @inheritDoc */
    public compDiv(matrix: ReadonlySquareMatrixLike<4>): this;

    /** @inheritDoc */
    public compDiv(divisor: number): this;

    public compDiv(arg: ReadonlySquareMatrixLike<4> | number): this {
        if (typeof arg === "number") {
            this[ 0] /= arg; this[ 1] /= arg; this[ 2] /= arg; this[ 3] /= arg;
            this[ 4] /= arg; this[ 5] /= arg; this[ 6] /= arg; this[ 7] /= arg;
            this[ 8] /= arg; this[ 9] /= arg; this[10] /= arg; this[11] /= arg;
            this[12] /= arg; this[13] /= arg; this[14] /= arg; this[15] /= arg;
        } else {
            this[ 0] /= arg[ 0]; this[ 1] /= arg[ 1]; this[ 2] /= arg[ 2]; this[ 3] /= arg[ 3];
            this[ 4] /= arg[ 4]; this[ 5] /= arg[ 5]; this[ 6] /= arg[ 6]; this[ 7] /= arg[ 7];
            this[ 8] /= arg[ 8]; this[ 9] /= arg[ 9]; this[10] /= arg[10]; this[11] /= arg[11];
            this[12] /= arg[12]; this[13] /= arg[13]; this[14] /= arg[14]; this[15] /= arg[15];
        }
        return this;
    }

    /** @inheritDoc */
    public mul(other: ReadonlySquareMatrixLike<4>): this {
        // a = this
        const a11 = this[ 0], a12 = this[ 1], a13 = this[ 2], a14 = this[ 3];
        const a21 = this[ 4], a22 = this[ 5], a23 = this[ 6], a24 = this[ 7];
        const a31 = this[ 8], a32 = this[ 9], a33 = this[10], a34 = this[11];
        const a41 = this[12], a42 = this[13], a43 = this[14], a44 = this[15];

        // b = other
        const b11 = other[ 0], b12 = other[ 1], b13 = other[ 2], b14 = other[ 3];
        const b21 = other[ 4], b22 = other[ 5], b23 = other[ 6], b24 = other[ 7];
        const b31 = other[ 8], b32 = other[ 9], b33 = other[10], b34 = other[11];
        const b41 = other[12], b42 = other[13], b43 = other[14], b44 = other[15];

        // this = a * b;
        this[ 0] = a11 * b11 + a21 * b12 + a31 * b13 + a41 * b14;
        this[ 1] = a12 * b11 + a22 * b12 + a32 * b13 + a42 * b14;
        this[ 2] = a13 * b11 + a23 * b12 + a33 * b13 + a43 * b14;
        this[ 3] = a14 * b11 + a24 * b12 + a34 * b13 + a44 * b14;
        this[ 4] = a11 * b21 + a21 * b22 + a31 * b23 + a41 * b24;
        this[ 5] = a12 * b21 + a22 * b22 + a32 * b23 + a42 * b24;
        this[ 6] = a13 * b21 + a23 * b22 + a33 * b23 + a43 * b24;
        this[ 7] = a14 * b21 + a24 * b22 + a34 * b23 + a44 * b24;
        this[ 8] = a11 * b31 + a21 * b32 + a31 * b33 + a41 * b34;
        this[ 9] = a12 * b31 + a22 * b32 + a32 * b33 + a42 * b34;
        this[10] = a13 * b31 + a23 * b32 + a33 * b33 + a43 * b34;
        this[11] = a14 * b31 + a24 * b32 + a34 * b33 + a44 * b34;
        this[12] = a11 * b41 + a21 * b42 + a31 * b43 + a41 * b44;
        this[13] = a12 * b41 + a22 * b42 + a32 * b43 + a42 * b44;
        this[14] = a13 * b41 + a23 * b42 + a33 * b43 + a43 * b44;
        this[15] = a14 * b41 + a24 * b42 + a34 * b43 + a44 * b44;

        return this;
    }

    /** @inheritDoc */
    public div(other: ReadonlySquareMatrixLike<4>): this {
        // a = this
        const a11 = this[ 0], a12 = this[ 1], a13 = this[ 2], a14 = this[ 3];
        const a21 = this[ 4], a22 = this[ 5], a23 = this[ 6], a24 = this[ 7];
        const a31 = this[ 8], a32 = this[ 9], a33 = this[10], a34 = this[11];
        const a41 = this[12], a42 = this[13], a43 = this[14], a44 = this[15];

        // b = other
        const b11 = other[ 0], b12 = other[ 1], b13 = other[ 2], b14 = other[ 3];
        const b21 = other[ 4], b22 = other[ 5], b23 = other[ 6], b24 = other[ 7];
        const b31 = other[ 8], b32 = other[ 9], b33 = other[10], b34 = other[11];
        const b41 = other[12], b42 = other[13], b43 = other[14], b44 = other[15];

        // Some intermediate calculations so they are only done once
        const b11b22 = b11 * b22, b11b23 = b11 * b23, b11b24 = b11 * b24, b12b21 = b12 * b21;
        const b12b23 = b12 * b23, b12b24 = b12 * b24, b13b21 = b13 * b21, b13b22 = b13 * b22;
        const b13b24 = b13 * b24, b14b21 = b14 * b21, b14b22 = b14 * b22, b14b23 = b14 * b23;
        const b31b42 = b31 * b42, b31b43 = b31 * b43, b31b44 = b31 * b44, b32b41 = b32 * b41;
        const b32b43 = b32 * b43, b32b44 = b32 * b44, b33b41 = b33 * b41, b33b42 = b33 * b42;
        const b33b44 = b33 * b44, b34b41 = b34 * b41, b34b42 = b34 * b42, b34b43 = b34 * b43;

        // d = determinant(b)
        const d = b14b23 * b32b41 - b13b24 * b32b41 - b14b22 * b33b41 + b12b24 * b33b41
                + b13b22 * b34b41 - b12b23 * b34b41 - b14b23 * b31b42 + b13b24 * b31b42
                + b14b21 * b33b42 - b11b24 * b33b42 - b13b21 * b34b42 + b11b23 * b34b42
                + b14b22 * b31b43 - b12b24 * b31b43 - b14b21 * b32b43 + b11b24 * b32b43
                + b12b21 * b34b43 - b11b22 * b34b43 - b13b22 * b31b44 + b12b23 * b31b44
                + b13b21 * b32b44 - b11b23 * b32b44 - b12b21 * b33b44 + b11b22 * b33b44;

        // c = invert(b)
        const c11 = (b23 * b34b42 - b24 * b33b42 + b24 * b32b43 - b22 * b34b43 - b23 * b32b44 + b22 * b33b44) / d;
        const c12 = (b14 * b33b42 - b13 * b34b42 - b14 * b32b43 + b12 * b34b43 + b13 * b32b44 - b12 * b33b44) / d;
        const c13 = (b13b24 * b42 - b14b23 * b42 + b14b22 * b43 - b12b24 * b43 - b13b22 * b44 + b12b23 * b44) / d;
        const c14 = (b14b23 * b32 - b13b24 * b32 - b14b22 * b33 + b12b24 * b33 + b13b22 * b34 - b12b23 * b34) / d;
        const c21 = (b24 * b33b41 - b23 * b34b41 - b24 * b31b43 + b21 * b34b43 + b23 * b31b44 - b21 * b33b44) / d;
        const c22 = (b13 * b34b41 - b14 * b33b41 + b14 * b31b43 - b11 * b34b43 - b13 * b31b44 + b11 * b33b44) / d;
        const c23 = (b14b23 * b41 - b13b24 * b41 - b14b21 * b43 + b11b24 * b43 + b13b21 * b44 - b11b23 * b44) / d;
        const c24 = (b13b24 * b31 - b14b23 * b31 + b14b21 * b33 - b11b24 * b33 - b13b21 * b34 + b11b23 * b34) / d;
        const c31 = (b22 * b34b41 - b24 * b32b41 + b24 * b31b42 - b21 * b34b42 - b22 * b31b44 + b21 * b32b44) / d;
        const c32 = (b14 * b32b41 - b12 * b34b41 - b14 * b31b42 + b11 * b34b42 + b12 * b31b44 - b11 * b32b44) / d;
        const c33 = (b12b24 * b41 - b14b22 * b41 + b14b21 * b42 - b11b24 * b42 - b12b21 * b44 + b11b22 * b44) / d;
        const c34 = (b14b22 * b31 - b12b24 * b31 - b14b21 * b32 + b11b24 * b32 + b12b21 * b34 - b11b22 * b34) / d;
        const c41 = (b23 * b32b41 - b22 * b33b41 - b23 * b31b42 + b21 * b33b42 + b22 * b31b43 - b21 * b32b43) / d;
        const c42 = (b12 * b33b41 - b13 * b32b41 + b13 * b31b42 - b11 * b33b42 - b12 * b31b43 + b11 * b32b43) / d;
        const c43 = (b13b22 * b41 - b12b23 * b41 - b13b21 * b42 + b11b23 * b42 + b12b21 * b43 - b11b22 * b43) / d;
        const c44 = (b12b23 * b31 - b13b22 * b31 + b13b21 * b32 - b11b23 * b32 - b12b21 * b33 + b11b22 * b33) / d;

        // this = this * c
        this[ 0] = a11 * c11 + a21 * c12 + a31 * c13 + a41 * c14;
        this[ 1] = a12 * c11 + a22 * c12 + a32 * c13 + a42 * c14;
        this[ 2] = a13 * c11 + a23 * c12 + a33 * c13 + a43 * c14;
        this[ 3] = a14 * c11 + a24 * c12 + a34 * c13 + a44 * c14;
        this[ 4] = a11 * c21 + a21 * c22 + a31 * c23 + a41 * c24;
        this[ 5] = a12 * c21 + a22 * c22 + a32 * c23 + a42 * c24;
        this[ 6] = a13 * c21 + a23 * c22 + a33 * c23 + a43 * c24;
        this[ 7] = a14 * c21 + a24 * c22 + a34 * c23 + a44 * c24;
        this[ 8] = a11 * c31 + a21 * c32 + a31 * c33 + a41 * c34;
        this[ 9] = a12 * c31 + a22 * c32 + a32 * c33 + a42 * c34;
        this[10] = a13 * c31 + a23 * c32 + a33 * c33 + a43 * c34;
        this[11] = a14 * c31 + a24 * c32 + a34 * c33 + a44 * c34;
        this[12] = a11 * c41 + a21 * c42 + a31 * c43 + a41 * c44;
        this[13] = a12 * c41 + a22 * c42 + a32 * c43 + a42 * c44;
        this[14] = a13 * c41 + a23 * c42 + a33 * c43 + a43 * c44;
        this[15] = a14 * c41 + a24 * c42 + a34 * c43 + a44 * c44;

        return this;
    }

    /** @inheritDoc */
    public getDeterminant(): number {
        const m11 = this[ 0], m12 = this[ 1], m13 = this[ 2], m14 = this[ 3];
        const m21 = this[ 4], m22 = this[ 5], m23 = this[ 6], m24 = this[ 7];
        const m31 = this[ 8], m32 = this[ 9], m33 = this[10], m34 = this[11];
        const m41 = this[12], m42 = this[13], m43 = this[14], m44 = this[15];

        const m11m22 = m11 * m22, m11m23 = m11 * m23, m11m24 = m11 * m24, m12m21 = m12 * m21;
        const m12m23 = m12 * m23, m12m24 = m12 * m24, m13m21 = m13 * m21, m13m22 = m13 * m22;
        const m13m24 = m13 * m24, m14m21 = m14 * m21, m14m22 = m14 * m22, m14m23 = m14 * m23;
        const m31m42 = m31 * m42, m31m43 = m31 * m43, m31m44 = m31 * m44, m32m41 = m32 * m41;
        const m32m43 = m32 * m43, m32m44 = m32 * m44, m33m41 = m33 * m41, m33m42 = m33 * m42;
        const m33m44 = m33 * m44, m34m41 = m34 * m41, m34m42 = m34 * m42, m34m43 = m34 * m43;

        return m14m23 * m32m41 - m13m24 * m32m41 - m14m22 * m33m41 + m12m24 * m33m41
             + m13m22 * m34m41 - m12m23 * m34m41 - m14m23 * m31m42 + m13m24 * m31m42
             + m14m21 * m33m42 - m11m24 * m33m42 - m13m21 * m34m42 + m11m23 * m34m42
             + m14m22 * m31m43 - m12m24 * m31m43 - m14m21 * m32m43 + m11m24 * m32m43
             + m12m21 * m34m43 - m11m22 * m34m43 - m13m22 * m31m44 + m12m23 * m31m44
             + m13m21 * m32m44 - m11m23 * m32m44 - m12m21 * m33m44 + m11m22 * m33m44;
    }

    /** @inheritDoc */
    public invert(): this {
        const m11 = this[ 0], m12 = this[ 1], m13 = this[ 2], m14 = this[ 3];
        const m21 = this[ 4], m22 = this[ 5], m23 = this[ 6], m24 = this[ 7];
        const m31 = this[ 8], m32 = this[ 9], m33 = this[10], m34 = this[11];
        const m41 = this[12], m42 = this[13], m43 = this[14], m44 = this[15];

        const m11m22 = m11 * m22, m11m23 = m11 * m23, m11m24 = m11 * m24, m12m21 = m12 * m21;
        const m12m23 = m12 * m23, m12m24 = m12 * m24, m13m21 = m13 * m21, m13m22 = m13 * m22;
        const m13m24 = m13 * m24, m14m21 = m14 * m21, m14m22 = m14 * m22, m14m23 = m14 * m23;
        const m31m42 = m31 * m42, m31m43 = m31 * m43, m31m44 = m31 * m44, m32m41 = m32 * m41;
        const m32m43 = m32 * m43, m32m44 = m32 * m44, m33m41 = m33 * m41, m33m42 = m33 * m42;
        const m33m44 = m33 * m44, m34m41 = m34 * m41, m34m42 = m34 * m42, m34m43 = m34 * m43;

        const d = m14m23 * m32m41 - m13m24 * m32m41 - m14m22 * m33m41 + m12m24 * m33m41
                + m13m22 * m34m41 - m12m23 * m34m41 - m14m23 * m31m42 + m13m24 * m31m42
                + m14m21 * m33m42 - m11m24 * m33m42 - m13m21 * m34m42 + m11m23 * m34m42
                + m14m22 * m31m43 - m12m24 * m31m43 - m14m21 * m32m43 + m11m24 * m32m43
                + m12m21 * m34m43 - m11m22 * m34m43 - m13m22 * m31m44 + m12m23 * m31m44
                + m13m21 * m32m44 - m11m23 * m32m44 - m12m21 * m33m44 + m11m22 * m33m44;

        this[ 0] = (m23 * m34m42 - m24 * m33m42 + m24 * m32m43 - m22 * m34m43 - m23 * m32m44 + m22 * m33m44) / d;
        this[ 1] = (m14 * m33m42 - m13 * m34m42 - m14 * m32m43 + m12 * m34m43 + m13 * m32m44 - m12 * m33m44) / d;
        this[ 2] = (m13m24 * m42 - m14m23 * m42 + m14m22 * m43 - m12m24 * m43 - m13m22 * m44 + m12m23 * m44) / d;
        this[ 3] = (m14m23 * m32 - m13m24 * m32 - m14m22 * m33 + m12m24 * m33 + m13m22 * m34 - m12m23 * m34) / d;
        this[ 4] = (m24 * m33m41 - m23 * m34m41 - m24 * m31m43 + m21 * m34m43 + m23 * m31m44 - m21 * m33m44) / d;
        this[ 5] = (m13 * m34m41 - m14 * m33m41 + m14 * m31m43 - m11 * m34m43 - m13 * m31m44 + m11 * m33m44) / d;
        this[ 6] = (m14m23 * m41 - m13m24 * m41 - m14m21 * m43 + m11m24 * m43 + m13m21 * m44 - m11m23 * m44) / d;
        this[ 7] = (m13m24 * m31 - m14m23 * m31 + m14m21 * m33 - m11m24 * m33 - m13m21 * m34 + m11m23 * m34) / d;
        this[ 8] = (m22 * m34m41 - m24 * m32m41 + m24 * m31m42 - m21 * m34m42 - m22 * m31m44 + m21 * m32m44) / d;
        this[ 9] = (m14 * m32m41 - m12 * m34m41 - m14 * m31m42 + m11 * m34m42 + m12 * m31m44 - m11 * m32m44) / d;
        this[10] = (m12m24 * m41 - m14m22 * m41 + m14m21 * m42 - m11m24 * m42 - m12m21 * m44 + m11m22 * m44) / d;
        this[11] = (m14m22 * m31 - m12m24 * m31 - m14m21 * m32 + m11m24 * m32 + m12m21 * m34 - m11m22 * m34) / d;
        this[12] = (m23 * m32m41 - m22 * m33m41 - m23 * m31m42 + m21 * m33m42 + m22 * m31m43 - m21 * m32m43) / d;
        this[13] = (m12 * m33m41 - m13 * m32m41 + m13 * m31m42 - m11 * m33m42 - m12 * m31m43 + m11 * m32m43) / d;
        this[14] = (m13m22 * m41 - m12m23 * m41 - m13m21 * m42 + m11m23 * m42 + m12m21 * m43 - m11m22 * m43) / d;
        this[15] = (m12m23 * m31 - m13m22 * m31 + m13m21 * m32 - m11m23 * m32 - m12m21 * m33 + m11m22 * m33) / d;

        return this;
    }

    /** @inheritDoc */
    public transpose(): this {
        const m12 = this[1];
        const m13 = this[2];
        const m14 = this[3];
        const m23 = this[6];
        const m24 = this[7];
        const m34 = this[11];

        this[ 1] = this[4];
        this[ 2] = this[8];
        this[ 3] = this[12];
        this[ 4] = m12;
        this[ 6] = this[9];
        this[ 7] = this[13];
        this[ 8] = m13;
        this[ 9] = m23;
        this[11] = this[14];
        this[12] = m14;
        this[13] = m24;
        this[14] = m34;

        return this;
    }

    /**
     * Converts this matrix into the "adjoint matrix".
     */
    public adjugate(): this {
        const m11 = this[ 0], m12 = this[ 1], m13 = this[ 2], m14 = this[ 3];
        const m21 = this[ 4], m22 = this[ 5], m23 = this[ 6], m24 = this[ 7];
        const m31 = this[ 8], m32 = this[ 9], m33 = this[10], m34 = this[11];
        const m41 = this[12], m42 = this[13], m43 = this[14], m44 = this[15];

        const m11m22 = m11 * m22, m11m23 = m11 * m23, m11m24 = m11 * m24, m12m21 = m12 * m21;
        const m12m23 = m12 * m23, m12m24 = m12 * m24, m13m21 = m13 * m21, m13m22 = m13 * m22;
        const m13m24 = m13 * m24, m14m21 = m14 * m21, m14m22 = m14 * m22, m14m23 = m14 * m23;
        const m31m42 = m31 * m42, m31m43 = m31 * m43, m31m44 = m31 * m44, m32m41 = m32 * m41;
        const m32m43 = m32 * m43, m32m44 = m32 * m44, m33m41 = m33 * m41, m33m42 = m33 * m42;
        const m33m44 = m33 * m44, m34m41 = m34 * m41, m34m42 = m34 * m42, m34m43 = m34 * m43;

        this[ 0] = m34m42 * m23 - m33m42 * m24 + m32m43 * m24 - m34m43 * m22 - m32m44 * m23 + m33m44 * m22;
        this[ 1] = m33m41 * m24 - m34m41 * m23 - m31m43 * m24 + m34m43 * m21 + m31m44 * m23 - m33m44 * m21;
        this[ 2] = m34m41 * m22 - m32m41 * m24 + m31m42 * m24 - m34m42 * m21 - m31m44 * m22 + m32m44 * m21;
        this[ 3] = m32m41 * m23 - m33m41 * m22 - m31m42 * m23 + m33m42 * m21 + m31m43 * m22 - m32m43 * m21;
        this[ 4] = m33m42 * m14 - m34m42 * m13 - m32m43 * m14 + m34m43 * m12 + m32m44 * m13 - m33m44 * m12;
        this[ 5] = m34m41 * m13 - m33m41 * m14 + m31m43 * m14 - m34m43 * m11 - m31m44 * m13 + m33m44 * m11;
        this[ 6] = m32m41 * m14 - m34m41 * m12 - m31m42 * m14 + m34m42 * m11 + m31m44 * m12 - m32m44 * m11;
        this[ 7] = m33m41 * m12 - m32m41 * m13 + m31m42 * m13 - m33m42 * m11 - m31m43 * m12 + m32m43 * m11;
        this[ 8] = m13m24 * m42 - m14m23 * m42 + m14m22 * m43 - m12m24 * m43 - m13m22 * m44 + m12m23 * m44;
        this[ 9] = m14m23 * m41 - m13m24 * m41 - m14m21 * m43 + m11m24 * m43 + m13m21 * m44 - m11m23 * m44;
        this[10] = m12m24 * m41 - m14m22 * m41 + m14m21 * m42 - m11m24 * m42 - m12m21 * m44 + m11m22 * m44;
        this[11] = m13m22 * m41 - m12m23 * m41 - m13m21 * m42 + m11m23 * m42 + m12m21 * m43 - m11m22 * m43;
        this[12] = m14m23 * m32 - m13m24 * m32 - m14m22 * m33 + m12m24 * m33 + m13m22 * m34 - m12m23 * m34;
        this[13] = m13m24 * m31 - m14m23 * m31 + m14m21 * m33 - m11m24 * m33 - m13m21 * m34 + m11m23 * m34;
        this[14] = m14m22 * m31 - m12m24 * m31 - m14m21 * m32 + m11m24 * m32 + m12m21 * m34 - m11m22 * m34;
        this[15] = m12m23 * m31 - m13m22 * m31 + m13m21 * m32 - m11m23 * m32 - m12m21 * m33 + m11m22 * m33;

        return this;
    }

    /**
     * Translates this matrix by the specified values.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     * @param dz - The Z translation.
     */
    public translate(dx: number, dy: number, dz: number): this {
        this[12] += dx * this[0] + dy * this[4] + dz * this[8];
        this[13] += dx * this[1] + dy * this[5] + dz * this[9];
        this[14] += dx * this[2] + dy * this[6] + dz * this[10];
        this[15] += dx * this[3] + dy * this[7] + dz * this[11];
        return this;
    }

    /**
     * Sets matrix to a translation matrix.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     * @param dz - The Z translation.
     */
    public setTranslation(dx: number, dy: number, dz: number): this {
        this[ 0] =  1; this[ 1] =  0; this[ 2] =  0; this[ 3] = 0;
        this[ 4] =  0; this[ 5] =  1; this[ 6] =  0; this[ 7] = 0;
        this[ 8] =  0; this[ 9] =  0; this[10] =  1; this[11] = 0;
        this[12] = dx; this[13] = dy; this[14] = dz; this[15] = 1;
        return this;
    }

    /**
     * Creates matrix initialized to a translation matrix.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     * @param dz - The Z translation.
     */
    public static createTranslation(dx: number, dy: number, dz: number): Matrix4 {
        return new Matrix4().setTranslation(dx, dy, dz);
    }

    /**
     * Translates this matrix by the specified X delta.
     *
     * @param d - The X translation delta.
     */
    public translateX(d: number): this {
        this[12] += d * this[0];
        this[13] += d * this[1];
        this[14] += d * this[2];
        this[15] += d * this[3];
        return this;
    }

    /**
     * Translates this matrix by the specified Y delta.
     *
     * @param d - The Y translation delta.
     */
    public translateY(d: number): this {
        this[12] += d * this[4];
        this[13] += d * this[5];
        this[14] += d * this[6];
        this[15] += d * this[7];
        return this;
    }

    /**
     * Translates this matrix by the specified Z delta.
     *
     * @param d - The translation delta.
     */
    public translateZ(d: number): this {
        this[12] += d * this[ 8];
        this[13] += d * this[ 9];
        this[14] += d * this[10];
        this[15] += d * this[11];
        return this;
    }

    /**
     * Scales this matrix by the specified factors.
     *
     * @param sx - The X scale factor.
     * @param sy - Optional Y scale factor. Defaults to X scale factor.
     * @param sz - Optional Z scale factor. Defaults to X scale factor.
     */
    public scale(sx: number, sy = sx, sz = sx): this {
        this[ 0] *= sx;
        this[ 1] *= sx;
        this[ 2] *= sx;
        this[ 3] *= sx;
        this[ 4] *= sy;
        this[ 5] *= sy;
        this[ 6] *= sy;
        this[ 7] *= sy;
        this[ 8] *= sz;
        this[ 9] *= sz;
        this[10] *= sz;
        this[11] *= sz;
        return this;
    }

    /**
     * Sets matrix to a scale matrix.
     *
     * @param sx - The X scale factor.
     * @param sy - Optional Y scale factor. Defaults to X scale factor.
     * @param sz - Optional Z scale factor. Defaults to X scale factor.
     */
    public setScale(sx: number, sy = sx, sz = sx): this {
        this[ 0] = sx; this[ 1] =  0; this[ 2] =  0; this[ 3] = 0;
        this[ 4] =  0; this[ 5] = sy; this[ 6] =  0; this[ 7] = 0;
        this[ 8] =  0; this[ 9] =  0; this[10] = sz; this[11] = 0;
        this[12] =  0; this[13] =  0; this[14] =  0; this[15] = 1;
        return this;
    }

    /**
     * Creates matrix initialized to a scale matrix.
     *
     * @param sx - The X scale factor.
     * @param sy - The Y scale factor. Defaults to X scale factor.
     * @param sz - Optional Z scale factor. Defaults to X scale factor.
     */
    public static createScale(sx: number, sy?: number, sz?: number): Matrix4 {
        return new Matrix4().setScale(sx, sy, sz);
    }

    /**
     * Scales this matrix by the specified factor along the X axis.
     *
     * @param s - The scale factor.
     */
    public scaleX(s: number): this {
        this[0] *= s;
        this[1] *= s;
        this[2] *= s;
        this[3] *= s;
        return this;
    }

    /**
     * Returns the X scale factor of the matrix.
     *
     * @return The X scale factor of the matrix.
     */
    public getScaleX(): number {
        return Math.hypot(this[0], this[4], this[8]);
    }

    /**
     * Scales this matrix by the specified factor along the Y axis.
     *
     * @param s - The scale factor.
     */
    public scaleY(s: number): this {
        this[4] *= s;
        this[5] *= s;
        this[6] *= s;
        this[7] *= s;
        return this;
    }

    /**
     * Returns the Y scale factor of the matrix.
     *
     * @return The Y scale factor of the matrix.
     */
    public getScaleY(): number {
        return Math.hypot(this[1], this[5], this[9]);
    }

    /**
     * Scales this matrix by the specified factor along the Z axis.
     *
     * @param s - The scale factor.
     */
    public scaleZ(s: number): this {
        this[ 8] *= s;
        this[ 9] *= s;
        this[10] *= s;
        this[11] *= s;
        return this;
    }

    /**
     * Returns the Z scale factor of the matrix.
     *
     * @return The Z scale factor of the matrix.
     */
    public getScaleZ(): number {
        return Math.hypot(this[2], this[6], this[10]);
    }

    /**
     * Rotates this matrix around the specified axis.
     *
     * @param angle - The rotation angle in RAD.
     * @param axis  - The normalized rotation axis.
     */
    public rotate(angle: number, axis: ReadonlyVectorLike<3>): this {
        const a11 = this[ 0], a12 = this[ 1], a13 = this[ 2], a14 = this[ 3];
        const a21 = this[ 4], a22 = this[ 5], a23 = this[ 6], a24 = this[ 7];
        const a31 = this[ 8], a32 = this[ 9], a33 = this[10], a34 = this[11];

        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const x = axis[0];
        const y = axis[1];
        const z = axis[2];
        const len = Math.hypot(x, y, z);
        const nx = x / len;
        const ny = y / len;
        const nz = z / len;
        const t = 1 - c;
        const xt = nx * t;
        const yt = ny * t;
        const zt = nz * t;
        const xs = nx * s;
        const ys = ny * s;
        const zs = nz * s;

        const b11 = nx * xt + c;
        const b12 = ny * xt + zs;
        const b13 = nz * xt - ys;
        const b21 = nx * yt - zs;
        const b22 = ny * yt + c;
        const b23 = nz * yt + xs;
        const b31 = nx * zt + ys;
        const b32 = ny * zt - xs;
        const b33 = nz * zt + c;

        this[ 0] = a11 * b11 + a21 * b12 + a31 * b13;
        this[ 1] = a12 * b11 + a22 * b12 + a32 * b13;
        this[ 2] = a13 * b11 + a23 * b12 + a33 * b13;
        this[ 3] = a14 * b11 + a24 * b12 + a34 * b13;
        this[ 4] = a11 * b21 + a21 * b22 + a31 * b23;
        this[ 5] = a12 * b21 + a22 * b22 + a32 * b23;
        this[ 6] = a13 * b21 + a23 * b22 + a33 * b23;
        this[ 7] = a14 * b21 + a24 * b22 + a34 * b23;
        this[ 8] = a11 * b31 + a21 * b32 + a31 * b33;
        this[ 9] = a12 * b31 + a22 * b32 + a32 * b33;
        this[10] = a13 * b31 + a23 * b32 + a33 * b33;
        this[11] = a14 * b31 + a24 * b32 + a34 * b33;

        return this;
    }

    /**
     * Rotates this matrix around the specified axis.
     *
     * @param angle - The rotation angle in RAD.
     * @param axis  - The normalized rotation axis.
     */
    public setRotation(angle: number, axis: ReadonlyVectorLike<3>): this {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const x = axis[0];
        const y = axis[1];
        const z = axis[2];
        const len = Math.hypot(x, y, z);
        const nx = x / len;
        const ny = y / len;
        const nz = z / len;
        const t = 1 - c;
        const xt = nx * t;
        const yt = ny * t;
        const zt = nz * t;
        const xs = nx * s;
        const ys = ny * s;
        const zs = nz * s;

        this[ 0] = nx * xt + c;  this[ 1] = ny * xt + zs; this[ 2] = nz * xt - ys; this[ 3] = 0;
        this[ 4] = nx * yt - zs; this[ 5] = ny * yt + c;  this[ 6] = nz * yt + xs; this[ 7] = 0;
        this[ 8] = nx * zt + ys; this[ 9] = ny * zt - xs; this[10] = nz * zt + c;  this[11] = 0;
        this[12] = 0;            this[13] = 0;            this[14] = 0;            this[15] = 1;

        return this;
    }

    /**
     * Create new matrix initialized to a rotation matrix around the given axis.
     *
     * @param angle - The rotation angle in RAD.
     * @param axis  - The normalized rotation axis.
     */
    public static createRotation(angle: number, axis: ReadonlyVectorLike<3>): Matrix4 {
        return new Matrix4().setRotation(angle, axis);
    }

    /**
     * Rotates this matrix by the specified angle around the X axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public rotateX(angle: number): this {
        const s = Math.sin(angle), c = Math.cos(angle);
        const m21 = this[ 4], m22 = this[ 5], m23 = this[ 6], m24 = this[ 7];
        const m31 = this[ 8], m32 = this[ 9], m33 = this[10], m34 = this[11];
        this[ 4] = m21 * c + m31 * s;
        this[ 5] = m22 * c + m32 * s;
        this[ 6] = m23 * c + m33 * s;
        this[ 7] = m24 * c + m34 * s;
        this[ 8] = m21 * -s + m31 * c;
        this[ 9] = m22 * -s + m32 * c;
        this[10] = m23 * -s + m33 * c;
        this[11] = m24 * -s + m34 * c;
        return this;
    }

    /**
     * Sets rotation matrix around the X axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public setXRotation(angle: number): this {
        const s = Math.sin(angle), c = Math.cos(angle);
        this[ 0] = 1; this[ 1] =  0; this[ 2] =  0; this[ 3] = 0;
        this[ 4] = 0; this[ 5] =  c; this[ 6] =  s; this[ 7] = 0;
        this[ 8] = 0; this[ 9] = -s; this[10] =  c; this[11] = 0;
        this[12] = 0; this[13] =  0; this[14] =  0; this[15] = 1;
        return this;
    }

    /**
     * Create new matrix initialized to a rotation matrix around the X axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public static createXRotation(angle: number): Matrix4 {
        return new Matrix4().setXRotation(angle);
    }

    /**
     * Rotates this matrix by the specified angle around the Y axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public rotateY(angle: number): this {
        const s = Math.sin(angle), c = Math.cos(angle);
        const m11 = this[ 0], m12 = this[ 1], m13 = this[ 2], m14 = this[ 3];
        const m31 = this[ 8], m32 = this[ 9], m33 = this[10], m34 = this[11];
        this[ 0] = m11 * c + m31 * -s;
        this[ 1] = m12 * c + m32 * -s;
        this[ 2] = m13 * c + m33 * -s;
        this[ 3] = m14 * c + m34 * -s;
        this[ 8] = m11 * s + m31 * c;
        this[ 9] = m12 * s + m32 * c;
        this[10] = m13 * s + m33 * c;
        this[11] = m14 * s + m34 * c;
        return this;
    }

    /**
     * Sets rotation matrix around the Y axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public setYRotation(angle: number): this {
        const s = Math.sin(angle), c = Math.cos(angle);
        this[ 0] = c; this[ 1] = 0; this[ 2] = -s; this[ 3] = 0;
        this[ 4] = 0; this[ 5] = 1; this[ 6] =  0; this[ 7] = 0;
        this[ 8] = s; this[ 9] = 0; this[10] =  c; this[11] = 0;
        this[12] = 0; this[13] = 0; this[14] =  0; this[15] = 1;
        return this;
    }

    /**
     * Create new matrix initialized to a rotation matrix around the Y axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public static createYRotation(angle: number): Matrix4 {
        return new Matrix4().setYRotation(angle);
    }

    /**
     * Rotates this matrix by the specified angle around the Z axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public rotateZ(angle: number): this {
        const s = Math.sin(angle), c = Math.cos(angle);
        const m11 = this[0], m12 = this[1], m13 = this[2], m14 = this[3];
        const m21 = this[4], m22 = this[5], m23 = this[6], m24 = this[7];
        this[0] = m11 * c + m21 * s;
        this[1] = m12 * c + m22 * s;
        this[2] = m13 * c + m23 * s;
        this[3] = m14 * c + m24 * s;
        this[4] = m11 * -s + m21 * c;
        this[5] = m12 * -s + m22 * c;
        this[6] = m13 * -s + m23 * c;
        this[7] = m14 * -s + m24 * c;
        return this;
    }

    /**
     * Sets rotation matrix around the Z axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public setZRotation(angle: number): this {
        const s = Math.sin(angle), c = Math.cos(angle);
        this[ 0] =  c; this[ 1] = s; this[ 2] = 0; this[ 3] = 0;
        this[ 4] = -s; this[ 5] = c; this[ 6] = 0; this[ 7] = 0;
        this[ 8] =  0; this[ 9] = 0; this[10] = 1; this[11] = 0;
        this[12] =  0; this[13] = 0; this[14] = 0; this[15] = 1;
        return this;
    }

    /**
     * Create new matrix initialized to a rotation matrix around the Z axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public static createZRotation(angle: number): Matrix4 {
        return new Matrix4().setZRotation(angle);
    }
}
