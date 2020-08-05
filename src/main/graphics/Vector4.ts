/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { clamp, degrees, fract, mix, radians, roundEven, smoothStep, step } from "../util/math";
import { AbstractVector } from "./AbstractVector";
import { ReadonlyMatrixLike } from "./Matrix";
import { ReadonlyVectorLike, Vector, VectorLike } from "./Vector";

/**
 * JSON representation of a vector with four floating point components.
 */
export type Vector4JSON = [ number, number, number, number ];

export type Vector4Like = VectorLike<4>;

/**
 * Vector with four 32-bit floating point components. This class extends the standard Float32Array type so a vector
 * instance can be directly created from a buffer and passed to WebGL calls.
 */
export class Vector4 extends AbstractVector<4> implements Vector<4>, Cloneable<Vector4>, Serializable<Vector4JSON> {
    /**
     * Creates a new vector with all components set to 0.
     */
    public constructor();

    /**
     * Creates a new vector with all components set to the given value.
     *
     * @param xyzw - The value to initialize each vector component with.
     */
    public constructor(xyzw: number);

    /**
     * Creates a new vector with the given component values.
     *
     * @param x - The initial X component value.
     * @param y - The initial Y component value.
     * @param z - The initial Z component value.
     * @param w - The initial W component value.
     */
    public constructor(x: number, y: number, z: number, w: number);

    /**
     * Creates a new vector with the given component values.
     *
     * @param xy - The initial X and Y component values as a two-dimensional vector.
     * @param z  - The initial Z component value.
     * @param w  - The initial W component value.
     */
    public constructor(xy: ReadonlyVectorLike<2>, z: number, w: number);

    /**
     * Creates a new vector with the given component values.
     *
     * @param x  - The initial X component value.
     * @param yz - The initial Y and Z component values as a two-dimensional vector.
     * @param w  - The initial W component value.
     */
    public constructor(x: number, yz: ReadonlyVectorLike<2>, w: number);

    /**
     * Creates a new vector with the given component values.
     *
     * @param x  - The initial X component value.
     * @param y  - The initial Y component value.
     * @param zw - The initial Z and W component values as a two-dimensional vector.
     */
    public constructor(x: number, y: number, zw: ReadonlyVectorLike<2>);

    /**
     * Creates a new vector with the given component values.
     *
     * @param xy - The initial X and Y component values as a two-dimensional vector.
     * @param zw - The initial Z and W component values as a two-dimensional vector.
     */
    public constructor(xy: ReadonlyVectorLike<2>, zw: ReadonlyVectorLike<2>);

    /**
     * Creates a new vector with the given component values.
     *
     * @param xyz - The initial X, Y and Z component values as a two-dimensional vector.
     * @param w   - The initial W component value.
     */
    public constructor(xyz: ReadonlyVectorLike<3>, w: number);

    /**
     * Creates a new vector with the given component values.
     *
     * @param x   - The initial X component value.
     * @param yzw - The initial Y, Z and W component values as a two-dimensional vector.
     */
    public constructor(x: number, yzw: ReadonlyVectorLike<3>);

    /**
     * Creates a new vector with the given component values.
     *
     * @param xyzw - The initial component values as a four-dimensional vector.
     */
    public constructor(xyzw: ReadonlyVectorLike<4>);

