/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Matrix3x2 } from "./Matrix3x2";

/**
 * Affine transformation matrix. It behaves like a 3x3 matrix where the third row is always assumed to be 0 0 1.
 * This matrix is useful for 2D transformations and is compatible to the transformations done in a Canvas for example.
 */
export class AffineTransform extends Matrix3x2 implements Cloneable<AffineTransform> {
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

    /** @inheritDoc */
    public clone(): AffineTransform {
        return AffineTransform.fromMatrix(this);
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.every((value, index) => value === other[index]));
    }

    /** @inheritDoc */
    public mul(other: AffineTransform): this {
        const a11 = this[0], a12 = this[1];
        const a21 = this[2], a22 = this[3];
        const a31 = this[4], a32 = this[5];
        const b11 = other[0], b12 = other[1];
        const b21 = other[2], b22 = other[3];
        const b31 = other[4], b32 = other[5];
        this[0] = a11 * b11 + a21 * b12;
        this[1] = a12 * b11 + a22 * b12;
        this[2] = a11 * b21 + a21 * b22;
        this[3] = a12 * b21 + a22 * b22;
        this[4] = a11 * b31 + a21 * b32 + a31;
        this[5] = a12 * b31 + a22 * b32 + a32;
        return this;
    }

    /** @inheritDoc */
    public div(other: AffineTransform): this {
        // a = this, b = other
        const a11 = this[0], a12 = this[1];
        const a21 = this[2], a22 = this[3];
        const a31 = this[4], a32 = this[5];
        const b11 = other[0], b12 = other[1];
        const b21 = other[2], b22 = other[3];
        const b31 = other[4], b32 = other[5];

        // d = determinant(b)
        const d = b11 * b22 - b21 * b12;

        // c = invert(b)
        const c11 = b22 / d;
        const c12 = -b12 / d;
        const c21 = -b21 / d;
        const c22 = b11 / d;
        const c31 = (b21 * b32 - b31 * b22) / d;
        const c32 = (b31 * b12 - b11 * b32) / d;

        // this = this * c
        this[0] = a11 * c11 + a21 * c12;
        this[1] = a12 * c11 + a22 * c12;
        this[2] = a11 * c21 + a21 * c22;
        this[3] = a12 * c21 + a22 * c22;
        this[4] = a11 * c31 + a21 * c32 + a31;
        this[5] = a12 * c31 + a22 * c32 + a32;

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
        this[2] *= s;
        this[3] *= s;
        return this;
    }

    /**
     * Rotates this matrix around the specified axis.
     *
     * @param angle - The rotation angle in RAD.
     */
    public rotate(angle: number): this {
        const a00 = this[0], a01 = this[1], a10 = this[2], a11 = this[3];
        const s = Math.sin(angle), c = Math.cos(angle);
        this[0] = c * a00 + s * a10;
        this[1] = c * a01 + s * a11;
        this[2] = c * a10 - s * a00;
        this[3] = c * a11 - s * a01;
        return this;
    }
}
