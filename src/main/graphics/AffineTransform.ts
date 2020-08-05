/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { AbstractMatrix } from "./AbstractMatrix";
import { MatrixLike, ReadonlyMatrixLike } from "./Matrix";
import { ReadonlyVectorLike } from "./Vector";
import { Vector4 } from "./Vector4";

/**
 * JSON representation of a matrix with 9 floating point components.
 */
export type AffineTransformJSON = [
    number, number, number,
    number, number, number,
];

/**
 * Affine transformation matrix. It behaves like a 3x3 matrix where the third row is always assumed to be 0 0 1.
 * This matrix is useful for 2D transformations and is compatible to the transformations done in a Canvas for example.
 */
export class AffineTransform extends AbstractMatrix<6> implements MatrixLike<3, 2>, Serializable<AffineTransformJSON>,
        Cloneable<AffineTransform> {
    /** The number of columns. */
    public readonly columns: 3;

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
    public constructor(...components: AffineTransformJSON);

    /**
     * Creates a new matrix with the component values copied from the given column vectors.
     *
     * @param columns - The column vectors.
     */
    public constructor(...columns: [ ReadonlyVectorLike<2>, ReadonlyVectorLike<2>, ReadonlyVectorLike<2> ]);

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
            this[0] = this[3] = 1;
        } else if (AbstractMatrix.isInitFromMatrix(args)) {
            super(6);
            const arg = args[0];
            const argRows = arg.rows;
            const argColumns = arg.columns;
            const columns = Math.min(3, argColumns);
            const rows = Math.min(2, argRows);
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
        this.columns = 3;
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

    /** Matrix component at row 1 column 1. */
    public get a(): number {
        return this[0];
    }
    public set a(v: number) {
        this[0] = v;
    }

    /** Matrix component at row 2 column 1. */
    public get b(): number {
        return this[1];
    }
    public set b(v: number) {
        this[1] = v;
    }

    /** Matrix component at row 1 column 2. */
    public get c(): number {
        return this[2];
    }
    public set c(v: number) {
        this[2] = v;
    }

    /** Matrix component at row 2 column 2. */
    public get d(): number {
        return this[3];
    }
    public set d(v: number) {
        this[3] = v;
    }

    /** Matrix component at row 1 column 3. */
    public get e(): number {
        return this[4];
    }
    public set e(v: number) {
        this[4] = v;
    }

    /** Matrix component at row 2 column 3. */
    public get f(): number {
        return this[5];
    }
    public set f(v: number) {
        this[5] = v;
    }

    /**
     * Sets the matrix component values.
     *
     * @param components - The component values to set.
     */
    public set(...components: AffineTransformJSON): this;

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
    public set(...columns: [ ReadonlyVectorLike<2>, ReadonlyVectorLike<2>, ReadonlyVectorLike<2> ]): this;

    public set(...args: Array<number | ReadonlyVectorLike> | [ ReadonlyMatrixLike ]): this {
        if (AbstractMatrix.isInitFromMatrix(args)) {
            this.reset();
            const arg = args[0];
            const argRows = arg.rows;
            const argColumns = arg.columns;
            const columns = Math.min(3, argColumns);
            const rows = Math.min(2, argRows);
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
    public static fromJSON(components: AffineTransformJSON): AffineTransform {
        return new AffineTransform(...components);
    }

    /** @inheritDoc */
    public clone(): AffineTransform {
        return new AffineTransform(this);
    }

    /** @inheritDoc */
    public toJSON(): AffineTransformJSON {
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
    public mul(other: AffineTransform): this {
        // a = this, b = other
        const a11 = this[0], a12 = this[1], a13 = this[2];
        const a21 = this[3], a22 = this[4], a23 = this[5];
        const b11 = other[0], b12 = other[1], b13 = other[2];
        const b21 = other[3], b22 = other[4], b23 = other[5];

        // this = a * b
        this[0] = a11 * b11 + a21 * b12;
        this[1] = a12 * b11 + a22 * b12;
        this[2] = a13 * b11 + a23 * b12 + b13;
        this[3] = a11 * b21 + a21 * b22;
        this[4] = a12 * b21 + a22 * b22;
        this[5] = a13 * b21 + a23 * b22 + b23;

        return this;
    }

    /** @inheritDoc */
    public div(other: AffineTransform): this {
        // a = this, b = other
        const a11 = this[0], a12 = this[1], a13 = this[2];
        const a21 = this[3], a22 = this[4], a23 = this[5];
        const b11 = other[0], b12 = other[1], b13 = other[2];
        const b21 = other[3], b22 = other[4], b23 = other[5];

        // d = determinant(b)
        const d = b11 * b22 - b21 * b12;

        // c = invert(b)
        const c11 = b22 / d;
        const c12 = -b12 / d;
        const c13 = (b12 * b23 - b22 * b13) / d;
        const c21 = -b21 / d;
        const c22 = b11  / d;
        const c23 = (b21 * b13 - b11 * b23) / d;

        // this = a * c
        this[0] = a11 * c11 + a21 * c12;
        this[1] = a12 * c11 + a22 * c12;
        this[2] = a13 * c11 + a23 * c12 + c13;
        this[3] = a11 * c21 + a21 * c22;
        this[4] = a12 * c21 + a22 * c22;
        this[5] = a13 * c21 + a23 * c22 + c23;

        return this;
    }

    /** @inheritDoc */
    public getDeterminant(): number {
        return this[0] * this[3] * 1 - this[2] * this[1] * 1;
    }

    /** @inheritDoc */
    public invert(): this {
        const m11 = this[0], m12 = this[1];
        const m21 = this[2], m22 = this[3];
        const m31 = this[4], m32 = this[5];

        const d = m11 * m22 - m21 * m12;

        this[0] = m22 / d;
        this[1] = -m12 / d;
        this[2] = -m21 / d;
        this[3] = m11 / d;
        this[4] = (m21 * m32 - m31 * m22) / d;
        this[5] = (m31 * m12 - m11 * m32) / d;

        return this;
    }

    /**
     * Translates this matrix by the specified values.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     */
    public translate(dx: number, dy: number): this {
        this[4] += dx * this[0] + dy * this[2];
        this[5] += dx * this[1] + dy * this[3];
        return this;
    }

    /**
     * Translates this matrix by the specified X delta.
     *
     * @param d - The X translation delta.
     */
    public translateX(d: number): this {
        this[4] += d * this[0];
        this[5] += d * this[1];
        return this;
    }

    /**
     * Translates this matrix by the specified Y delta.
     *
     * @param d - The Y translation delta.
     */
    public translateY(d: number): this {
        this[4] += d * this[2];
        this[5] += d * this[3];
        return this;
    }

    /**
     * Scales this matrix by the specified factor.
     *
     * @param sx - The X scale factor.
     * @param sy - The Y scale factor. Defaults to X scale factor.
     */
    public scale(sx: number, sy = sx): this {
        this[0] *= sx;
        this[1] *= sx;
        this[2] *= sy;
        this[3] *= sy;
        return this;
    }

    /**
     * Scales this matrix by the specified factor along the X axis.
     *
     * @param s - The scale factor.
     */
    public scaleX(s: number): this {
        this[0] *= s;
        this[1] *= s;
        return this;
    }

    /**
     * Scales this matrix by the specified factor along the Y axis.
     *
     * @param s - The scale factor.
     */
    public scaleY(s: number): this {
        this[3] *= s;
        this[4] *= s;
        return this;
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
