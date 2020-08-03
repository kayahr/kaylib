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

    /**
     * Creates a result vector initialized with the given component values. This is used internally to create result
     * vectors returned by the various methods.
     *
     * @param result - The result vector to re-use. A new one is created when undefined.
     * @param x - The X component value.
     * @param y - The Y component value.
     * @param z - The Z component value.
     * @param w - The W component value.
     * @return The result vector. Either a new one or the specified result vector.
     * @hidden
     */
    public static createResult<T extends Vector4Like = Vector4>(result: T | undefined, x: number, y: number, z: number,
            w: number): T {
        if (result != null) {
            result[0] = x;
            result[1] = y;
            result[2] = z;
            result[3] = w;
            return result;
        } else {
            return new Vector4(x, y, z, w) as unknown as T;
        }
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
    public negate<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            -this[0],
            -this[1],
            -this[2],
            -this[3]
        );
    }

    /** @inheritDoc */
    public add<T extends Vector4Like = Vector4>(summand: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof summand === "number") {
            return Vector4.createResult(result,
                this[0] + summand,
                this[1] + summand,
                this[2] + summand,
                this[3] + summand
            );
        } else {
            return Vector4.createResult(result,
                this[0] + summand[0],
                this[1] + summand[1],
                this[2] + summand[2],
                this[3] + summand[3]
            );
        }
    }

    /** @inheritDoc */
    public sub<T extends Vector4Like = Vector4>(subtrahend: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof subtrahend === "number") {
            return Vector4.createResult(result,
                this[0] - subtrahend,
                this[1] - subtrahend,
                this[2] - subtrahend,
                this[3] - subtrahend
            );
        } else {
            return Vector4.createResult(result,
                this[0] - subtrahend[0],
                this[1] - subtrahend[1],
                this[2] - subtrahend[2],
                this[3] - subtrahend[3]
            );
        }
    }

    /** @inheritDoc */
    public mul<T extends Vector4Like = Vector4>(arg: ReadonlyMatrixLike<4, 4>, result?: T): T {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        return Vector4.createResult(result,
            x * arg[ 0] + y * arg[ 4] + z * arg[ 8] + w * arg[12],
            x * arg[ 1] + y * arg[ 5] + z * arg[ 9] + w * arg[13],
            x * arg[ 2] + y * arg[ 6] + z * arg[10] + w * arg[14],
            x * arg[ 3] + y * arg[ 7] + z * arg[11] + w * arg[15]
        );
    }

    /** @inheritDoc */
    public transposeMul<T extends Vector4Like = Vector4>(arg: ReadonlyMatrixLike<4, 4>, result?: T): T {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        return Vector4.createResult(result,
            x * arg[ 0] + y * arg[ 1] + z * arg[ 2] + w * arg[ 3],
            x * arg[ 4] + y * arg[ 5] + z * arg[ 6] + w * arg[ 7],
            x * arg[ 8] + y * arg[ 9] + z * arg[10] + w * arg[11],
            x * arg[12] + y * arg[13] + z * arg[14] + w * arg[15]
        );
    }

    /** @inheritDoc */
    public div<T extends Vector4Like = Vector4>(arg: ReadonlyMatrixLike<4, 4>, result?: T): T {
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
        return Vector4.createResult(result,
            x * c11 + y * c21 + z * c31 + w * c41,
            x * c12 + y * c22 + z * c32 + w * c42,
            x * c13 + y * c23 + z * c33 + w * c43,
            x * c14 + y * c24 + z * c34 + w * c44
        );
    }

    /** @inheritDoc */
    public transposeDiv<T extends Vector4Like = Vector4>(arg: ReadonlyMatrixLike<4, 4>, result?: T): T {
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
        return Vector4.createResult(result,
            x * c11 + y * c12 + z * c13 + w * c14,
            x * c21 + y * c22 + z * c23 + w * c24,
            x * c31 + y * c32 + z * c33 + w * c34,
            x * c41 + y * c42 + z * c43 + w * c44
        );
    }

    /** @inheritDoc */
    public compMul<T extends Vector4Like = Vector4>(factor: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof factor === "number") {
            return Vector4.createResult(result,
                this[0] * factor,
                this[1] * factor,
                this[2] * factor,
                this[3] * factor
            );
        } else {
            return Vector4.createResult(result,
                this[0] * factor[0],
                this[1] * factor[1],
                this[2] * factor[2],
                this[3] * factor[3]
            );
        }
    }

    /** @inheritDoc */
    public compDiv<T extends Vector4Like = Vector4>(divisor: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof divisor === "number") {
            return Vector4.createResult(result,
                this[0] / divisor,
                this[1] / divisor,
                this[2] / divisor,
                this[3] / divisor
            );
        } else {
            return Vector4.createResult(result,
                this[0] / divisor[0],
                this[1] / divisor[1],
                this[2] / divisor[2],
                this[3] / divisor[3]
            );
        }
    }

    /** @inheritDoc */
    public reflect<T extends Vector4Like = Vector4>(normal: ReadonlyVectorLike<4>, result?: T): T {
        const dot2 = (normal[0] * this[0] + normal[1] * this[1] + normal[2] * this[2] + normal[3] * this[3]) * 2;
        return Vector4.createResult(result,
            this[0] - normal[0] * dot2,
            this[1] - normal[1] * dot2,
            this[2] - normal[2] * dot2,
            this[3] - normal[3] * dot2
        );
    }

    /** @inheritDoc */
    public refract<T extends Vector4Like = Vector4>(normal: ReadonlyVectorLike<4>, eta: number, result?: T): T {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        const nx = normal[0], ny = normal[1], nz = normal[2], nw = normal[3];
        const dot = x * nx + y * ny + z * nz + w * nw;
        const k = 1.0 - eta * eta * (1.0 - dot * dot);
        if (k < 0.0) {
            return Vector4.createResult(result, 0, 0, 0, 0);
        } else {
            const f = eta * dot + Math.sqrt(k);
            return Vector4.createResult(result,
                x * eta - nx * f,
                y * eta - ny * f,
                z * eta - nz * f,
                w * eta - nw * f
            );
        }
    }

    /** @inheritDoc */
    public normalize<T extends Vector4Like = Vector4>(result?: T): T {
        return this.compDiv(this.getLength(), result);
    }

    /** @inheritDoc */
    public radians<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            radians(this[0]),
            radians(this[1]),
            radians(this[2]),
            radians(this[3])
        );
    }

    /** @inheritDoc */
    public degrees<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            degrees(this[0]),
            degrees(this[1]),
            degrees(this[2]),
            degrees(this[3])
        );
    }

    /** @inheritDoc */
    public sin<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.sin(this[0]),
            Math.sin(this[1]),
            Math.sin(this[2]),
            Math.sin(this[3])
        );
    }

    /** @inheritDoc */
    public cos<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.cos(this[0]),
            Math.cos(this[1]),
            Math.cos(this[2]),
            Math.cos(this[3])
        );
    }

    /** @inheritDoc */
    public tan<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.tan(this[0]),
            Math.tan(this[1]),
            Math.tan(this[2]),
            Math.tan(this[3])
        );
    }

    /** @inheritDoc */
    public asin<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.asin(this[0]),
            Math.asin(this[1]),
            Math.asin(this[2]),
            Math.asin(this[3])
        );
    }

    /** @inheritDoc */
    public acos<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.acos(this[0]),
            Math.acos(this[1]),
            Math.acos(this[2]),
            Math.acos(this[3])
        );
    }

    /** @inheritDoc */
    public atan<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.atan(this[0]),
            Math.atan(this[1]),
            Math.atan(this[2]),
            Math.atan(this[3])
        );
    }

    /** @inheritDoc */
    public atan2<T extends Vector4Like = Vector4>(v: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector4.createResult(result,
                Math.atan2(this[0], v),
                Math.atan2(this[1], v),
                Math.atan2(this[2], v),
                Math.atan2(this[3], v)
            );
        } else {
            return Vector4.createResult(result,
                Math.atan2(this[0], v[0]),
                Math.atan2(this[1], v[1]),
                Math.atan2(this[2], v[2]),
                Math.atan2(this[3], v[3])
            );
        }
    }

    /** @inheritDoc */
    public sinh<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.sinh(this[0]),
            Math.sinh(this[1]),
            Math.sinh(this[2]),
            Math.sinh(this[3])
        );
    }

    /** @inheritDoc */
    public cosh<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.cosh(this[0]),
            Math.cosh(this[1]),
            Math.cosh(this[2]),
            Math.cosh(this[3])
        );
    }

    /** @inheritDoc */
    public tanh<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.tanh(this[0]),
            Math.tanh(this[1]),
            Math.tanh(this[2]),
            Math.tanh(this[3])
        );
    }

    /** @inheritDoc */
    public asinh<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.asinh(this[0]),
            Math.asinh(this[1]),
            Math.asinh(this[2]),
            Math.asinh(this[3])
        );
    }

    /** @inheritDoc */
    public acosh<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.acosh(this[0]),
            Math.acosh(this[1]),
            Math.acosh(this[2]),
            Math.acosh(this[3])
        );
    }

    /** @inheritDoc */
    public atanh<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.atanh(this[0]),
            Math.atanh(this[1]),
            Math.atanh(this[2]),
            Math.atanh(this[3])
        );
    }

    /** @inheritDoc */
    public pow<T extends Vector4Like = Vector4>(v: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector4.createResult(result,
                this[0] ** v,
                this[1] ** v,
                this[2] ** v,
                this[3] ** v
            );
        } else {
            return Vector4.createResult(result,
                this[0] ** v[0],
                this[1] ** v[1],
                this[2] ** v[2],
                this[3] ** v[3]
            );
        }
    }

    /** @inheritDoc */
    public exp<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.exp(this[0]),
            Math.exp(this[1]),
            Math.exp(this[2]),
            Math.exp(this[3])
        );
    }

    /** @inheritDoc */
    public log<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.log(this[0]),
            Math.log(this[1]),
            Math.log(this[2]),
            Math.log(this[3])
        );
    }

    /** @inheritDoc */
    public exp2<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            2 ** this[0],
            2 ** this[1],
            2 ** this[2],
            2 ** this[3]
        );
    }

    /** @inheritDoc */
    public log2<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.log2(this[0]),
            Math.log2(this[1]),
            Math.log2(this[2]),
            Math.log2(this[3])
        );
    }

    /** @inheritDoc */
    public sqrt<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.sqrt(this[0]),
            Math.sqrt(this[1]),
            Math.sqrt(this[2]),
            Math.sqrt(this[3])
        );
    }

    /** @inheritDoc */
    public inverseSqrt<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            1 / Math.sqrt(this[0]),
            1 / Math.sqrt(this[1]),
            1 / Math.sqrt(this[2]),
            1 / Math.sqrt(this[3])
        );
    }

    /** @inheritDoc */
    public abs<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.abs(this[0]),
            Math.abs(this[1]),
            Math.abs(this[2]),
            Math.abs(this[3])
        );
    }

    /** @inheritDoc */
    public sign<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.sign(this[0]),
            Math.sign(this[1]),
            Math.sign(this[2]),
            Math.sign(this[3])
        );
    }

    /** @inheritDoc */
    public floor<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.floor(this[0]),
            Math.floor(this[1]),
            Math.floor(this[2]),
            Math.floor(this[3])
        );
    }

    /** @inheritDoc */
    public trunc<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.trunc(this[0]),
            Math.trunc(this[1]),
            Math.trunc(this[2]),
            Math.trunc(this[3])
        );
    }

    /** @inheritDoc */
    public round<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.round(this[0]),
            Math.round(this[1]),
            Math.round(this[2]),
            Math.round(this[3])
        );
    }

    /** @inheritDoc */
    public roundEven<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            roundEven(this[0]),
            roundEven(this[1]),
            roundEven(this[2]),
            roundEven(this[3])
        );
    }

    /** @inheritDoc */
    public ceil<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            Math.ceil(this[0]),
            Math.ceil(this[1]),
            Math.ceil(this[2]),
            Math.ceil(this[3])
        );
    }

    /** @inheritDoc */
    public fract<T extends Vector4Like = Vector4>(result?: T): T {
        return Vector4.createResult(result,
            fract(this[0]),
            fract(this[1]),
            fract(this[2]),
            fract(this[3])
        );
    }

    /** @inheritDoc */
    public mod<T extends Vector4Like = Vector4>(v: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector4.createResult(result,
                this[0] % v,
                this[1] % v,
                this[2] % v,
                this[3] % v
            );
        } else {
            return Vector4.createResult(result,
                this[0] % v[0],
                this[1] % v[1],
                this[2] % v[2],
                this[3] % v[3]
            );
        }
    }

    /** @inheritDoc */
    public modf<T extends Vector4Like = Vector4>(i: VectorLike<4>, result?: T): T {
        i[0] = this[0] | 0;
        i[1] = this[1] | 0;
        i[2] = this[2] | 0;
        i[3] = this[3] | 0;
        return Vector4.createResult(result,
            this[0] % 1,
            this[1] % 1,
            this[2] % 1,
            this[3] % 1
        );
    }

    /** @inheritDoc */
    public min<T extends Vector4Like = Vector4>(v: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector4.createResult(result,
                Math.min(this[0], v),
                Math.min(this[1], v),
                Math.min(this[2], v),
                Math.min(this[3], v)
            );
        } else {
            return Vector4.createResult(result,
                Math.min(this[0], v[0]),
                Math.min(this[1], v[1]),
                Math.min(this[2], v[2]),
                Math.min(this[3], v[3])
            );
        }
    }

    /** @inheritDoc */
    public max<T extends Vector4Like = Vector4>(v: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector4.createResult(result,
                Math.max(this[0], v),
                Math.max(this[1], v),
                Math.max(this[2], v),
                Math.max(this[3], v)
            );
        } else {
            return Vector4.createResult(result,
                Math.max(this[0], v[0]),
                Math.max(this[1], v[1]),
                Math.max(this[2], v[2]),
                Math.max(this[3], v[3])
            );
        }
    }

    /** @inheritDoc */
    public clamp<T extends Vector4Like = Vector4>(min: ReadonlyVectorLike<4> | number,
            max: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof min === "number") {
            if (typeof max === "number") {
                return Vector4.createResult(result,
                    clamp(this[0], min, max),
                    clamp(this[1], min, max),
                    clamp(this[2], min, max),
                    clamp(this[3], min, max)
                );
            } else {
                return Vector4.createResult(result,
                    clamp(this[0], min, max[0]),
                    clamp(this[1], min, max[1]),
                    clamp(this[2], min, max[2]),
                    clamp(this[3], min, max[3])
                );
            }
        } else {
            if (typeof max === "number") {
                return Vector4.createResult(result,
                    clamp(this[0], min[0], max),
                    clamp(this[1], min[1], max),
                    clamp(this[2], min[2], max),
                    clamp(this[3], min[3], max)
                );
            } else {
                return Vector4.createResult(result,
                    clamp(this[0], min[0], max[0]),
                    clamp(this[1], min[1], max[1]),
                    clamp(this[2], min[2], max[2]),
                    clamp(this[3], min[3], max[3])
                );
            }
        }
    }

    /** @inheritDoc */
    public mix<T extends Vector4Like = Vector4>(v: ReadonlyVectorLike<4> | number,
            blend: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof v === "number") {
            if (typeof blend === "number") {
                return Vector4.createResult(result,
                    mix(this[0], v, blend),
                    mix(this[1], v, blend),
                    mix(this[2], v, blend),
                    mix(this[3], v, blend)
                );
            } else {
                return Vector4.createResult(result,
                    mix(this[0], v, blend[0]),
                    mix(this[1], v, blend[1]),
                    mix(this[2], v, blend[2]),
                    mix(this[3], v, blend[3])
                );
            }
        } else {
            if (typeof blend === "number") {
                return Vector4.createResult(result,
                    mix(this[0], v[0], blend),
                    mix(this[1], v[1], blend),
                    mix(this[2], v[2], blend),
                    mix(this[3], v[3], blend)
                );
            } else {
                return Vector4.createResult(result,
                    mix(this[0], v[0], blend[0]),
                    mix(this[1], v[1], blend[1]),
                    mix(this[2], v[2], blend[2]),
                    mix(this[3], v[3], blend[3])
                );
            }
        }
    }

    /** @inheritDoc */
    public step<T extends Vector4Like = Vector4>(edge: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof edge === "number") {
            return Vector4.createResult(result,
                step(edge, this[0]),
                step(edge, this[1]),
                step(edge, this[2]),
                step(edge, this[3])
            );
        } else {
            return Vector4.createResult(result,
                step(edge[0], this[0]),
                step(edge[1], this[1]),
                step(edge[2], this[2]),
                step(edge[3], this[3])
            );
        }
    }

    /** @inheritDoc */
    public smoothStep<T extends Vector4Like = Vector4>(edge1: ReadonlyVectorLike<4> | number,
            edge2: ReadonlyVectorLike<4> | number, result?: T): T {
        if (typeof edge1 === "number") {
            if (typeof edge2 === "number") {
                return Vector4.createResult(result,
                    smoothStep(edge1, edge2, this[0]),
                    smoothStep(edge1, edge2, this[1]),
                    smoothStep(edge1, edge2, this[2]),
                    smoothStep(edge1, edge2, this[3])
                );
            } else {
                return Vector4.createResult(result,
                    smoothStep(edge1, edge2[0], this[0]),
                    smoothStep(edge1, edge2[1], this[1]),
                    smoothStep(edge1, edge2[2], this[2]),
                    smoothStep(edge1, edge2[3], this[3])
                );
            }
        } else {
            if (typeof edge2 === "number") {
                return Vector4.createResult(result,
                    smoothStep(edge1[0], edge2, this[0]),
                    smoothStep(edge1[1], edge2, this[1]),
                    smoothStep(edge1[2], edge2, this[2]),
                    smoothStep(edge1[3], edge2, this[3])
                );
            } else {
                return Vector4.createResult(result,
                    smoothStep(edge1[0], edge2[0], this[0]),
                    smoothStep(edge1[1], edge2[1], this[1]),
                    smoothStep(edge1[2], edge2[2], this[2]),
                    smoothStep(edge1[3], edge2[3], this[3])
                );
            }
        }
    }
}
