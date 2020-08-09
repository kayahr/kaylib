/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { IllegalArgumentException, IllegalStateException } from "../util/exception";
import { StrictArrayBufferLike } from "../util/types";
import { AbstractMatrix } from "./AbstractMatrix";
import { ReadonlySquareMatrixLike, SquareMatrix, SquareMatrixLike } from "./SquareMatrix";
import { ReadonlyVectorLike } from "./Vector";

/**
 * JSON representation of a matrix with 9 floating point components.
 */
export type Matrix3JSON = [
    number, number, number,
    number, number, number,
    number, number, number
];

export type Matrix3Like = SquareMatrixLike<3>;

/**
 * 3x3 matrix using 32 bit floating point components.
 */
export class Matrix3 extends AbstractMatrix<9> implements SquareMatrix<3>, Serializable<Matrix3JSON>,
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
     * Creates a new matrix initialized to the given component values.
     *
     * @param components - The component values.
     */
    public constructor(...components: Matrix3JSON);

    /**
     * Creates a new matrix using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: StrictArrayBufferLike, offset?: number);

    public constructor(...args: [] | Matrix3JSON | [ StrictArrayBufferLike, number? ]) {
        if (args.length === 0) {
            super(9);
            this[0] = this[4] = this[8] = 1;
        } else if (AbstractMatrix.isInitFromComponents(args)) {
            super(9);
            // Manually setting elements is much faster than passing them as array to Float32Array constructor
            this[0] = args[0]; this[1] = args[1]; this[2] = args[2];
            this[3] = args[3]; this[4] = args[4]; this[5] = args[5];
            this[6] = args[6]; this[7] = args[7]; this[8] = args[8];
        } else {
            super(args[0], args[1] ?? 0, 9);
        }
        this.columns = 3;
        this.rows = 3;
    }

    /**
     * Creates a new matrix with the component values copied from the given column vectors.
     *
     * @param c1 - The first column vector.
     * @param c2 - The first column vector.
     * @param c3 - The first column vector.
     * @return The created matrix.
     */
    public static fromColumns(c1: ReadonlyVectorLike<3>, c2: ReadonlyVectorLike<3>, c3: ReadonlyVectorLike<3>):
            Matrix3 {
        return new Matrix3(
            c1[0], c1[1], c1[2],
            c2[0], c2[1], c2[2],
            c3[0], c3[1], c3[2]
        );
    }

    /**
     * Creates a new matrix with the component values copied from the given row vectors.
     *
     * @param r1 - The first row vector.
     * @param r2 - The first row vector.
     * @param r3 - The first row vector.
     * @return The created matrix.
     */
    public static fromRows(r1: ReadonlyVectorLike<3>, r2: ReadonlyVectorLike<3>, r3: ReadonlyVectorLike<3>):
            Matrix3 {
        return new Matrix3(
            r1[0], r2[0], r3[0],
            r1[1], r2[1], r3[1],
            r1[2], r2[2], r3[2]
        );
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

    /**
     * Creates a new matrix from the given DOM matrix object.
     *
     * @aram domMatrix - The DOM matrix object. Must be a 2D matrix.
     * @return The created matrix.
     */
    public static fromDOMMatrix(domMatrix: DOMMatrix): Matrix3 {
        if (!domMatrix.is2D) {
            throw new IllegalArgumentException("Can only create Matrix3 from 2D DOMMatrix");
        }
        return new Matrix3(
            domMatrix.a, domMatrix.b, 0,
            domMatrix.c, domMatrix.d, 0,
            domMatrix.e, domMatrix.f, 1
        );
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
    public setComponents(...components: Matrix3JSON): this {
        this[0] = components[0]; this[1] = components[1]; this[2] = components[2];
        this[3] = components[3]; this[4] = components[4]; this[5] = components[5];
        this[6] = components[6]; this[7] = components[7]; this[8] = components[8];
        return this;
    }

    /**
     * Sets the component values by copying them from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public setColumns(c1: ReadonlyVectorLike<3>, c2: ReadonlyVectorLike<3>, c3: ReadonlyVectorLike<3>): this {
        this[0] = c1[0]; this[1] = c1[1]; this[2] = c1[2];
        this[3] = c2[0]; this[4] = c2[1]; this[5] = c2[2];
        this[6] = c3[0]; this[7] = c3[1]; this[8] = c3[2];
        return this;
    }

    /** @inheritDoc */
    public clone(): Matrix3 {
        return Matrix3.fromMatrix(this);
    }

    /** @inheritDoc */
    public toJSON(): Matrix3JSON {
        return [
            this[0], this[1], this[2],
            this[3], this[4], this[5],
            this[6], this[7], this[8]
        ];
    }

    /**
     * Converts this matrix into a DOM matrix. The matrix must be a 2D affine transformation so the last row must be
     * 0 0 1.
     *
     * @return The created DOM matrix.
     */
    public toDOMMatrix(): DOMMatrix {
        if (this[2] !== 0 || this[5] !== 0 || this[8] !== 1) {
            throw new IllegalStateException("Can only create DOMMatrix from Matrix3 2D affine transformation");
        }
        return new DOMMatrix([
            this[0], this[1],
            this[3], this[4],
            this[6], this[7]
        ]);
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.every((value, index) => value === other[index]));
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
    public add(summand: number): this;

    /** @inheritDoc */
    public add(matrix: ReadonlySquareMatrixLike<3>): this;

    public add(arg: number | ReadonlySquareMatrixLike<3>): this {
        if (typeof arg === "number") {
            this[0] += arg; this[1] += arg; this[2] += arg;
            this[3] += arg; this[4] += arg; this[5] += arg;
            this[6] += arg; this[7] += arg; this[8] += arg;
        } else {
            this[0] += arg[0]; this[1] += arg[1]; this[2] += arg[2];
            this[3] += arg[3]; this[4] += arg[4]; this[5] += arg[5];
            this[6] += arg[6]; this[7] += arg[7]; this[8] += arg[8];
        }
        return this;
    }

    /** @inheritDoc */
    public sub(subtrahend: number): this;

    /** @inheritDoc */
    public sub(matrix: ReadonlySquareMatrixLike<3>): this;

    public sub(arg: number | ReadonlySquareMatrixLike<3>): this {
        if (typeof arg === "number") {
            this[0] -= arg; this[1] -= arg; this[2] -= arg;
            this[3] -= arg; this[4] -= arg; this[5] -= arg;
            this[6] -= arg; this[7] -= arg; this[8] -= arg;
        } else {
            this[0] -= arg[0]; this[1] -= arg[1]; this[2] -= arg[2];
            this[3] -= arg[3]; this[4] -= arg[4]; this[5] -= arg[5];
            this[6] -= arg[6]; this[7] -= arg[7]; this[8] -= arg[8];
        }
        return this;
    }

    /** @inheritDoc */
    public compMul(matrix: ReadonlySquareMatrixLike<3>): this;

    /** @inheritDoc */
    public compMul(factor: number): this;

    public compMul(arg: ReadonlySquareMatrixLike<3> | number): this {
        if (typeof arg === "number") {
            this[0] *= arg; this[1] *= arg; this[2] *= arg;
            this[3] *= arg; this[4] *= arg; this[5] *= arg;
            this[6] *= arg; this[7] *= arg; this[8] *= arg;
        } else {
            this[0] *= arg[0]; this[1] *= arg[1]; this[2] *= arg[2];
            this[3] *= arg[3]; this[4] *= arg[4]; this[5] *= arg[5];
            this[6] *= arg[6]; this[7] *= arg[7]; this[8] *= arg[8];
        }
        return this;
    }

    /** @inheritDoc */
    public compDiv(matrix: ReadonlySquareMatrixLike<3>): this;

    /** @inheritDoc */
    public compDiv(divisor: number): this;

    public compDiv(arg: ReadonlySquareMatrixLike<3> | number): this {
        if (typeof arg === "number") {
            this[0] /= arg; this[1] /= arg; this[2] /= arg;
            this[3] /= arg; this[4] /= arg; this[5] /= arg;
            this[6] /= arg; this[7] /= arg; this[8] /= arg;
        } else {
            this[0] /= arg[0]; this[1] /= arg[1]; this[2] /= arg[2];
            this[3] /= arg[3]; this[4] /= arg[4]; this[5] /= arg[5];
            this[6] /= arg[6]; this[7] /= arg[7]; this[8] /= arg[8];
        }
        return this;
    }

    /** @inheritDoc */
    public mul(other: ReadonlySquareMatrixLike<3>): this {
        const a11 = this[0], a12 = this[1], a13 = this[2];
        const a21 = this[3], a22 = this[4], a23 = this[5];
        const a31 = this[6], a32 = this[7], a33 = this[8];
        const b11 = other[0], b12 = other[1], b13 = other[2];
        const b21 = other[3], b22 = other[4], b23 = other[5];
        const b31 = other[6], b32 = other[7], b33 = other[8];

        this[0] = a11 * b11 + a21 * b12 + a31 * b13;
        this[1] = a12 * b11 + a22 * b12 + a32 * b13;
        this[2] = a13 * b11 + a23 * b12 + a33 * b13;

        this[3] = a11 * b21 + a21 * b22 + a31 * b23;
        this[4] = a12 * b21 + a22 * b22 + a32 * b23;
        this[5] = a13 * b21 + a23 * b22 + a33 * b23;

        this[6] = a11 * b31 + a21 * b32 + a31 * b33;
        this[7] = a12 * b31 + a22 * b32 + a32 * b33;
        this[8] = a13 * b31 + a23 * b32 + a33 * b33;

        return this;
    }

    /** @inheritDoc */
    public div(other: ReadonlySquareMatrixLike<3>): this {
        // a = this, b = other
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

        // this = this * c
        this[0] = a11 * c11 + a21 * c12 + a31 * c13;
        this[1] = a12 * c11 + a22 * c12 + a32 * c13;
        this[2] = a13 * c11 + a23 * c12 + a33 * c13;
        this[3] = a11 * c21 + a21 * c22 + a31 * c23;
        this[4] = a12 * c21 + a22 * c22 + a32 * c23;
        this[5] = a13 * c21 + a23 * c22 + a33 * c23;
        this[6] = a11 * c31 + a21 * c32 + a31 * c33;
        this[7] = a12 * c31 + a22 * c32 + a32 * c33;
        this[8] = a13 * c31 + a23 * c32 + a33 * c33;

        return this;
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
    public invert(): this {
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

        this[0] = (m22 * m33 - m32 * m23) / d;
        this[1] = (m32 * m13 - m12 * m33) / d;
        this[2] = (m12 * m23 - m22 * m13) / d;
        this[3] = (m31 * m23 - m21 * m33) / d;
        this[4] = (m11 * m33 - m31 * m13) / d;
        this[5] = (m21 * m13 - m11 * m23) / d;
        this[6] = (m21m32 - m31m22) / d;
        this[7] = (m31m12 - m11m32) / d;
        this[8] = (m11m22 - m21m12) / d;

        return this;
    }

    /** @inheritDoc */
    public transpose(): this {
        const m12 = this[1], m13 = this[2], m23 = this[5];
        this[1] = this[3];
        this[2] = this[6];
        this[3] = m12;
        this[5] = this[7];
        this[6] = m13;
        this[7] = m23;
        return this;
    }

    /**
     * Converts this matrix into the "adjoint matrix".
     */
    public adjugate(): this {
        const m11 = this[0], m12 = this[1], m13 = this[2];
        const m21 = this[3], m22 = this[4], m23 = this[5];
        const m31 = this[6], m32 = this[7], m33 = this[8];
        this[0] = m22 * m33 - m32 * m23;
        this[1] = m32 * m13 - m12 * m33;
        this[2] = m12 * m23 - m22 * m13;
        this[3] = m31 * m23 - m21 * m33;
        this[4] = m11 * m33 - m31 * m13;
        this[5] = m21 * m13 - m11 * m23;
        this[6] = m21 * m32 - m31 * m22;
        this[7] = m31 * m12 - m11 * m32;
        this[8] = m11 * m22 - m21 * m12;
        return this;
    }

    /**
     * Translates this matrix by the specified values.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     */
    public translate(dx: number, dy: number): this {
        this[6] += dx * this[0] + dy * this[3];
        this[7] += dx * this[1] + dy * this[4];
        this[8] += dx * this[2] + dy * this[5];
        return this;
    }

    /**
     * Sets matrix to a translation matrix.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     */
    public setTranslation(dx: number, dy: number): this {
        this[0] =  1; this[1] =  0; this[2] = 0;
        this[3] =  0; this[4] =  1; this[5] = 0;
        this[6] = dx; this[7] = dy; this[8] = 1;
        return this;
    }

    /**
     * Creates matrix initialized to a translation matrix.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     */
    public static createTranslation(dx: number, dy: number): Matrix3 {
        return new Matrix3().setTranslation(dx, dy);
    }

    /**
     * Translates this matrix by the specified X delta.
     *
     * @param d - The X translation delta.
     */
    public translateX(d: number): this {
        this[6] += d * this[0];
        this[7] += d * this[1];
        this[8] += d * this[2];
        return this;
    }

    /**
     * Returns the X translation of the matrix.
     *
     * @return The X translation.
     */
    public getTranslationX(): number {
        return this[6];
    }

    /**
     * Translates this matrix by the specified Y delta.
     *
     * @param d - The Y translation delta.
     */
    public translateY(d: number): this {
        this[6] += d * this[3];
        this[7] += d * this[4];
        this[8] += d * this[5];
        return this;
    }

    /**
     * Returns the Y translation of the matrix.
     *
     * @return The Y translation.
     */
    public getTranslationY(): number {
        return this[7];
    }
    /**
     * Scales this matrix by the specified factor.
     *
     * @param sx - The horizontal scale factor.
     * @param sy - The vertical scale factor (Defaults to horizontal factor).
     */
    public scale(sx: number, sy = sx): this {
        this[0] *= sx;
        this[1] *= sx;
        this[2] *= sx;
        this[3] *= sy;
        this[4] *= sy;
        this[5] *= sy;
        return this;
    }

    /**
     * Sets matrix to a scale matrix.
     *
     * @param sx - The X scale factor.
     * @param sy - The Y scale factor. Defaults to X scale factor.
     */
    public setScale(sx: number, sy = sx): this {
        this[0] = sx; this[1] =  0; this[2] = 0;
        this[3] =  0; this[4] = sy; this[5] = 0;
        this[6] =  0; this[7] =  0; this[8] = 1;
        return this;
    }

    /**
     * Creates matrix initialized to a scale matrix.
     *
     * @param sx - The X scale factor.
     * @param sy - The Y scale factor. Defaults to X scale factor.
     */
    public static createScale(sx: number, sy?: number): Matrix3 {
        return new Matrix3().setScale(sx, sy);
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
        return this;
    }

    /**
     * Returns the X scale factor of the matrix.
     *
     * @return The X scale factor of the matrix.
     */
    public getScaleX(): number {
        return Math.hypot(this[0], this[3]);
    }

    /**
     * Scales this matrix by the specified factor along the Y axis.
     *
     * @param s - The scale factor.
     */
    public scaleY(s: number): this {
        this[3] *= s;
        this[4] *= s;
        this[5] *= s;
        return this;
    }

    /**
     * Returns the Y scale factor of the matrix.
     *
     * @return The Y scale factor of the matrix.
     */
    public getScaleY(): number {
        return Math.hypot(this[1], this[4]);
    }

    /**
     * Rotates this matrix around the specified axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public rotate(angle: number): this {
        const m11 = this[0], m12 = this[1], m13 = this[2];
        const m21 = this[3], m22 = this[4], m23 = this[5];
        const s = Math.sin(angle), c = Math.cos(angle);
        this[0] = c * m11 + s * m21;
        this[1] = c * m12 + s * m22;
        this[2] = c * m13 + s * m23;
        this[3] = c * m21 - s * m11;
        this[4] = c * m22 - s * m12;
        this[5] = c * m23 - s * m13;
        return this;
    }

    /**
     * Returns the rotation of this matrix in radians.
     *
     * @return The rotation angle in radians.
     */
    public getRotation(): number {
        const m11 = this[0], m12 = this[1];
        const m21 = this[3], m22 = this[4];
        if (m11 !== 0 || m21 !== 0) {
            const acos = Math.acos(m11 / Math.hypot(m11, m21));
            return m21 > 0 ? -acos : acos;
        } else if (m12 !== 0 || m22 !== 0) {
            const acos = Math.acos(m12 / Math.hypot(m12, m22));
            return Math.PI / 2 + (m22 > 0 ? -acos : acos);
        } else {
            return 0;
        }
    }

    /**
     * Sets matrix to a rotation matrix.
     *
     * @param angle - The rotation angle in RAD.
     */
    public setRotation(angle: number): this {
        const s = Math.sin(angle), c = Math.cos(angle);
        this[0] =  c; this[1] = s; this[2] = 0;
        this[3] = -s; this[4] = c; this[5] = 0;
        this[6] =  0; this[7] = 0; this[8] = 1;
        return this;
    }

    /**
     * Create new matrix initialized to a rotation matrix.
     *
     * @param angle - The rotation angle in RAD.
     */
    public static createRotation(angle: number): Matrix3 {
        return new Matrix3().setRotation(angle);
    }
}