    /**
     * Creates a new vector using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: ArrayBuffer | SharedArrayBuffer, offset?: number);

    public constructor(...args: Array<number | ReadonlyVectorLike> | [ ArrayBuffer | SharedArrayBuffer, number? ]) {
        if (args.length === 0) {
            super(4);
        } else if (AbstractVector.isInitFromArrayBuffer(args)) {
            super(args[0], args[1] ?? 0, 4);
        } else {
            super(4);
            this.setValues(args);
        }
    }

    public get x(): number {
        return this[0];
    }

    public set x(x: number) {
        this[0] = x;
    }

    public get y(): number {
        return this[1];
    }

    public set y(y: number) {
        this[1] = y;
    }

    public get z(): number {
        return this[2];
    }

    public set z(z: number) {
        this[2] = z;
    }

    public get w(): number {
        return this[3];
    }

    public set w(w: number) {
        this[3] = w;
    }

    public set(xyzw: number): this;
    public set(x: number, y: number, z: number, w: number): this;
    public set(xy: ReadonlyVectorLike<2>, z: number, w: number): this;
    public set(x: number, yz: ReadonlyVectorLike<2>, w: number): this;
    public set(x: number, y: number, zw: ReadonlyVectorLike<2>): this;
    public set(xy: ReadonlyVectorLike<2>, zw: ReadonlyVectorLike<2>): this;
    public set(xyz: ReadonlyVectorLike<3>, w: number): this;
    public set(x: number, yzw: ReadonlyVectorLike<3>): this;
    public set(xyzw: ReadonlyVectorLike<4>): this;
    public set(...args: Array<number | ReadonlyVectorLike>): this {
        return this.setValues(args);
    }

    /** @inheritDoc */
    public clone(): Vector4 {
        return new Vector4(this);
    }

    /** @inheritDoc */
    public toJSON(fractionDigits?: number): Vector4JSON {
        if (fractionDigits != null) {
            return [
                +this[0].toFixed(fractionDigits),
                +this[1].toFixed(fractionDigits),
                +this[2].toFixed(fractionDigits),
                +this[3].toFixed(fractionDigits)
            ];
        } else {
            return [ this[0], this[1], this[2], this[3] ];
        }
    }

    public static fromJSON(json: Vector4JSON): Vector4 {
        return new Vector4(...json);
    }

    /** @inheritDoc */
    public equals(obj: unknown, fractionDigits?: number): boolean {
        return isEqual(this, obj, other => {
            if (fractionDigits != null) {
                return this[0].toFixed(fractionDigits) === other[0].toFixed(fractionDigits)
                    && this[1].toFixed(fractionDigits) === other[1].toFixed(fractionDigits)
                    && this[2].toFixed(fractionDigits) === other[2].toFixed(fractionDigits)
                    && this[3].toFixed(fractionDigits) === other[3].toFixed(fractionDigits);
            } else {
                return this[0] === other[0] && this[1] === other[1] && this[2] === other[2] && this[3] === other[3];
            }
        });
    }

    /** @inheritDoc */
    public getSquareLength(): number {
        return this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2;
    }

    /** @inheritDoc */
    public getSquareDistance(v: ReadonlyVectorLike<4>): number {
        return (this[0] - v[0]) ** 2 + (this[1] - v[1]) ** 2 + (this[2] - v[2]) ** 2 + (this[3] - v[3]) ** 2;
    }

    /** @inheritDoc */
    public dot(v: ReadonlyVectorLike<4>): number {
        return this[0] * v[0] + this[1] * v[1] + this[2] * v[2] + this[3] * v[3];
    }

    /** @inheritDoc */
    public negate(): this {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        this[3] = -this[3];
        return this;
    }

    /** @inheritDoc */
    public add(summand: ReadonlyVectorLike<4> | number): this {
        if (typeof summand === "number") {
            this[0] += summand;
            this[1] += summand;
            this[2] += summand;
            this[3] += summand;
        } else {
            this[0] += summand[0];
            this[1] += summand[1];
            this[2] += summand[2];
            this[3] += summand[3];
        }
        return this;
    }

    /** @inheritDoc */
    public sub(subtrahend: ReadonlyVectorLike<4> | number): this {
        if (typeof subtrahend === "number") {
            this[0] -= subtrahend;
            this[1] -= subtrahend;
            this[2] -= subtrahend;
            this[3] -= subtrahend;
        } else {
            this[0] -= subtrahend[0];
            this[1] -= subtrahend[1];
            this[2] -= subtrahend[2];
            this[3] -= subtrahend[3];
        }
        return this;
    }

    /** @inheritDoc */
    public mul(arg: ReadonlyMatrixLike<4, 4>): this {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        this[0] = x * arg[ 0] + y * arg[ 4] + z * arg[ 8] + w * arg[12];
        this[1] = x * arg[ 1] + y * arg[ 5] + z * arg[ 9] + w * arg[13];
        this[2] = x * arg[ 2] + y * arg[ 6] + z * arg[10] + w * arg[14];
        this[3] = x * arg[ 3] + y * arg[ 7] + z * arg[11] + w * arg[15];
        return this;
    }

