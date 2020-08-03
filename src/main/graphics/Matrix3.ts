/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { Serializable } from "../lang/Serializable";
import { AbstractMatrix } from "./AbstractMatrix";
import { Matrix, MatrixLike, ReadonlyMatrixLike } from "./Matrix";
import { ReadonlyVectorLike } from "./Vector";
import { Vector4 } from "./Vector4";

/**
 * JSON representation of a matrix with 9 floating point components.
 */
export type Matrix3JSON = [
    number, number, number,
    number, number, number,
    number, number, number
];

export type Matrix3Like = MatrixLike<3, 3>;

/**
 * 3x3 matrix using 32 bit floating point components.
 */
export class Matrix3 extends AbstractMatrix<9> implements Matrix<3, 3>, Serializable<Matrix3JSON>,
        Cloneable<Matrix3> {
    /** The number of columns. */
    public readonly columns: 3;

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
    public constructor(...components: Matrix3JSON);

    /**
     * Creates a new matrix with the component values copied from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public constructor(...columns: [ ReadonlyVectorLike<3>, ReadonlyVectorLike<3>, ReadonlyVectorLike<3> ])

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
            super(9);
            this[0] = this[4] = this[8] = 1;
        } else if (AbstractMatrix.isInitFromMatrix(args)) {
            super(9);
            this[0] = this[4] = this[8] = 1;
            const arg = args[0];
            const argColumns = arg.columns;
            const columns = Math.min(3, argColumns);
            const rows = Math.min(3, arg.rows);
            for (let x = 0; x < columns; ++x) {
                for (let y = 0; y < rows; ++y) {
                    this[x + y * 3] = arg[x + y * argColumns];
                }
            }
        } else if (AbstractMatrix.isInitFromArrayBuffer(args)) {
            super(args[0], args[1] ?? 0, 9);
        } else {
            super(9);
            this.setValues(args);
        }
        this.columns = 3;
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

    /** Matrix component at row 1 column 3. */
    public get m31(): number {
        return this[6];
    }
    public set m31(v: number) {
        this[6] = v;
    }

    /** Matrix component at row 2 column 3. */
    public get m32(): number {
        return this[7];
    }
    public set m32(v: number) {
        this[7] = v;
    }

    /** Matrix component at row 3 column 3. */
    public get m33(): number {
        return this[8];
    }
    public set m33(v: number) {
        this[8] = v;
    }

    /**
     * Sets the matrix component values.
     *
     * @param components - The component values to set.
     */
    public set(...components: Matrix3JSON): this;

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
    public set(...columns: [ ReadonlyVectorLike<3>, ReadonlyVectorLike<3>, ReadonlyVectorLike<3> ]): this;

    public set(...args: Array<number | ReadonlyVectorLike> | [ ReadonlyMatrixLike ]): this {
        if (AbstractMatrix.isInitFromMatrix(args)) {
            this.reset();
            const arg = args[0];
            const argColumns = arg.columns;
            const columns = Math.min(3, argColumns);
            const rows = Math.min(3, arg.rows);
            for (let x = 0; x < columns; ++x) {
                for (let y = 0; y < rows; ++y) {
                    this[x + y * 3] = arg[x + y * argColumns];
                }
            }
            return this;
        } else {
            return this.setValues(args);
        }
    }

    /**
     * Creates a result matrix initialized with the given component values. This is used internally to create result
     * matrices returned by the various methods.
     *
     * @param result - The result matrix to re-use. A new one is created when undefined
     * @param m11    - Matrix component at row 1 column 1.
     * @param m12    - Matrix component at row 2 column 1.
     * @param m13    - Matrix component at row 3 column 1.
     * @param m21    - Matrix component at row 1 column 2.
     * @param m22    - Matrix component at row 2 column 2.
     * @param m23    - Matrix component at row 3 column 2.
     * @param m31    - Matrix component at row 1 column 3.
     * @param m32    - Matrix component at row 2 column 3.
     * @param m33    - Matrix component at row 3 column 3.
     * @return The result matrix. Either a new one or the specified result matrix.
     * @hidden
     */
    public static createResult<T extends Matrix3Like = Matrix3>(result: T | undefined,
                m11: number, m12: number, m13: number,
                m21: number, m22: number, m23: number,
                m31: number, m32: number, m33: number
            ): T {
        if (result != null) {
            result[0] = m11; result[1] = m12; result[2] = m13;
            result[3] = m21; result[4] = m22; result[5] = m23;
            result[6] = m31; result[7] = m32; result[8] = m33;
            return result;
        } else {
            return new Matrix3(
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33
            ) as unknown as T;
        }
    }

    /**
     * Creates a new matrix from the given JSON array.
     *
     * @param components - Array with the 9 matrix components.
     * @return The created matrix.
     */
    public static fromJSON(components: Matrix3JSON): Matrix3 {
        return new Matrix3(...components);
    }

    /** @inheritDoc */
    public clone(): Matrix3 {
        return new Matrix3(this);
    }

    /** @inheritDoc */
    public toJSON(fractionDigits?: number): Matrix3JSON {
        if (fractionDigits != null) {
            return [
                +this[0].toFixed(fractionDigits), +this[1].toFixed(fractionDigits), +this[2].toFixed(fractionDigits),
                +this[3].toFixed(fractionDigits), +this[4].toFixed(fractionDigits), +this[5].toFixed(fractionDigits),
                +this[6].toFixed(fractionDigits), +this[7].toFixed(fractionDigits), +this[8].toFixed(fractionDigits)
            ];
        } else {
            return [
                this[0], this[1], this[2],
                this[3], this[4], this[5],
                this[6], this[7], this[8]
            ];
        }
    }

    /**
     * Checks if the given matrix is equal to this one. By default the values are checked for exact matches. Use
     * the optional `fractionDigits` parameter to specify the compare precision.
     *
     * @param object         - The object to check for equality.
     * @param fractionDigits - Optional parameter specifying the number of fraction digits to compare for the
     *                         equality check.
     * @return True if object is equal, false if not.
     */
    public equals(obj: unknown, fractionDigits?: number): boolean {
        const other = obj as Matrix3;
        if (obj == null || other.equals !== this.equals) {
            return false;
        }
        if (fractionDigits != null) {
            return this.every((value, index) => value.toFixed(fractionDigits) === other[index].toFixed(fractionDigits));
        } else {
            return this.every((value, index) => value === other[index]);
        }
    }

    /** @inheritDoc */
    public isIdentity(): boolean {
        return this[0] === 1 && this[1] === 0 && this[2] === 0
            && this[3] === 0 && this[4] === 1 && this[5] === 0
            && this[6] === 0 && this[7] === 0 && this[8] === 1;
    }

    /** @inheritDoc */
    public reset(): this {
        this[0] = 1; this[1] = 0; this[2] = 0;
        this[3] = 0; this[4] = 1; this[5] = 0;
        this[6] = 0; this[7] = 0; this[8] = 1;
        return this;
    }

    /** @inheritDoc */
    public add<T extends Matrix3Like = Matrix3>(summand: number, result?: T): T;

    /** @inheritDoc */
    public add<T extends Matrix3Like = Matrix3>(matrix: ReadonlyMatrixLike<3, 3>, result?: T): T;

    public add<T extends Matrix3Like = Matrix3>(arg: number | ReadonlyMatrixLike<3, 3>, result?: T): T {
        if (typeof arg === "number") {
            return Matrix3.createResult(result,
                this[0] + arg, this[1] + arg, this[2] + arg,
                this[3] + arg, this[4] + arg, this[5] + arg,
                this[6] + arg, this[7] + arg, this[8] + arg
            );
        } else {
            return Matrix3.createResult(result,
                this[0] + arg[0], this[1] + arg[1], this[2] + arg[2],
                this[3] + arg[3], this[4] + arg[4], this[5] + arg[5],
                this[6] + arg[6], this[7] + arg[7], this[8] + arg[8]
            );
        }
    }

    /** @inheritDoc */
    public sub<T extends Matrix3Like = Matrix3>(subtrahend: number, result?: T): T;

    /** @inheritDoc */
    public sub<T extends Matrix3Like = Matrix3>(matrix: ReadonlyMatrixLike<3, 3>, result?: T): T;

    public sub<T extends Matrix3Like = Matrix3>(arg: number | ReadonlyMatrixLike<3, 3>, result?: T): T {
        if (typeof arg === "number") {
            return Matrix3.createResult(result,
                this[0] - arg, this[1] - arg, this[2] - arg,
                this[3] - arg, this[4] - arg, this[5] - arg,
                this[6] - arg, this[7] - arg, this[8] - arg
            );
        } else {
            return Matrix3.createResult(result,
                this[0] - arg[0], this[1] - arg[1], this[2] - arg[2],
                this[3] - arg[3], this[4] - arg[4], this[5] - arg[5],
                this[6] - arg[6], this[7] - arg[7], this[8] - arg[8]
            );
        }
    }

    /** @inheritDoc */
    public compMul<T extends Matrix3Like = Matrix3>(matrix: ReadonlyMatrixLike<3, 3>, result?: T): T;

    /** @inheritDoc */
    public compMul<T extends Matrix3Like = Matrix3>(factor: number): this;

    public compMul<T extends Matrix3Like = Matrix3>(arg: ReadonlyMatrixLike<3, 3> | number, result?: T): T {
        if (typeof arg === "number") {
            return Matrix3.createResult(result,
                this[0] * arg, this[1] * arg, this[2] * arg,
                this[3] * arg, this[4] * arg, this[5] * arg,
                this[6] * arg, this[7] * arg, this[8] * arg
            );
        } else {
            return Matrix3.createResult(result,
                this[0] * arg[0], this[1] * arg[1], this[2] * arg[2],
                this[3] * arg[3], this[4] * arg[4], this[5] * arg[5],
                this[6] * arg[6], this[7] * arg[7], this[8] * arg[8]
            );
        }
    }

    /** @inheritDoc */
    public compDiv<T extends Matrix3Like = Matrix3>(matrix: ReadonlyMatrixLike<3, 3>, result?: T): T;

    /** @inheritDoc */
    public compDiv<T extends Matrix3Like = Matrix3>(divisor: number, result?: T): T;

    public compDiv<T extends Matrix3Like = Matrix3>(arg: ReadonlyMatrixLike<3, 3> | number, result?: T): T {
        if (typeof arg === "number") {
            return Matrix3.createResult(result,
                this[0] / arg, this[1] / arg, this[2] / arg,
                this[3] / arg, this[4] / arg, this[5] / arg,
                this[6] / arg, this[7] / arg, this[8] / arg
            );
        } else {
            return Matrix3.createResult(result,
                this[0] / arg[0], this[1] / arg[1], this[2] / arg[2],
                this[3] / arg[3], this[4] / arg[4], this[5] / arg[5],
                this[6] / arg[6], this[7] / arg[7], this[8] / arg[8]
            );
        }
    }

    /** @inheritDoc */
    public mul<T extends Matrix3Like = Matrix3>(other: ReadonlyMatrixLike<3, 3>, result?: T): T {
        const a11 = this[0], a12 = this[1], a13 = this[2];
        const a21 = this[3], a22 = this[4], a23 = this[5];
        const a31 = this[6], a32 = this[7], a33 = this[8];
        const b11 = other[0], b12 = other[1], b13 = other[2];
        const b21 = other[3], b22 = other[4], b23 = other[5];
        const b31 = other[6], b32 = other[7], b33 = other[8];
        return Matrix3.createResult(result,
            a11 * b11 + a21 * b12 + a31 * b13,
            a12 * b11 + a22 * b12 + a32 * b13,
            a13 * b11 + a23 * b12 + a33 * b13,

            a11 * b21 + a21 * b22 + a31 * b23,
            a12 * b21 + a22 * b22 + a32 * b23,
            a13 * b21 + a23 * b22 + a33 * b23,

            a11 * b31 + a21 * b32 + a31 * b33,
            a12 * b31 + a22 * b32 + a32 * b33,
            a13 * b31 + a23 * b32 + a33 * b33
        );
    }

    /** @inheritDoc */
    public div<T extends Matrix3Like = Matrix3>(other: ReadonlyMatrixLike<3, 3>, result?: T): T {
        const a11 = this[0], a12 = this[1], a13 = this[2];
        const a21 = this[3], a22 = this[4], a23 = this[5];
        const a31 = this[6], a32 = this[7], a33 = this[8];
        const b11 = other[0], b12 = other[1], b13 = other[2];
        const b21 = other[3], b22 = other[4], b23 = other[5];
        const b31 = other[6], b32 = other[7], b33 = other[8];

        const b11b22 = b11 * b22;
        const b11b32 = b11 * b32;
        const b21b32 = b21 * b32;
        const b21b12 = b21 * b12;
        const b31b12 = b31 * b12;
        const b31b22 = b31 * b22;

        // d = determinant(b)
        const d = b11b22 * b33 + b21b32 * b13 + b31b12 * b23 - b11b32 * b23 - b21b12 * b33 - b31b22 * b13;

        // c = invert(b)
        const c11 = (b22 * b33 - b32 * b23) / d;
        const c12 = (b32 * b13 - b12 * b33) / d;
        const c13 = (b12 * b23 - b22 * b13) / d;
        const c21 = (b31 * b23 - b21 * b33) / d;
        const c22 = (b11 * b33 - b31 * b13) / d;
        const c23 = (b21 * b13 - b11 * b23) / d;
        const c31 = (b21b32 - b31b22) / d;
        const c32 = (b31b12 - b11b32) / d;
        const c33 = (b11b22 - b21b12) / d;

        // result = this * c
        return Matrix3.createResult(result,
            a11 * c11 + a21 * c12 + a31 * c13,
            a12 * c11 + a22 * c12 + a32 * c13,
            a13 * c11 + a23 * c12 + a33 * c13,
            a11 * c21 + a21 * c22 + a31 * c23,
            a12 * c21 + a22 * c22 + a32 * c23,
            a13 * c21 + a23 * c22 + a33 * c23,
            a11 * c31 + a21 * c32 + a31 * c33,
            a12 * c31 + a22 * c32 + a32 * c33,
            a13 * c31 + a23 * c32 + a33 * c33
        );
    }

    /** @inheritDoc */
    public getDeterminant(): number {
        const m11 = this[0], m12 = this[1], m13 = this[2];
        const m21 = this[3], m22 = this[4], m23 = this[5];
        const m31 = this[6], m32 = this[7], m33 = this[8];
        return m11 * m22 * m33 + m21 * m32 * m13 + m31 * m12 * m23
             - m11 * m32 * m23 - m21 * m12 * m33 - m31 * m22 * m13;
    }

    /** @inheritDoc */
    public invert<T extends Matrix3Like = Matrix3>(result?: T): T {
        const m11 = this[0], m12 = this[1], m13 = this[2];
        const m21 = this[3], m22 = this[4], m23 = this[5];
        const m31 = this[6], m32 = this[7], m33 = this[8];

        const m11m22 = m11 * m22;
        const m11m32 = m11 * m32;
        const m21m32 = m21 * m32;
        const m21m12 = m21 * m12;
        const m31m12 = m31 * m12;
        const m31m22 = m31 * m22;

        const d = m11m22 * m33 + m21m32 * m13 + m31m12 * m23 - m11m32 * m23 - m21m12 * m33 - m31m22 * m13;

        return Matrix3.createResult(result,
            (m22 * m33 - m32 * m23) / d,
            (m32 * m13 - m12 * m33) / d,
            (m12 * m23 - m22 * m13) / d,
            (m31 * m23 - m21 * m33) / d,
            (m11 * m33 - m31 * m13) / d,
            (m21 * m13 - m11 * m23) / d,
            (m21m32 - m31m22) / d,
            (m31m12 - m11m32) / d,
            (m11m22 - m21m12) / d
        );
    }

    /** @inheritDoc */
    public transpose<T extends Matrix3Like = Matrix3>(result?: T): T {
        return Matrix3.createResult(result,
            this[0], this[3], this[6],
            this[1], this[4], this[7],
            this[2], this[5], this[8]
        );
    }

    /**
     * Converts this matrix into the "adjoint matrix".
     */
    public adjugate<T extends Matrix3Like = Matrix3>(result?: T): T {
        const m11 = this[0], m12 = this[1], m13 = this[2];
        const m21 = this[3], m22 = this[4], m23 = this[5];
        const m31 = this[6], m32 = this[7], m33 = this[8];
        return Matrix3.createResult(result,
            m22 * m33 - m32 * m23,
            m32 * m13 - m12 * m33,
            m12 * m23 - m22 * m13,
            m31 * m23 - m21 * m33,
            m11 * m33 - m31 * m13,
            m21 * m13 - m11 * m23,
            m21 * m32 - m31 * m22,
            m31 * m12 - m11 * m32,
            m11 * m22 - m21 * m12
        );
    }

    /**
     * Translates this matrix by the specified values.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     */
    public translate<T extends Matrix3Like = Matrix3>(dx: number, dy: number, result?: T): T {
        if (this.isResult(result)) {
            this[6] += dx * this[0] + dy * this[3];
            this[7] += dx * this[1] + dy * this[4];
            this[8] += dx * this[2] + dy * this[5];
            return this;
        } else {
            return Matrix3.createResult(result,
                this[0], this[1], this[2],
                this[3], this[4], this[5],
                this[6] + dx * this[0] + dy * this[3],
                this[7] + dx * this[1] + dy * this[4],
                this[8] + dx * this[2] + dy * this[5]
            );
        }
    }

    /**
     * Translates this matrix by the specified X delta.
     *
     * @param d - The X translation delta.
     */
    public translateX<T extends Matrix3Like = Matrix3>(d: number, result?: T): T {
        if (this.isResult(result)) {
            this[6] += d * this[0];
            this[7] += d * this[1];
            this[8] += d * this[2];
            return this;
        } else {
            return Matrix3.createResult(result,
                this[0], this[1], this[2],
                this[3], this[4], this[5],
                this[6] + d * this[0],
                this[7] + d * this[1],
                this[8] + d * this[2]
            );
        }
    }

    /**
     * Translates this matrix by the specified Y delta.
     *
     * @param d - The Y translation delta.
     */
    public translateY<T extends Matrix3Like = Matrix3>(d: number, result?: T): T {
        if (this.isResult(result)) {
            this[6] += d * this[3];
            this[7] += d * this[4];
            this[8] += d * this[5];
            return this;
        } else {
            return Matrix3.createResult(result,
                this[0], this[1], this[2],
                this[3], this[4], this[5],
                this[6] + d * this[3],
                this[7] + d * this[4],
                this[8] + d * this[5]
            );
        }
    }

    /**
     * Scales this matrix by the specified factor.
     *
     * @param s - The scale factor.
     */
    public scale<T extends Matrix3Like = Matrix3>(s: number, result?: T): T {
        if (this.isResult(result)) {
            this[0] *= s;
            this[1] *= s;
            this[2] *= s;
            this[3] *= s;
            this[4] *= s;
            this[5] *= s;
            return this;
        } else {
            return Matrix3.createResult(result,
                this[0] * s, this[1] * s, this[2] * s,
                this[3] * s, this[4] * s, this[5] * s,
                this[6],     this[7],     this[8]
            );
        }
    }

    /**
     * Scales this matrix by the specified factors.
     *
     * @param sx - The X scale factor.
     * @param sy - The Y scale factor.
     */
    public scaleXY<T extends Matrix3Like = Matrix3>(sx: number, sy: number, result?: T): T {
        if (this.isResult(result)) {
            this[0] *= sx;
            this[1] *= sx;
            this[2] *= sx;
            this[3] *= sy;
            this[4] *= sy;
            this[5] *= sy;
            return this;
        } else {
            return Matrix3.createResult(result,
                this[0] * sx, this[1] * sx, this[2] * sx,
                this[3] * sy, this[4] * sy, this[5] * sy,
                this[6],      this[7],      this[8]
            );
        }
    }

    /**
     * Scales this matrix by the specified factor along the X axis.
     *
     * @param s - The scale factor.
     */
    public scaleX<T extends Matrix3Like = Matrix3>(s: number, result?: T): T {
        if (this.isResult(result)) {
            this[ 0] *= s;
            this[ 1] *= s;
            this[ 2] *= s;
            return this;
        } else {
            return Matrix3.createResult(result,
                this[0] * s, this[1] * s, this[2] * s,
                this[3],     this[4],     this[5],
                this[6],     this[7],     this[8]
            );
        }
    }

    /**
     * Scales this matrix by the specified factor along the Y axis.
     *
     * @param s - The scale factor.
     */
    public scaleY<T extends Matrix3Like = Matrix3>(s: number, result?: T): T {
        if (this.isResult(result)) {
            this[3] *= s;
            this[4] *= s;
            this[5] *= s;
            return this;
        } else {
            return Matrix3.createResult(result,
                this[0] * s, this[1] * s, this[2] * s,
                this[3] * s, this[4] * s, this[5] * s,
                this[6],     this[7],     this[8]
            );
        }
    }

    /**
     * Rotates this matrix around the specified axis.
     *
     * @param angle - The rotation angle in RAD.
     * @param axis  - The normalized rotation axis.
     */
    public rotate(angle: number, axis: Vector4): this {
        console.log(angle, axis);
        /* TODO
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        const t = 1 - c;
        const tx = t * x;
        const txy = tx * y;
        const txz = tx * z;
        const ty = t * y;
        const tyz = ty * z;
        const ys = y * s;
        const zs = z * s;
        const xs = x * s;

        const m11 = this[ 0], m21 = this[ 4], m31 = this[ 8];
        const m12 = this[ 1], m22 = this[ 5], m32 = this[ 9];
        const m13 = this[ 2], m23 = this[ 6], m33 = this[10];
        const m14 = this[ 3], m24 = this[ 7], m34 = this[11];

        const n11 = tx * x + c, n21 = txy - zs,   n31 = txz + ys;
        const n12 = txy + zs,   n22 = ty * y + c, n32 = tyz - xs;
        const n13 = txz - ys,   n23 = tyz + xs,   n33 = t * z * z + c;

        this[ 0] = m11 * n11 + m21 * n12 + m31 * n13;
        this[ 1] = m12 * n11 + m22 * n12 + m32 * n13;
        this[ 2] = m13 * n11 + m23 * n12 + m33 * n13;
        this[ 3] = m14 * n11 + m24 * n12 + m34 * n13;
        this[ 4] = m11 * n21 + m21 * n22 + m31 * n23;
        this[ 5] = m12 * n21 + m22 * n22 + m32 * n23;
        this[ 6] = m13 * n21 + m23 * n22 + m33 * n23;
        this[ 7] = m14 * n21 + m24 * n22 + m34 * n23;
        this[ 8] = m11 * n31 + m21 * n32 + m31 * n33;
        this[ 9] = m12 * n31 + m22 * n32 + m32 * n33;
        this[10] = m13 * n31 + m23 * n32 + m33 * n33;
        this[11] = m14 * n31 + m24 * n32 + m34 * n33;
        */
        return this;
    }
}
