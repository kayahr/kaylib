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
 * JSON representation of a vector with three floating point components.
 */
export type Vector3JSON = [ number, number, number ];

export type Vector3Like = VectorLike<3>;

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
     * Creates a new vector with all components set to the given value.
     *
     * @param xyz - The value to initialize each vector component with.
     */
    public constructor(xyz: number);

    /**
     * Creates a new vector with the given component values.
     *
     * @param x - The initial X component value.
     * @param y - The initial Y component value.
     * @param z - The initial Z component value.
     */
    public constructor(x: number, y: number, z: number);

    /**
     * Creates a new vector with the given component values.
     *
     * @param x  - The initial X component value.
     * @param yz - The initial Y and Z component values as a two-dimensional vector.
     */
    public constructor(x: number, yz: ReadonlyVectorLike<2>);

    /**
     * Creates a new vector with the given component values.
     *
     * @param xy - The initial X and Y component values as a two-dimensional vector.
     * @param z  - The initial Z component value.
     */
    public constructor(xy: ReadonlyVectorLike<2>, z: number);

    /**
     * Creates a new vector with the given component values.
     *
     * @param xyz - The initial X, Y and Z component values as a three- or four-dimensional vector.
     */
    public constructor(xyz: ReadonlyVectorLike<3 | 4>);

    /**
     * Creates a new vector using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: ArrayBuffer | SharedArrayBuffer, offset?: number);

    public constructor(...args: Array<number | ReadonlyVectorLike> | [ ArrayBuffer | SharedArrayBuffer, number? ]) {
        if (args.length === 0) {
            super(3);
        } else if (AbstractVector.isInitFromArrayBuffer(args)) {
            super(args[0], args[1] ?? 0, 3);
        } else {
            super(3);
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

    public set(xyz: number): this;
    public set(x: number, y: number, z: number): this;
    public set(xy: ReadonlyVectorLike<2>, z: number): this;
    public set(x: number, yz: ReadonlyVectorLike<2>): this;
    public set(xyz: ReadonlyVectorLike<3 | 4>): this;
    public set(...args: Array<number | ReadonlyVectorLike>): this {
        return this.setValues(args);
    }

    /** @inheritDoc */
    public clone(): Vector3 {
        return new Vector3(this);
    }

    /** @inheritDoc */
    public toJSON(fractionDigits?: number): Vector3JSON {
        if (fractionDigits != null) {
            return [
                +this[0].toFixed(fractionDigits),
                +this[1].toFixed(fractionDigits),
                +this[2].toFixed(fractionDigits)
            ];
        } else {
            return [ this[0], this[1], this[2] ];
        }
    }

    public static fromJSON(json: Vector3JSON): Vector3 {
        return new Vector3(...json);
    }

    /**
     * Creates a result vector initialized with the given component values. This is used internally to create result
     * vectors returned by the various methods.
     *
     * @param result - The result vector to re-use. A new one is created when undefined.
     * @param x - The X component value.
     * @param y - The Y component value.
     * @param z - The Z component value.
     * @return The result vector. Either a new one or the specified result vector.
     * @hidden
     */
    public static createResult<T extends Vector3Like = Vector3>(result: T | undefined, x: number, y: number,
            z: number): T {
        if (result != null) {
            result[0] = x;
            result[1] = y;
            result[2] = z;
            return result;
        } else {
            return new Vector3(x, y, z) as unknown as T;
        }
    }

    /** @inheritDoc */
    public equals(obj: unknown, fractionDigits?: number): boolean {
        return isEqual(this, obj, other => {
            if (fractionDigits != null) {
                return this[0].toFixed(fractionDigits) === other[0].toFixed(fractionDigits)
                    && this[1].toFixed(fractionDigits) === other[1].toFixed(fractionDigits)
                    && this[2].toFixed(fractionDigits) === other[2].toFixed(fractionDigits);
            } else {
                return this[0] === other[0] && this[1] === other[1] && this[2] === other[2];
            }
        });
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
    public cross<T extends Vector3Like = Vector3>(v: ReadonlyVectorLike<3>, result?: T): T {
        const x1 = this[0], y1 = this[1], z1 = this[2];
        const x2 = v[0], y2 = v[1], z2 = v[2];
        return Vector3.createResult(result,
            y1 * z2 - z1 * y2,
            z1 * x2 - x1 * z2,
            x1 * y2 - y1 * x2
        );
    }

    /** @inheritDoc */
    public negate<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result, -this[0], -this[1], -this[2]);
    }

    /** @inheritDoc */
    public add<T extends Vector3Like = Vector3>(summand: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof summand === "number") {
            return Vector3.createResult(result,
                this[0] + summand,
                this[1] + summand,
                this[2] + summand
            );
        } else {
            return Vector3.createResult(result,
                this[0] + summand[0],
                this[1] + summand[1],
                this[2] + summand[2]
            );
        }
    }

    /** @inheritDoc */
    public sub<T extends Vector3Like = Vector3>(subtrahend: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof subtrahend === "number") {
            return Vector3.createResult(result,
                this[0] - subtrahend,
                this[1] - subtrahend,
                this[2] - subtrahend
            );
        } else {
            return Vector3.createResult(result,
                this[0] - subtrahend[0],
                this[1] - subtrahend[1],
                this[2] - subtrahend[2]
            );
        }
    }

    /** @inheritDoc */
    public mul<T extends Vector3Like = Vector3>(arg: ReadonlyMatrixLike<3, 3>, result?: T): T {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        return Vector3.createResult(result,
            x * arg[0] + y * arg[1] + z * arg[2],
            x * arg[3] + y * arg[4] + z * arg[5],
            x * arg[6] + y * arg[7] + z * arg[8]
        );
    }

    /** @inheritDoc */
    public transposeMul<T extends Vector3Like = Vector3>(arg: ReadonlyMatrixLike<3, 3>, result?: T): T {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        return Vector3.createResult(result,
            x * arg[0] + y * arg[3] + z * arg[6],
            x * arg[1] + y * arg[4] + z * arg[7],
            x * arg[2] + y * arg[5] + z * arg[8]
        );
    }

    /** @inheritDoc */
    public div<T extends Vector3Like = Vector3>(arg: ReadonlyMatrixLike<3, 3>, result?: T): T {
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
        return Vector3.createResult(result,
            x * c11 + y * c21 + z * c31,
            x * c12 + y * c22 + z * c32,
            x * c13 + y * c23 + z * c33
        );
    }

    /** @inheritDoc */
    public transposeDiv<T extends Vector3Like = Vector3>(arg: ReadonlyMatrixLike<3, 3>, result?: T): T {
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
        return Vector3.createResult(result,
            x * c11 + y * c12 + z * c13,
            x * c21 + y * c22 + z * c23,
            x * c31 + y * c32 + z * c33
        );
    }

    /** @inheritDoc */
    public compMul<T extends Vector3Like = Vector3>(arg: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof arg === "number") {
            return Vector3.createResult(result,
                this[0] * arg,
                this[1] * arg,
                this[2] * arg
            );
        } else {
            return Vector3.createResult(result,
                this[0] * arg[0],
                this[1] * arg[1],
                this[2] * arg[2]
            );
        }
    }

    /** @inheritDoc */
    public compDiv<T extends Vector3Like = Vector3>(divisor: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof divisor === "number") {
            return Vector3.createResult(result,
                this[0] / divisor,
                this[1] / divisor,
                this[2] / divisor
            );
        } else {
            return Vector3.createResult(result,
                this[0] / divisor[0],
                this[1] / divisor[1],
                this[2] / divisor[2]
            );
        }
    }

    /** @inheritDoc */
    public reflect<T extends Vector3Like = Vector3>(normal: ReadonlyVectorLike<3>, result?: T): T {
        const dot2 = (normal[0] * this[0] + normal[1] * this[1] + normal[2] * this[2]) * 2;
        return Vector3.createResult(result,
            this[0] - normal[0] * dot2,
            this[1] - normal[1] * dot2,
            this[2] - normal[2] * dot2
        );
    }

    /** @inheritDoc */
    public refract<T extends Vector3Like = Vector3>(normal: ReadonlyVectorLike<3>, eta: number, result?: T): T {
        const x = this[0], y = this[1], z = this[2];
        const nx = normal[0], ny = normal[1], nz = normal[2];
        const dot = x * nx + y * ny + z * nz;
        const k = 1.0 - eta * eta * (1.0 - dot * dot);
        if (k < 0.0) {
            return Vector3.createResult(result, 0, 0, 0);
        } else {
            const f = eta * dot + Math.sqrt(k);
            return Vector3.createResult(result,
                x * eta - nx * f,
                y * eta - ny * f,
                z * eta - nz * f
            );
        }
    }

    /** @inheritDoc */
    public normalize<T extends Vector3Like = Vector3>(result?: T): T {
        return this.compDiv(this.getLength(), result);
    }

    /** @inheritDoc */
    public radians<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            radians(this[0]),
            radians(this[1]),
            radians(this[2])
        );
    }

    /** @inheritDoc */
    public degrees<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            degrees(this[0]),
            degrees(this[1]),
            degrees(this[2])
        );
    }

    /** @inheritDoc */
    public sin<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.sin(this[0]),
            Math.sin(this[1]),
            Math.sin(this[2])
        );
    }

    /** @inheritDoc */
    public cos<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.cos(this[0]),
            Math.cos(this[1]),
            Math.cos(this[2])
        );
    }

    /** @inheritDoc */
    public tan<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.tan(this[0]),
            Math.tan(this[1]),
            Math.tan(this[2])
        );
    }

    /** @inheritDoc */
    public asin<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.asin(this[0]),
            Math.asin(this[1]),
            Math.asin(this[2])
        );
    }

    /** @inheritDoc */
    public acos<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.acos(this[0]),
            Math.acos(this[1]),
            Math.acos(this[2])
        );
    }

    /** @inheritDoc */
    public atan<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.atan(this[0]),
            Math.atan(this[1]),
            Math.atan(this[2])
        );
    }

    /** @inheritDoc */
    public atan2<T extends Vector3Like = Vector3>(v: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector3.createResult(result,
                Math.atan2(this[0], v),
                Math.atan2(this[1], v),
                Math.atan2(this[2], v)
            );
        } else {
            return Vector3.createResult(result,
                Math.atan2(this[0], v[0]),
                Math.atan2(this[1], v[1]),
                Math.atan2(this[2], v[2])
            );
        }
    }

    /** @inheritDoc */
    public sinh<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.sinh(this[0]),
            Math.sinh(this[1]),
            Math.sinh(this[2])
        );
    }

    /** @inheritDoc */
    public cosh<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.cosh(this[0]),
            Math.cosh(this[1]),
            Math.cosh(this[2])
        );
    }

    /** @inheritDoc */
    public tanh<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.tanh(this[0]),
            Math.tanh(this[1]),
            Math.tanh(this[2])
        );
    }

    /** @inheritDoc */
    public asinh<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.asinh(this[0]),
            Math.asinh(this[1]),
            Math.asinh(this[2])
        );
    }

    /** @inheritDoc */
    public acosh<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.acosh(this[0]),
            Math.acosh(this[1]),
            Math.acosh(this[2])
        );
    }

    /** @inheritDoc */
    public atanh<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.atanh(this[0]),
            Math.atanh(this[1]),
            Math.atanh(this[2])
        );
    }

    /** @inheritDoc */
    public pow<T extends Vector3Like = Vector3>(v: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector3.createResult(result,
                this[0] ** v,
                this[1] ** v,
                this[2] ** v
            );
        } else {
            return Vector3.createResult(result,
                this[0] ** v[0],
                this[1] ** v[1],
                this[2] ** v[2]
            );
        }
    }

    /** @inheritDoc */
    public exp<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.exp(this[0]),
            Math.exp(this[1]),
            Math.exp(this[2])
        );
    }

    /** @inheritDoc */
    public log<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.log(this[0]),
            Math.log(this[1]),
            Math.log(this[2])
        );
    }

    /** @inheritDoc */
    public exp2<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            2 ** this[0],
            2 ** this[1],
            2 ** this[2]
        );
    }

    /** @inheritDoc */
    public log2<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.log2(this[0]),
            Math.log2(this[1]),
            Math.log2(this[2])
        );
    }

    /** @inheritDoc */
    public sqrt<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.sqrt(this[0]),
            Math.sqrt(this[1]),
            Math.sqrt(this[2])
        );
    }

    /** @inheritDoc */
    public inverseSqrt<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            1 / Math.sqrt(this[0]),
            1 / Math.sqrt(this[1]),
            1 / Math.sqrt(this[2])
        );
    }

    /** @inheritDoc */
    public abs<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.abs(this[0]),
            Math.abs(this[1]),
            Math.abs(this[2])
        );
    }

    /** @inheritDoc */
    public sign<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.sign(this[0]),
            Math.sign(this[1]),
            Math.sign(this[2])
        );
    }

    /** @inheritDoc */
    public floor<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.floor(this[0]),
            Math.floor(this[1]),
            Math.floor(this[2])
        );
    }

    /** @inheritDoc */
    public trunc<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.trunc(this[0]),
            Math.trunc(this[1]),
            Math.trunc(this[2])
        );
    }

    /** @inheritDoc */
    public round<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.round(this[0]),
            Math.round(this[1]),
            Math.round(this[2])
        );
    }

    /** @inheritDoc */
    public roundEven<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            roundEven(this[0]),
            roundEven(this[1]),
            roundEven(this[2])
        );
    }

    /** @inheritDoc */
    public ceil<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            Math.ceil(this[0]),
            Math.ceil(this[1]),
            Math.ceil(this[2])
        );
    }

    /** @inheritDoc */
    public fract<T extends Vector3Like = Vector3>(result?: T): T {
        return Vector3.createResult(result,
            fract(this[0]),
            fract(this[1]),
            fract(this[2])
        );
    }

    /** @inheritDoc */
    public mod<T extends Vector3Like = Vector3>(v: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector3.createResult(result,
                this[0] % v,
                this[1] % v,
                this[2] % v
            );
        } else {
            return Vector3.createResult(result,
                this[0] % v[0],
                this[1] % v[1],
                this[2] % v[2]
            );
        }
    }

    /** @inheritDoc */
    public modf<T extends Vector3Like = Vector3>(i: VectorLike<3>, result?: T): T {
        i[0] = this[0] | 0;
        i[1] = this[1] | 0;
        i[2] = this[2] | 0;
        return Vector3.createResult(result,
            this[0] % 1,
            this[1] % 1,
            this[2] % 1
        );
    }

    /** @inheritDoc */
    public min<T extends Vector3Like = Vector3>(v: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector3.createResult(result,
                Math.min(this[0], v),
                Math.min(this[1], v),
                Math.min(this[2], v)
            );
        } else {
            return Vector3.createResult(result,
                Math.min(this[0], v[0]),
                Math.min(this[1], v[1]),
                Math.min(this[2], v[2])
            );
        }
    }

    /** @inheritDoc */
    public max<T extends Vector3Like = Vector3>(v: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector3.createResult(result,
                Math.max(this[0], v),
                Math.max(this[1], v),
                Math.max(this[2], v)
            );
        } else {
            return Vector3.createResult(result,
                Math.max(this[0], v[0]),
                Math.max(this[1], v[1]),
                Math.max(this[2], v[2])
            );
        }
    }

    /** @inheritDoc */
    public clamp<T extends Vector3Like = Vector3>(min: ReadonlyVectorLike<3> | number,
            max: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof min === "number") {
            if (typeof max === "number") {
                return Vector3.createResult(result,
                    clamp(this[0], min, max),
                    clamp(this[1], min, max),
                    clamp(this[2], min, max)
                );
            } else {
                return Vector3.createResult(result,
                    clamp(this[0], min, max[0]),
                    clamp(this[1], min, max[1]),
                    clamp(this[2], min, max[2])
                );
            }
        } else {
            if (typeof max === "number") {
                return Vector3.createResult(result,
                    clamp(this[0], min[0], max),
                    clamp(this[1], min[1], max),
                    clamp(this[2], min[2], max)
                );
            } else {
                return Vector3.createResult(result,
                    clamp(this[0], min[0], max[0]),
                    clamp(this[1], min[1], max[1]),
                    clamp(this[2], min[2], max[2])
                );
            }
        }
    }

    /** @inheritDoc */
    public mix<T extends Vector3Like = Vector3>(v: ReadonlyVectorLike<3> | number,
            blend: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof v === "number") {
            if (typeof blend === "number") {
                return Vector3.createResult(result,
                    mix(this[0], v, blend),
                    mix(this[1], v, blend),
                    mix(this[2], v, blend)
                );
            } else {
                return Vector3.createResult(result,
                    mix(this[0], v, blend[0]),
                    mix(this[1], v, blend[1]),
                    mix(this[2], v, blend[2])
                );
            }
        } else {
            if (typeof blend === "number") {
                return Vector3.createResult(result,
                    mix(this[0], v[0], blend),
                    mix(this[1], v[1], blend),
                    mix(this[2], v[2], blend)
                );
            } else {
                return Vector3.createResult(result,
                    mix(this[0], v[0], blend[0]),
                    mix(this[1], v[1], blend[1]),
                    mix(this[2], v[2], blend[2])
                );
            }
        }
    }

    /** @inheritDoc */
    public step<T extends Vector3Like = Vector3>(edge: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof edge === "number") {
            return Vector3.createResult(result,
                step(edge, this[0]),
                step(edge, this[1]),
                step(edge, this[2])
            );
        } else {
            return Vector3.createResult(result,
                step(edge[0], this[0]),
                step(edge[1], this[1]),
                step(edge[2], this[2])
            );
        }
    }

    /** @inheritDoc */
    public smoothStep<T extends Vector3Like = Vector3>(edge1: ReadonlyVectorLike<3> | number,
            edge2: ReadonlyVectorLike<3> | number, result?: T): T {
        if (typeof edge1 === "number") {
            if (typeof edge2 === "number") {
                return Vector3.createResult(result,
                    smoothStep(edge1, edge2, this[0]),
                    smoothStep(edge1, edge2, this[1]),
                    smoothStep(edge1, edge2, this[2])
                );
            } else {
                return Vector3.createResult(result,
                    smoothStep(edge1, edge2[0], this[0]),
                    smoothStep(edge1, edge2[1], this[1]),
                    smoothStep(edge1, edge2[2], this[2])
                );
            }
        } else {
            if (typeof edge2 === "number") {
                return Vector3.createResult(result,
                    smoothStep(edge1[0], edge2, this[0]),
                    smoothStep(edge1[1], edge2, this[1]),
                    smoothStep(edge1[2], edge2, this[2])
                );
            } else {
                return Vector3.createResult(result,
                    smoothStep(edge1[0], edge2[0], this[0]),
                    smoothStep(edge1[1], edge2[1], this[1]),
                    smoothStep(edge1[2], edge2[2], this[2])
                );
            }
        }
    }
}