    /** @inheritDoc */
    public transposeMul(arg: ReadonlyMatrixLike<4, 4>): this {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        this[0] = x * arg[ 0] + y * arg[ 1] + z * arg[ 2] + w * arg[ 3];
        this[1] = x * arg[ 4] + y * arg[ 5] + z * arg[ 6] + w * arg[ 7];
        this[2] = x * arg[ 8] + y * arg[ 9] + z * arg[10] + w * arg[11];
        this[3] = x * arg[12] + y * arg[13] + z * arg[14] + w * arg[15];
        return this;
    }

    /** @inheritDoc */
    public div(arg: ReadonlyMatrixLike<4, 4>): this {
        const m11 = arg[ 0], m12 = arg[ 1], m13 = arg[ 2], m14 = arg[ 3];
        const m21 = arg[ 4], m22 = arg[ 5], m23 = arg[ 6], m24 = arg[ 7];
        const m31 = arg[ 8], m32 = arg[ 9], m33 = arg[10], m34 = arg[11];
        const m41 = arg[12], m42 = arg[13], m43 = arg[14], m44 = arg[15];

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

        const c11 = (m23 * m34m42 - m24 * m33m42 + m24 * m32m43 - m22 * m34m43 - m23 * m32m44 + m22 * m33m44) / d;
        const c12 = (m14 * m33m42 - m13 * m34m42 - m14 * m32m43 + m12 * m34m43 + m13 * m32m44 - m12 * m33m44) / d;
        const c13 = (m13m24 * m42 - m14m23 * m42 + m14m22 * m43 - m12m24 * m43 - m13m22 * m44 + m12m23 * m44) / d;
        const c14 = (m14m23 * m32 - m13m24 * m32 - m14m22 * m33 + m12m24 * m33 + m13m22 * m34 - m12m23 * m34) / d;
        const c21 = (m24 * m33m41 - m23 * m34m41 - m24 * m31m43 + m21 * m34m43 + m23 * m31m44 - m21 * m33m44) / d;
        const c22 = (m13 * m34m41 - m14 * m33m41 + m14 * m31m43 - m11 * m34m43 - m13 * m31m44 + m11 * m33m44) / d;
        const c23 = (m14m23 * m41 - m13m24 * m41 - m14m21 * m43 + m11m24 * m43 + m13m21 * m44 - m11m23 * m44) / d;
        const c24 = (m13m24 * m31 - m14m23 * m31 + m14m21 * m33 - m11m24 * m33 - m13m21 * m34 + m11m23 * m34) / d;
        const c31 = (m22 * m34m41 - m24 * m32m41 + m24 * m31m42 - m21 * m34m42 - m22 * m31m44 + m21 * m32m44) / d;
        const c32 = (m14 * m32m41 - m12 * m34m41 - m14 * m31m42 + m11 * m34m42 + m12 * m31m44 - m11 * m32m44) / d;
        const c33 = (m12m24 * m41 - m14m22 * m41 + m14m21 * m42 - m11m24 * m42 - m12m21 * m44 + m11m22 * m44) / d;
        const c34 = (m14m22 * m31 - m12m24 * m31 - m14m21 * m32 + m11m24 * m32 + m12m21 * m34 - m11m22 * m34) / d;
        const c41 = (m23 * m32m41 - m22 * m33m41 - m23 * m31m42 + m21 * m33m42 + m22 * m31m43 - m21 * m32m43) / d;
        const c42 = (m12 * m33m41 - m13 * m32m41 + m13 * m31m42 - m11 * m33m42 - m12 * m31m43 + m11 * m32m43) / d;
        const c43 = (m13m22 * m41 - m12m23 * m41 - m13m21 * m42 + m11m23 * m42 + m12m21 * m43 - m11m22 * m43) / d;
        const c44 = (m12m23 * m31 - m13m22 * m31 + m13m21 * m32 - m11m23 * m32 - m12m21 * m33 + m11m22 * m33) / d;

        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        this[0] = x * c11 + y * c21 + z * c31 + w * c41;
        this[1] = x * c12 + y * c22 + z * c32 + w * c42;
        this[2] = x * c13 + y * c23 + z * c33 + w * c43;
        this[3] = x * c14 + y * c24 + z * c34 + w * c44;
        return this;
    }

