/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Cloneable } from "../lang/Cloneable";
import { isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { clamp, degrees, fract, mix, radians, roundEven, smoothStep, step } from "../util/math";
import { StrictArrayBufferLike } from "../util/types";
import { AbstractVector } from "./AbstractVector";
import { ReadonlySquareMatrixLike } from "./SquareMatrix";
import { ReadonlyVector, ReadonlyVectorLike, Vector, VectorLike } from "./Vector";

/**
 * JSON representation of a vector with three floating point components.
 */
export type Vector3JSON = [ number, number, number ];

export type Vector3Like = VectorLike<3>;

/**
 * Readonly interface for a vector with three components.
 */
export interface ReadonlyVector3 extends ReadonlyVector<3> {
    /** The X component of the vector. */
    readonly x: number;

    /** The Y component of the vector. */
    readonly y: number;

    /** The Z component of the vector. */
    readonly z: number;
}

export interface Vector3 {
    length: 3;
}

/**
 * Vector with three 32-bit floating point components. This class extends the standard Float32Array type so a vector
 * instance can be directly created from a buffer and passed to WebGL calls.
 */
export class Vector3 extends AbstractVector<3> implements Vector<3>, Cloneable<Vector3>, Serializable<Vector3JSON> {
    /**
     * Creates a new vector with all components set to 0.
     */
    public constructor();

    /**
     * Creates a new vector with the given component values.
     *
     * @param x - The initial X component value.
     * @param y - The initial Y component value.
     * @param z - The initial Z component value.
     */
    public constructor(x: number, y: number, z: number);

    /**
     * Creates a new vector using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: StrictArrayBufferLike, offset?: number);

    public constructor(...args: [] | Vector3JSON | [ StrictArrayBufferLike, number? ]) {
        if (args.length === 0) {
            super(3);
        } else if (AbstractVector.isInitFromComponents(args)) {
            super(3);
            // Manually setting elements is much faster than passing them as array to Float32Array constructor
            this[0] = args[0];
            this[1] = args[1];
            this[2] = args[2];
        } else {
            super(args[0], args[1] ?? 0, 3);
        }
    }

    /**
     * Creates a new vector with the given component values.
     *
     * @param x  - The initial X component value.
     * @param yz - The initial Y and Z component values as a two-dimensional vector.
     */
    public static fromVector(x: number, yz: ReadonlyVectorLike<2>): Vector3;

    /**
     * Creates a new vector with the given component values.
     *
     * @param xy - The initial X and Y component values as a two-dimensional vector.
     * @param z  - The initial Z component value.
     */
    public static fromVector(xy: ReadonlyVectorLike<2>, z: number): Vector3;

    /**
     * Creates a new vector with the given component values.
     *
     * @param xyz - The initial X, Y and Z component values as a three- or four-dimensional vector.
     */
    public static fromVector(xyz: ReadonlyVectorLike<3 | 4>): Vector3;

    public static fromVector(...args: Array<number | ReadonlyVectorLike>): Vector3 {
        return new this().fillComponents(args);
    }

    public static fromJSON(json: Vector3JSON): Vector3 {
        return new Vector3(...json);
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

    /**
     * Sets the vector component values.
     *
     * @param x - The X component value to set.
     * @param y - The Y component value to set.
     * @param z - The Z component value to set.
     */
    public setComponents(x: number, y: number, z: number): this {
        this[0] = x;
        this[1] = y;
        this[2] = z;
        return this;
    }

    /**
     * Sets the vector component values to the given values.
     *
     * @param xy - The X and Y component values as a two-dimensional vector.
     * @param z  - The Z component value.
     */
    public setVector(xy: ReadonlyVectorLike<2>, z: number): this;

    /**
     * Sets the vector component values to the given values.
     *
     * @param x  - The X component value.
     * @param yz - The Y and Z component values as a two-dimensional vector.
     */
    public setVector(x: number, yz: ReadonlyVectorLike<2>): this;

    /**
     * Sets the vector component values to the given values.
     *
     * @param xyz  - The vector to copy the X, Y and Z components from.
     */
    public setVector(xyz: ReadonlyVectorLike<3 | 4>): this;

    public setVector(...args: Array<number | ReadonlyVectorLike>): this {
        return this.fillComponents(args);
    }

    /** @inheritDoc */
    public clone(): Vector3 {
        return new Vector3(this[0], this[1], this[2]);
    }

    /** @inheritDoc */
    public toJSON(): Vector3JSON {
        return [ this[0], this[1], this[2] ];
    }

    /** @inheritDoc */
    public equals(obj: unknown): boolean {
        return isEqual(this, obj, other => this[0] === other[0] && this[1] === other[1] && this[2] === other[2]);
    }

    /** @inheritDoc */
    public getSquareLength(): number {
        return this[0] ** 2 + this[1] ** 2 + this[2] ** 2;
    }

    /** @inheritDoc */
    public getSquareDistance(v: ReadonlyVectorLike<3>): number {
        return (this[0] - v[0]) ** 2 + (this[1] - v[1]) ** 2 + (this[2] - v[2]) ** 2;
    }

    /** @inheritDoc */
    public dot(v: ReadonlyVectorLike<3>): number {
        return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
    }

    /**
     * Calculates the cross product of this vector and the given one and stores the result back into this vector.
     *
     * @param v - The other vector to cross-multiply onto this one.
     */
    public cross(v: ReadonlyVectorLike<3>): this {
        const x1 = this[0], y1 = this[1], z1 = this[2];
        const x2 = v[0], y2 = v[1], z2 = v[2];
        this[0] = y1 * z2 - z1 * y2;
        this[1] = z1 * x2 - x1 * z2;
        this[2] = x1 * y2 - y1 * x2;
        return this;
    }

    /** @inheritDoc */
    public negate(): this {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        return this;
    }

    /** @inheritDoc */
    public reset(): this {
        this[0] = this[1] = this[2] = 0;
        return this;
    }

    /** @inheritDoc */
    public add(summand: ReadonlyVectorLike<3> | number): this {
        if (typeof summand === "number") {
            this[0] += summand;
            this[1] += summand;
            this[2] += summand;
        } else {
            this[0] += summand[0];
            this[1] += summand[1];
            this[2] += summand[2];
        }
        return this;
    }

    /** @inheritDoc */
    public sub(subtrahend: ReadonlyVectorLike<3> | number): this {
        if (typeof subtrahend === "number") {
            this[0] -= subtrahend;
            this[1] -= subtrahend;
            this[2] -= subtrahend;
        } else {
            this[0] -= subtrahend[0];
            this[1] -= subtrahend[1];
            this[2] -= subtrahend[2];
        }
        return this;
    }

    /** @inheritDoc */
    public mul(arg: ReadonlySquareMatrixLike<3>): this {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        this[0] = x * arg[0] + y * arg[1] + z * arg[2];
        this[1] = x * arg[3] + y * arg[4] + z * arg[5];
        this[2] = x * arg[6] + y * arg[7] + z * arg[8];
        return this;
    }

    /** @inheritDoc */
    public transposeMul(arg: ReadonlySquareMatrixLike<3>): this {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        this[0] = x * arg[0] + y * arg[3] + z * arg[6];
        this[1] = x * arg[1] + y * arg[4] + z * arg[7];
        this[2] = x * arg[2] + y * arg[5] + z * arg[8];
        return this;
    }

    /** @inheritDoc */
    public div(arg: ReadonlySquareMatrixLike<3>): this {
        const b11 = arg[0], b12 = arg[1], b13 = arg[2];
        const b21 = arg[3], b22 = arg[4], b23 = arg[5];
        const b31 = arg[6], b32 = arg[7], b33 = arg[8];

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

        const x = this[0];
        const y = this[1];
        const z = this[2];
        this[0] = x * c11 + y * c21 + z * c31;
        this[1] = x * c12 + y * c22 + z * c32;
        this[2] = x * c13 + y * c23 + z * c33;
        return this;
    }

    /** @inheritDoc */
    public transposeDiv(arg: ReadonlySquareMatrixLike<3>): this {
        const b11 = arg[0], b12 = arg[1], b13 = arg[2];
        const b21 = arg[3], b22 = arg[4], b23 = arg[5];
        const b31 = arg[6], b32 = arg[7], b33 = arg[8];

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

        const x = this[0];
        const y = this[1];
        const z = this[2];
        this[0] = x * c11 + y * c12 + z * c13;
        this[1] = x * c21 + y * c22 + z * c23;
        this[2] = x * c31 + y * c32 + z * c33;
        return this;
    }

    /** @inheritDoc */
    public compMul(arg: ReadonlyVectorLike<3> | number): this {
        if (typeof arg === "number") {
            this[0] *= arg;
            this[1] *= arg;
            this[2] *= arg;
        } else {
            this[0] *= arg[0];
            this[1] *= arg[1];
            this[2] *= arg[2];
        }
        return this;
    }

    /** @inheritDoc */
    public compDiv(divisor: ReadonlyVectorLike<3> | number): this {
        if (typeof divisor === "number") {
            this[0] /= divisor;
            this[1] /= divisor;
            this[2] /= divisor;
        } else {
            this[0] /= divisor[0];
            this[1] /= divisor[1];
            this[2] /= divisor[2];
        }
        return this;
    }

    /** @inheritDoc */
    public reflect(normal: ReadonlyVectorLike<3>): this {
        const dot2 = (normal[0] * this[0] + normal[1] * this[1] + normal[2] * this[2]) * 2;
        this[0] -= normal[0] * dot2;
        this[1] -= normal[1] * dot2;
        this[2] -= normal[2] * dot2;
        return this;
    }

    /** @inheritDoc */
    public refract(normal: ReadonlyVectorLike<3>, eta: number): this {
        const x = this[0], y = this[1], z = this[2];
        const nx = normal[0], ny = normal[1], nz = normal[2];
        const dot = x * nx + y * ny + z * nz;
        const k = 1.0 - eta * eta * (1.0 - dot * dot);
        if (k < 0.0) {
            this[0] = this[1] = this[2] = 0;
        } else {
            const f = eta * dot + Math.sqrt(k);
            this[0] = x * eta - nx * f;
            this[1] = y * eta - ny * f;
            this[2] = z * eta - nz * f;
        }
        return this;
    }

    /** @inheritDoc */
    public normalize(): this {
        const len = Math.hypot(this[0], this[1], this[2]);
        this[0] /= len;
        this[1] /= len;
        this[2] /= len;
        return this;
    }

    /** @inheritDoc */
    public radians(): this {
        this[0] = radians(this[0]);
        this[1] = radians(this[1]);
        this[2] = radians(this[2]);
        return this;
    }

    /** @inheritDoc */
    public degrees(): this {
        this[0] = degrees(this[0]);
        this[1] = degrees(this[1]);
        this[2] = degrees(this[2]);
        return this;
    }

    /** @inheritDoc */
    public sin(): this {
        this[0] = Math.sin(this[0]);
        this[1] = Math.sin(this[1]);
        this[2] = Math.sin(this[2]);
        return this;
    }

    /** @inheritDoc */
    public cos(): this {
        this[0] = Math.cos(this[0]);
        this[1] = Math.cos(this[1]);
        this[2] = Math.cos(this[2]);
        return this;
    }

    /** @inheritDoc */
    public tan(): this {
        this[0] = Math.tan(this[0]);
        this[1] = Math.tan(this[1]);
        this[2] = Math.tan(this[2]);
        return this;
    }

    /** @inheritDoc */
    public asin(): this {
        this[0] = Math.asin(this[0]);
        this[1] = Math.asin(this[1]);
        this[2] = Math.asin(this[2]);
        return this;
    }

    /** @inheritDoc */
    public acos(): this {
        this[0] = Math.acos(this[0]);
        this[1] = Math.acos(this[1]);
        this[2] = Math.acos(this[2]);
        return this;
    }

    /** @inheritDoc */
    public atan(): this {
        this[0] = Math.atan(this[0]);
        this[1] = Math.atan(this[1]);
        this[2] = Math.atan(this[2]);
        return this;
    }

    /** @inheritDoc */
    public atan2(v: ReadonlyVectorLike<3> | number): this {
        if (typeof v === "number") {
            this[0] = Math.atan2(this[0], v);
            this[1] = Math.atan2(this[1], v);
            this[2] = Math.atan2(this[2], v);
        } else {
            this[0] = Math.atan2(this[0], v[0]);
            this[1] = Math.atan2(this[1], v[1]);
            this[2] = Math.atan2(this[2], v[2]);
        }
        return this;
    }

    /** @inheritDoc */
    public sinh(): this {
        this[0] = Math.sinh(this[0]);
        this[1] = Math.sinh(this[1]);
        this[2] = Math.sinh(this[2]);
        return this;
    }

    /** @inheritDoc */
    public cosh(): this {
        this[0] = Math.cosh(this[0]);
        this[1] = Math.cosh(this[1]);
        this[2] = Math.cosh(this[2]);
        return this;
    }

    /** @inheritDoc */
    public tanh(): this {
        this[0] = Math.tanh(this[0]);
        this[1] = Math.tanh(this[1]);
        this[2] = Math.tanh(this[2]);
        return this;
    }

    /** @inheritDoc */
    public asinh(): this {
        this[0] = Math.asinh(this[0]);
        this[1] = Math.asinh(this[1]);
        this[2] = Math.asinh(this[2]);
        return this;
    }

    /** @inheritDoc */
    public acosh(): this {
        this[0] = Math.acosh(this[0]);
        this[1] = Math.acosh(this[1]);
        this[2] = Math.acosh(this[2]);
        return this;
    }

    /** @inheritDoc */
    public atanh(): this {
        this[0] = Math.atanh(this[0]);
        this[1] = Math.atanh(this[1]);
        this[2] = Math.atanh(this[2]);
        return this;
    }

    /** @inheritDoc */
    public pow(v: ReadonlyVectorLike<3> | number): this {
        if (typeof v === "number") {
            this[0] = this[0] ** v;
            this[1] = this[1] ** v;
            this[2] = this[2] ** v;
        } else {
            this[0] = this[0] ** v[0];
            this[1] = this[1] ** v[1];
            this[2] = this[2] ** v[2];
        }
        return this;
    }

    /** @inheritDoc */
    public exp(): this {
        this[0] = Math.exp(this[0]);
        this[1] = Math.exp(this[1]);
        this[2] = Math.exp(this[2]);
        return this;
    }

    /** @inheritDoc */
    public log(): this {
        this[0] = Math.log(this[0]);
        this[1] = Math.log(this[1]);
        this[2] = Math.log(this[2]);
        return this;
    }

    /** @inheritDoc */
    public exp2(): this {
        this[0] = 2 ** this[0];
        this[1] = 2 ** this[1];
        this[2] = 2 ** this[2];
        return this;
    }

    /** @inheritDoc */
    public log2(): this {
        this[0] = Math.log2(this[0]);
        this[1] = Math.log2(this[1]);
        this[2] = Math.log2(this[2]);
        return this;
    }

    /** @inheritDoc */
    public sqrt(): this {
        this[0] = Math.sqrt(this[0]);
        this[1] = Math.sqrt(this[1]);
        this[2] = Math.sqrt(this[2]);
        return this;
    }

    /** @inheritDoc */
    public inverseSqrt(): this {
        this[0] = 1 / Math.sqrt(this[0]);
        this[1] = 1 / Math.sqrt(this[1]);
        this[2] = 1 / Math.sqrt(this[2]);
        return this;
    }

    /** @inheritDoc */
    public abs(): this {
        this[0] = Math.abs(this[0]);
        this[1] = Math.abs(this[1]);
        this[2] = Math.abs(this[2]);
        return this;
    }

    /** @inheritDoc */
    public sign(): this {
        this[0] = Math.sign(this[0]);
        this[1] = Math.sign(this[1]);
        this[2] = Math.sign(this[2]);
        return this;
    }

    /** @inheritDoc */
    public floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        this[2] = Math.floor(this[2]);
        return this;
    }

    /** @inheritDoc */
    public trunc(): this {
        this[0] = Math.trunc(this[0]);
        this[1] = Math.trunc(this[1]);
        this[2] = Math.trunc(this[2]);
        return this;
    }

    /** @inheritDoc */
    public round(): this {
        this[0] = Math.round(this[0]);
        this[1] = Math.round(this[1]);
        this[2] = Math.round(this[2]);
        return this;
    }

    /** @inheritDoc */
    public roundEven(): this {
        this[0] = roundEven(this[0]);
        this[1] = roundEven(this[1]);
        this[2] = roundEven(this[2]);
        return this;
    }

    /** @inheritDoc */
    public ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        this[2] = Math.ceil(this[2]);
        return this;
    }

    /** @inheritDoc */
    public fract(): this {
        this[0] = fract(this[0]);
        this[1] = fract(this[1]);
        this[2] = fract(this[2]);
        return this;
    }

    /** @inheritDoc */
    public mod(v: ReadonlyVectorLike<3> | number): this {
        if (typeof v === "number") {
            this[0] %= v;
            this[1] %= v;
            this[2] %= v;
        } else {
            this[0] %= v[0];
            this[1] %= v[1];
            this[2] %= v[2];
        }
        return this;
    }

    /** @inheritDoc */
    public modf(i: VectorLike<3>): this {
        i[0] = this[0] | 0;
        i[1] = this[1] | 0;
        i[2] = this[2] | 0;
        this[0] %= 1;
        this[1] %= 1;
        this[2] %= 1;
        return this;
    }

    /** @inheritDoc */
    public min(v: ReadonlyVectorLike<3> | number): this {
        if (typeof v === "number") {
            this[0] = Math.min(this[0], v);
            this[1] = Math.min(this[1], v);
            this[2] = Math.min(this[2], v);
        } else {
            this[0] = Math.min(this[0], v[0]);
            this[1] = Math.min(this[1], v[1]);
            this[2] = Math.min(this[2], v[2]);
        }
        return this;
    }

    /** @inheritDoc */
    public max(v: ReadonlyVectorLike<3> | number): this {
        if (typeof v === "number") {
            this[0] = Math.max(this[0], v);
            this[1] = Math.max(this[1], v);
            this[2] = Math.max(this[2], v);
        } else {
            this[0] = Math.max(this[0], v[0]);
            this[1] = Math.max(this[1], v[1]);
            this[2] = Math.max(this[2], v[2]);
        }
        return this;
    }

    /** @inheritDoc */
    public clamp(min: ReadonlyVectorLike<3> | number,
            max: ReadonlyVectorLike<3> | number): this {
        if (typeof min === "number") {
            if (typeof max === "number") {
                this[0] = clamp(this[0], min, max);
                this[1] = clamp(this[1], min, max);
                this[2] = clamp(this[2], min, max);
            } else {
                this[0] = clamp(this[0], min, max[0]);
                this[1] = clamp(this[1], min, max[1]);
                this[2] = clamp(this[2], min, max[2]);
            }
        } else {
            if (typeof max === "number") {
                this[0] = clamp(this[0], min[0], max);
                this[1] = clamp(this[1], min[1], max);
                this[2] = clamp(this[2], min[2], max);
            } else {
                this[0] = clamp(this[0], min[0], max[0]);
                this[1] = clamp(this[1], min[1], max[1]);
                this[2] = clamp(this[2], min[2], max[2]);
            }
        }
        return this;
    }

    /** @inheritDoc */
    public mix(v: ReadonlyVectorLike<3> | number, blend: ReadonlyVectorLike<3> | number): this {
        if (typeof v === "number") {
            if (typeof blend === "number") {
                this[0] = mix(this[0], v, blend);
                this[1] = mix(this[1], v, blend);
                this[2] = mix(this[2], v, blend);
            } else {
                this[0] = mix(this[0], v, blend[0]);
                this[1] = mix(this[1], v, blend[1]);
                this[2] = mix(this[2], v, blend[2]);
            }
        } else {
            if (typeof blend === "number") {
                this[0] = mix(this[0], v[0], blend);
                this[1] = mix(this[1], v[1], blend);
                this[2] = mix(this[2], v[2], blend);
            } else {
                this[0] = mix(this[0], v[0], blend[0]);
                this[1] = mix(this[1], v[1], blend[1]);
                this[2] = mix(this[2], v[2], blend[2]);
            }
        }
        return this;
    }

    /** @inheritDoc */
    public step(edge: ReadonlyVectorLike<3> | number): this {
        if (typeof edge === "number") {
            this[0] = step(edge, this[0]);
            this[1] = step(edge, this[1]);
            this[2] = step(edge, this[2]);
        } else {
            this[0] = step(edge[0], this[0]);
            this[1] = step(edge[1], this[1]);
            this[2] = step(edge[2], this[2]);
        }
        return this;
    }

    /** @inheritDoc */
    public smoothStep(edge1: ReadonlyVectorLike<3> | number, edge2: ReadonlyVectorLike<3> | number): this {
        if (typeof edge1 === "number") {
            if (typeof edge2 === "number") {
                this[0] = smoothStep(edge1, edge2, this[0]);
                this[1] = smoothStep(edge1, edge2, this[1]);
                this[2] = smoothStep(edge1, edge2, this[2]);
            } else {
                this[0] = smoothStep(edge1, edge2[0], this[0]);
                this[1] = smoothStep(edge1, edge2[1], this[1]);
                this[2] = smoothStep(edge1, edge2[2], this[2]);
            }
        } else {
            if (typeof edge2 === "number") {
                this[0] = smoothStep(edge1[0], edge2, this[0]);
                this[1] = smoothStep(edge1[1], edge2, this[1]);
                this[2] = smoothStep(edge1[2], edge2, this[2]);
            } else {
                this[0] = smoothStep(edge1[0], edge2[0], this[0]);
                this[1] = smoothStep(edge1[1], edge2[1], this[1]);
                this[2] = smoothStep(edge1[2], edge2[2], this[2]);
            }
        }
        return this;
    }
}