    /** @inheritDoc */
    public transposeDiv(arg: ReadonlyMatrixLike<4, 4>): this {
        const m11 = arg[ 0], m12 = arg[ 1], m13 = arg[ 2], m14 = arg[ 3];
        const m21 = arg[ 4], m22 = arg[ 5], m23 = arg[ 6], m24 = arg[ 7];
        const m31 = arg[ 8], m32 = arg[ 9], m33 = arg[10], m34 = arg[11];
        const m41 = arg[12], m42 = arg[13], m43 = arg[14], m44 = arg[15];

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

        const c11 = (m23 * m34m42 - m24 * m33m42 + m24 * m32m43 - m22 * m34m43 - m23 * m32m44 + m22 * m33m44) / d;
        const c12 = (m14 * m33m42 - m13 * m34m42 - m14 * m32m43 + m12 * m34m43 + m13 * m32m44 - m12 * m33m44) / d;
        const c13 = (m13m24 * m42 - m14m23 * m42 + m14m22 * m43 - m12m24 * m43 - m13m22 * m44 + m12m23 * m44) / d;
        const c14 = (m14m23 * m32 - m13m24 * m32 - m14m22 * m33 + m12m24 * m33 + m13m22 * m34 - m12m23 * m34) / d;
        const c21 = (m24 * m33m41 - m23 * m34m41 - m24 * m31m43 + m21 * m34m43 + m23 * m31m44 - m21 * m33m44) / d;
        const c22 = (m13 * m34m41 - m14 * m33m41 + m14 * m31m43 - m11 * m34m43 - m13 * m31m44 + m11 * m33m44) / d;
        const c23 = (m14m23 * m41 - m13m24 * m41 - m14m21 * m43 + m11m24 * m43 + m13m21 * m44 - m11m23 * m44) / d;
        const c24 = (m13m24 * m31 - m14m23 * m31 + m14m21 * m33 - m11m24 * m33 - m13m21 * m34 + m11m23 * m34) / d;
        const c31 = (m22 * m34m41 - m24 * m32m41 + m24 * m31m42 - m21 * m34m42 - m22 * m31m44 + m21 * m32m44) / d;
        const c32 = (m14 * m32m41 - m12 * m34m41 - m14 * m31m42 + m11 * m34m42 + m12 * m31m44 - m11 * m32m44) / d;
        const c33 = (m12m24 * m41 - m14m22 * m41 + m14m21 * m42 - m11m24 * m42 - m12m21 * m44 + m11m22 * m44) / d;
        const c34 = (m14m22 * m31 - m12m24 * m31 - m14m21 * m32 + m11m24 * m32 + m12m21 * m34 - m11m22 * m34) / d;
        const c41 = (m23 * m32m41 - m22 * m33m41 - m23 * m31m42 + m21 * m33m42 + m22 * m31m43 - m21 * m32m43) / d;
        const c42 = (m12 * m33m41 - m13 * m32m41 + m13 * m31m42 - m11 * m33m42 - m12 * m31m43 + m11 * m32m43) / d;
        const c43 = (m13m22 * m41 - m12m23 * m41 - m13m21 * m42 + m11m23 * m42 + m12m21 * m43 - m11m22 * m43) / d;
        const c44 = (m12m23 * m31 - m13m22 * m31 + m13m21 * m32 - m11m23 * m32 - m12m21 * m33 + m11m22 * m33) / d;

        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        this[0] = x * c11 + y * c12 + z * c13 + w * c14;
        this[1] = x * c21 + y * c22 + z * c23 + w * c24;
        this[2] = x * c31 + y * c32 + z * c33 + w * c34;
        this[3] = x * c41 + y * c42 + z * c43 + w * c44;
        return this;
    }

    /** @inheritDoc */
    public compMul(factor: ReadonlyVectorLike<4> | number): this {
        if (typeof factor === "number") {
            this[0] *= factor;
            this[1] *= factor;
            this[2] *= factor;
            this[3] *= factor;
        } else {
            this[0] *= factor[0];
            this[1] *= factor[1];
            this[2] *= factor[2];
            this[3] *= factor[3];
        }
        return this;
    }

    /** @inheritDoc */
    public compDiv(divisor: ReadonlyVectorLike<4> | number): this {
        if (typeof divisor === "number") {
            this[0] /= divisor;
            this[1] /= divisor;
            this[2] /= divisor;
            this[3] /= divisor;
        } else {
            this[0] /= divisor[0];
            this[1] /= divisor[1];
            this[2] /= divisor[2];
            this[3] /= divisor[3];
        }
        return this;
    }

    /** @inheritDoc */
    public reflect(normal: ReadonlyVectorLike<4>): this {
        const dot2 = (normal[0] * this[0] + normal[1] * this[1] + normal[2] * this[2] + normal[3] * this[3]) * 2;
        this[0] -= normal[0] * dot2;
        this[1] -= normal[1] * dot2;
        this[2] -= normal[2] * dot2;
        this[3] -= normal[3] * dot2;
        return this;
    }

    /** @inheritDoc */
    public refract(normal: ReadonlyVectorLike<4>, eta: number): this {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        const nx = normal[0], ny = normal[1], nz = normal[2], nw = normal[3];
        const dot = x * nx + y * ny + z * nz + w * nw;
        const k = 1.0 - eta * eta * (1.0 - dot * dot);
        if (k < 0.0) {
            this[0] = this[1] = this[2] = this[3] = 0;
        } else {
            const f = eta * dot + Math.sqrt(k);
            this[0] = x * eta - nx * f;
            this[1] = y * eta - ny * f;
            this[2] = z * eta - nz * f;
            this[3] = w * eta - nw * f;
        }
        return this;
    }

    /** @inheritDoc */
    public normalize(): this {
        const len = Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2);
        this[0] /= len;
        this[1] /= len;
        this[2] /= len;
        this[3] /= len;
        return this;
    }

    /** @inheritDoc */
    public radians(): this {
        this[0] = radians(this[0]);
        this[1] = radians(this[1]);
        this[2] = radians(this[2]);
        this[3] = radians(this[3]);
        return this;
    }

    /** @inheritDoc */
    public degrees(): this {
        this[0] = degrees(this[0]);
        this[1] = degrees(this[1]);
        this[2] = degrees(this[2]);
        this[3] = degrees(this[3]);
        return this;
    }

    /** @inheritDoc */
    public sin(): this {
        this[0] = Math.sin(this[0]);
        this[1] = Math.sin(this[1]);
        this[2] = Math.sin(this[2]);
        this[3] = Math.sin(this[3]);
        return this;
    }

    /** @inheritDoc */
    public cos(): this {
        this[0] = Math.cos(this[0]);
        this[1] = Math.cos(this[1]);
        this[2] = Math.cos(this[2]);
        this[3] = Math.cos(this[3]);
        return this;
    }

    /** @inheritDoc */
    public tan(): this {
        this[0] = Math.tan(this[0]);
        this[1] = Math.tan(this[1]);
        this[2] = Math.tan(this[2]);
        this[3] = Math.tan(this[3]);
        return this;
    }

    /** @inheritDoc */
    public asin(): this {
        this[0] = Math.asin(this[0]);
        this[1] = Math.asin(this[1]);
        this[2] = Math.asin(this[2]);
        this[3] = Math.asin(this[3]);
        return this;
    }

    /** @inheritDoc */
    public acos(): this {
        this[0] = Math.acos(this[0]);
        this[1] = Math.acos(this[1]);
        this[2] = Math.acos(this[2]);
        this[3] = Math.acos(this[3]);
        return this;
    }

    /** @inheritDoc */
    public atan(): this {
        this[0] = Math.atan(this[0]);
        this[1] = Math.atan(this[1]);
        this[2] = Math.atan(this[2]);
        this[3] = Math.atan(this[3]);
        return this;
    }

    /** @inheritDoc */
    public atan2(v: ReadonlyVectorLike<4> | number): this {
        if (typeof v === "number") {
            this[0] = Math.atan2(this[0], v);
            this[1] = Math.atan2(this[1], v);
            this[2] = Math.atan2(this[2], v);
            this[3] = Math.atan2(this[3], v);
        } else {
            this[0] = Math.atan2(this[0], v[0]);
            this[1] = Math.atan2(this[1], v[1]);
            this[2] = Math.atan2(this[2], v[2]);
            this[3] = Math.atan2(this[3], v[3]);
        }
        return this;
    }

    /** @inheritDoc */
    public sinh(): this {
        this[0] = Math.sinh(this[0]);
        this[1] = Math.sinh(this[1]);
        this[2] = Math.sinh(this[2]);
        this[3] = Math.sinh(this[3]);
        return this;
    }

    /** @inheritDoc */
    public cosh(): this {
        this[0] = Math.cosh(this[0]);
        this[1] = Math.cosh(this[1]);
        this[2] = Math.cosh(this[2]);
        this[3] = Math.cosh(this[3]);
        return this;
    }

    /** @inheritDoc */
    public tanh(): this {
        this[0] = Math.tanh(this[0]);
        this[1] = Math.tanh(this[1]);
        this[2] = Math.tanh(this[2]);
        this[3] = Math.tanh(this[3]);
        return this;
    }

    /** @inheritDoc */
    public asinh(): this {
        this[0] = Math.asinh(this[0]);
        this[1] = Math.asinh(this[1]);
        this[2] = Math.asinh(this[2]);
        this[3] = Math.asinh(this[3]);
        return this;
    }

    /** @inheritDoc */
    public acosh(): this {
        this[0] = Math.acosh(this[0]);
        this[1] = Math.acosh(this[1]);
        this[2] = Math.acosh(this[2]);
        this[3] = Math.acosh(this[3]);
        return this;
    }

    /** @inheritDoc */
    public atanh(): this {
        this[0] = Math.atanh(this[0]);
        this[1] = Math.atanh(this[1]);
        this[2] = Math.atanh(this[2]);
        this[3] = Math.atanh(this[3]);
        return this;
    }

    /** @inheritDoc */
    public pow(v: ReadonlyVectorLike<4> | number): this {
        if (typeof v === "number") {
            this[0] = this[0] ** v;
            this[1] = this[1] ** v;
            this[2] = this[2] ** v;
            this[3] = this[3] ** v;
        } else {
            this[0] = this[0] ** v[0];
            this[1] = this[1] ** v[1];
            this[2] = this[2] ** v[2];
            this[3] = this[3] ** v[3];
        }
        return this;
    }

    /** @inheritDoc */
    public exp(): this {
        this[0] = Math.exp(this[0]);
        this[1] = Math.exp(this[1]);
        this[2] = Math.exp(this[2]);
        this[3] = Math.exp(this[3]);
        return this;
    }

    /** @inheritDoc */
    public log(): this {
        this[0] = Math.log(this[0]);
        this[1] = Math.log(this[1]);
        this[2] = Math.log(this[2]);
        this[3] = Math.log(this[3]);
        return this;
    }

    /** @inheritDoc */
    public exp2(): this {
        this[0] = 2 ** this[0];
        this[1] = 2 ** this[1];
        this[2] = 2 ** this[2];
        this[3] = 2 ** this[3];
        return this;
    }

    /** @inheritDoc */
    public log2(): this {
        this[0] = Math.log2(this[0]);
        this[1] = Math.log2(this[1]);
        this[2] = Math.log2(this[2]);
        this[3] = Math.log2(this[3]);
        return this;
    }

    /** @inheritDoc */
    public sqrt(): this {
        this[0] = Math.sqrt(this[0]);
        this[1] = Math.sqrt(this[1]);
        this[2] = Math.sqrt(this[2]);
        this[3] = Math.sqrt(this[3]);
        return this;
    }

    /** @inheritDoc */
    public inverseSqrt(): this {
        this[0] = 1 / Math.sqrt(this[0]);
        this[1] = 1 / Math.sqrt(this[1]);
        this[2] = 1 / Math.sqrt(this[2]);
        this[3] = 1 / Math.sqrt(this[3]);
        return this;
    }

    /** @inheritDoc */
    public abs(): this {
        this[0] = Math.abs(this[0]);
        this[1] = Math.abs(this[1]);
        this[2] = Math.abs(this[2]);
        this[3] = Math.abs(this[3]);
        return this;
    }

    /** @inheritDoc */
    public sign(): this {
        this[0] = Math.sign(this[0]);
        this[1] = Math.sign(this[1]);
        this[2] = Math.sign(this[2]);
        this[3] = Math.sign(this[3]);
        return this;
    }

    /** @inheritDoc */
    public floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        this[2] = Math.floor(this[2]);
        this[3] = Math.floor(this[3]);
        return this;
    }

    /** @inheritDoc */
    public trunc(): this {
        this[0] = Math.trunc(this[0]);
        this[1] = Math.trunc(this[1]);
        this[2] = Math.trunc(this[2]);
        this[3] = Math.trunc(this[3]);
        return this;
    }

    /** @inheritDoc */
    public round(): this {
        this[0] = Math.round(this[0]);
        this[1] = Math.round(this[1]);
        this[2] = Math.round(this[2]);
        this[3] = Math.round(this[3]);
        return this;
    }

    /** @inheritDoc */
    public roundEven(): this {
        this[0] = roundEven(this[0]);
        this[1] = roundEven(this[1]);
        this[2] = roundEven(this[2]);
        this[3] = roundEven(this[3]);
        return this;
    }

    /** @inheritDoc */
    public ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        this[2] = Math.ceil(this[2]);
        this[3] = Math.ceil(this[3]);
        return this;
    }

    /** @inheritDoc */
    public fract(): this {
        this[0] = fract(this[0]);
        this[1] = fract(this[1]);
        this[2] = fract(this[2]);
        this[3] = fract(this[3]);
        return this;
    }

    /** @inheritDoc */
    public mod(v: ReadonlyVectorLike<4> | number): this {
        if (typeof v === "number") {
            this[0] %= v;
            this[1] %= v;
            this[2] %= v;
            this[3] %= v;
        } else {
            this[0] %= v[0];
            this[1] %= v[1];
            this[2] %= v[2];
            this[3] %= v[3];
        }
        return this;
    }

    /** @inheritDoc */
    public modf(i: VectorLike<4>): this {
        i[0] = this[0] | 0;
        i[1] = this[1] | 0;
        i[2] = this[2] | 0;
        i[3] = this[3] | 0;
        this[0] %= 1;
        this[1] %= 1;
        this[2] %= 1;
        this[3] %= 1;
        return this;
    }

    /** @inheritDoc */
    public min(v: ReadonlyVectorLike<4> | number): this {
        if (typeof v === "number") {
            this[0] = Math.min(this[0], v);
            this[1] = Math.min(this[1], v);
            this[2] = Math.min(this[2], v);
            this[3] = Math.min(this[3], v);
        } else {
            this[0] = Math.min(this[0], v[0]);
            this[1] = Math.min(this[1], v[1]);
            this[2] = Math.min(this[2], v[2]);
            this[3] = Math.min(this[3], v[3]);
        }
        return this;
    }

    /** @inheritDoc */
    public max(v: ReadonlyVectorLike<4> | number): this {
        if (typeof v === "number") {
            this[0] = Math.max(this[0], v);
            this[1] = Math.max(this[1], v);
            this[2] = Math.max(this[2], v);
            this[3] = Math.max(this[3], v);
        } else {
            this[0] = Math.max(this[0], v[0]);
            this[1] = Math.max(this[1], v[1]);
            this[2] = Math.max(this[2], v[2]);
            this[3] = Math.max(this[3], v[3]);
        }
        return this;
    }

    /** @inheritDoc */
    public clamp(min: ReadonlyVectorLike<4> | number, max: ReadonlyVectorLike<4> | number): this {
        if (typeof min === "number") {
            if (typeof max === "number") {
                this[0] = clamp(this[0], min, max);
                this[1] = clamp(this[1], min, max);
                this[2] = clamp(this[2], min, max);
                this[3] = clamp(this[3], min, max);
            } else {
                this[0] = clamp(this[0], min, max[0]);
                this[1] = clamp(this[1], min, max[1]);
                this[2] = clamp(this[2], min, max[2]);
                this[3] = clamp(this[3], min, max[3]);
            }
        } else {
            if (typeof max === "number") {
                this[0] = clamp(this[0], min[0], max);
                this[1] = clamp(this[1], min[1], max);
                this[2] = clamp(this[2], min[2], max);
                this[3] = clamp(this[3], min[3], max);
            } else {
                this[0] = clamp(this[0], min[0], max[0]);
                this[1] = clamp(this[1], min[1], max[1]);
                this[2] = clamp(this[2], min[2], max[2]);
                this[3] = clamp(this[3], min[3], max[3]);
            }
        }
        return this;
    }

    /** @inheritDoc */
    public mix(v: ReadonlyVectorLike<4> | number, blend: ReadonlyVectorLike<4> | number): this {
        if (typeof v === "number") {
            if (typeof blend === "number") {
                this[0] = mix(this[0], v, blend);
                this[1] = mix(this[1], v, blend);
                this[2] = mix(this[2], v, blend);
                this[3] = mix(this[3], v, blend);
            } else {
                this[0] = mix(this[0], v, blend[0]);
                this[1] = mix(this[1], v, blend[1]);
                this[2] = mix(this[2], v, blend[2]);
                this[3] = mix(this[3], v, blend[3]);
            }
        } else {
            if (typeof blend === "number") {
                this[0] = mix(this[0], v[0], blend);
                this[1] = mix(this[1], v[1], blend);
                this[2] = mix(this[2], v[2], blend);
                this[3] = mix(this[3], v[3], blend);
            } else {
                this[0] = mix(this[0], v[0], blend[0]);
                this[1] = mix(this[1], v[1], blend[1]);
                this[2] = mix(this[2], v[2], blend[2]);
                this[3] = mix(this[3], v[3], blend[3]);
            }
        }
        return this;
    }

    /** @inheritDoc */
    public step(edge: ReadonlyVectorLike<4> | number): this {
        if (typeof edge === "number") {
            this[0] = step(edge, this[0]);
            this[1] = step(edge, this[1]);
            this[2] = step(edge, this[2]);
            this[3] = step(edge, this[3]);
        } else {
            this[0] = step(edge[0], this[0]);
            this[1] = step(edge[1], this[1]);
            this[2] = step(edge[2], this[2]);
            this[3] = step(edge[3], this[3]);
        }
        return this;
    }

    /** @inheritDoc */
    public smoothStep(edge1: ReadonlyVectorLike<4> | number, edge2: ReadonlyVectorLike<4> | number): this {
        if (typeof edge1 === "number") {
            if (typeof edge2 === "number") {
                this[0] = smoothStep(edge1, edge2, this[0]);
                this[1] = smoothStep(edge1, edge2, this[1]);
                this[2] = smoothStep(edge1, edge2, this[2]);
                this[3] = smoothStep(edge1, edge2, this[3]);
            } else {
                this[0] = smoothStep(edge1, edge2[0], this[0]);
                this[1] = smoothStep(edge1, edge2[1], this[1]);
                this[2] = smoothStep(edge1, edge2[2], this[2]);
                this[3] = smoothStep(edge1, edge2[3], this[3]);
            }
        } else {
            if (typeof edge2 === "number") {
                this[0] = smoothStep(edge1[0], edge2, this[0]);
                this[1] = smoothStep(edge1[1], edge2, this[1]);
                this[2] = smoothStep(edge1[2], edge2, this[2]);
                this[3] = smoothStep(edge1[3], edge2, this[3]);
            } else {
                this[0] = smoothStep(edge1[0], edge2[0], this[0]);
                this[1] = smoothStep(edge1[1], edge2[1], this[1]);
                this[2] = smoothStep(edge1[2], edge2[2], this[2]);
                this[3] = smoothStep(edge1[3], edge2[3], this[3]);
            }
        }
        return this;
    }
}
