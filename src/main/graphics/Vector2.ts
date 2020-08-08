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
import { ReadonlyVectorLike, Vector, VectorLike } from "./Vector";

/**
 * JSON representation of a vector with two floating point components.
 */
export type Vector2JSON = [ number, number ];

export type Vector2Like = VectorLike<2>;

/**
 * Vector with two 32-bit floating point components. This class extends the standard Float32Array type so a vector
 * instance can be directly created from a buffer and passed to WebGL calls.
 */
export class Vector2 extends AbstractVector<2> implements Vector<2>, Cloneable<Vector2>, Serializable<Vector2JSON> {
    /**
     * Creates a new vector with all components set to 0.
     */
    public constructor();

    /**
     * Creates a new vector with the given component values.
     *
     * @param x - The initial X component value.
     * @param y - The initial Y component value.
     */
    public constructor(x: number, y: number);

    /**
     * Creates a new vector using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: StrictArrayBufferLike, offset?: number);

    public constructor(...args: [] | Vector2JSON | [ StrictArrayBufferLike, number? ]) {
        if (args.length === 0) {
            super(2);
        } else if (AbstractVector.isInitFromComponents(args)) {
            super(2);
            // Manually setting elements is much faster than passing them as array to Float32Array constructor
            this[0] = args[0];
            this[1] = args[1];
        } else {
            super(args[0], args[1] ?? 0, 2);
        }
    }

    /**
     * Creates a new vector with the given component values.
     *
     * @param vector - The initial X, Y and Z component values as a two-, three- or four-dimensional vector.
     */
    public static fromVector(vector: ReadonlyVectorLike): Vector2;

    public static fromVector(...args: Array<number | ReadonlyVectorLike>): Vector2 {
        return new this().fillComponents(args);
    }

    /**
     * Creates a new vector from the given JSON object.
     *
     * @param json - The vector JSON data.
     * @return The created vector.
     */
    public static fromJSON(json: Vector2JSON): Vector2 {
        return new Vector2(...json);
    }

    /**
     * Returns the X component value.
     *
     * @return The X component value.
     */
    public get x(): number {
        return this[0];
    }

    /**
     * Sets the X component value.
     *
     * @param x - The X component value to set.
     */
    public set x(x: number) {
        this[0] = x;
    }

    /**
     * Returns the Y component value.
     *
     * @return The Y component value.
     */
    public get y(): number {
        return this[1];
    }

    /**
     * Sets the Y component value.
     *
     * @param y - The Y component value to set.
     */
    public set y(y: number) {
        this[1] = y;
    }

    /**
     * Sets the vector component values.
     *
     * @param x - The X component value to set.
     * @param y - The Y component value to set.
     */
    public setComponents(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Sets the vector component values by copying them from the given vector.
     *
     * @param vector - The vector to copy the X and Y component values from.
     */
    public setVector(vector: ReadonlyVectorLike): this {
        this[0] = vector[0];
        this[1] = vector[1];
        return this;
    }

    /** @inheritDoc */
    public clone(): Vector2 {
        return new Vector2(this[0], this[1]);
    }

    /** @inheritDoc */
    public toJSON(): Vector2JSON {
        return [ this[0], this[1] ];
    }

    /** @inheritDoc */
    public equals(obj: unknown): boolean {
        return isEqual(this, obj, other => this[0] === other[0] && this[1] === other[1]);
    }

    /** @inheritDoc */
    public getSquareLength(): number {
        return this[0] ** 2 + this[1] ** 2;
    }

    /** @inheritDoc */
    public getSquareDistance(v: ReadonlyVectorLike<2>): number {
        return (this[0] - v[0]) ** 2 + (this[1] - v[1]) ** 2;
    }

    /** @inheritDoc */
    public dot(v: ReadonlyVectorLike<2>): number {
        return this[0] * v[0] + this[1] * v[1];
    }

    /** @inheritDoc */
    public negate(): this {
        this[0] = -this[0];
        this[1] = -this[1];
        return this;
    }

    /** @inheritDoc */
    public add(summand: ReadonlyVectorLike<2> | number): this {
        if (typeof summand === "number") {
            this[0] += summand;
            this[1] += summand;
        } else {
            this[0] += summand[0];
            this[1] += summand[1];
        }
        return this;
    }

    /** @inheritDoc */
    public sub(subtrahend: ReadonlyVectorLike<2> | number): this {
        if (typeof subtrahend === "number") {
            this[0] -= subtrahend;
            this[1] -= subtrahend;
        } else {
            this[0] -= subtrahend[0];
            this[1] -= subtrahend[1];
        }
        return this;
    }

    /** @inheritDoc */
    public mul(arg: ReadonlySquareMatrixLike<2>): this {
        const x = this[0];
        const y = this[1];
        this[0] = x * arg[0] + y * arg[2];
        this[1] = x * arg[1] + y * arg[3];
        return this;
    }

    /** @inheritDoc */
    public transposeMul(arg: ReadonlySquareMatrixLike<2>): this {
        const x = this[0];
        const y = this[1];
        this[0] = x * arg[0] + y * arg[1];
        this[1] = x * arg[2] + y * arg[3];
        return this;
    }

    /** @inheritDoc */
    public div(arg: ReadonlySquareMatrixLike<2>): this {
        const b11 = arg[0], b12 = arg[1];
        const b21 = arg[2], b22 = arg[3];

        // d = determinant(b)
        const d = b11 * b22 - b12 * b21;

        // c = invert(b)
        const c11 = b22 / d;
        const c12 = -b12 / d;
        const c21 = -b21 / d;
        const c22 = b11 / d;

        // this = this * c
        const x = this[0];
        const y = this[1];
        this[0] = x * c11 + y * c21;
        this[1] = x * c12 + y * c22;

        return this;
    }

    /** @inheritDoc */
    public transposeDiv(arg: ReadonlySquareMatrixLike<2>): this {
        const b11 = arg[0], b12 = arg[1];
        const b21 = arg[2], b22 = arg[3];

        // d = determinant(b)
        const d = b11 * b22 - b12 * b21;

        // c = invert(b)
        const c11 = b22 / d;
        const c12 = -b12 / d;
        const c21 = -b21 / d;
        const c22 = b11 / d;

        const x = this[0];
        const y = this[1];
        this[0] = x * c11 + y * c12;
        this[1] = x * c21 + y * c22;
        return this;
    }

    /** @inheritDoc */
    public compMul(factor: ReadonlyVectorLike<2> | number): this {
        if (typeof factor === "number") {
            this[0] *= factor;
            this[1] *= factor;
        } else {
            this[0] *= factor[0];
            this[1] *= factor[1];
        }
        return this;
    }

    /** @inheritDoc */
    public compDiv(divisor: ReadonlyVectorLike<2> | number): this {
        if (typeof divisor === "number") {
            this[0] /= divisor;
            this[1] /= divisor;
        } else {
            this[0] /= divisor[0];
            this[1] /= divisor[1];
        }
        return this;
    }

    /** @inheritDoc */
    public reflect(normal: ReadonlyVectorLike<2>): this {
        const x = this[0], y = this[1];
        const nx = normal[0], ny = normal[1];
        const dot2 = (nx * x + ny * y) * 2;
        this[0] = x - nx * dot2;
        this[1] = y - ny * dot2;
        return this;
    }

    /** @inheritDoc */
    public refract(normal: ReadonlyVectorLike<2>, eta: number): this {
        const x = this[0], y = this[1];
        const nx = normal[0], ny = normal[1];
        const dot = x * nx + y * ny;
        const k = 1.0 - eta * eta * (1.0 - dot * dot);
        if (k < 0.0) {
            this[0] = this[1] = 0;
        } else {
            const f = eta * dot + Math.sqrt(k);
            this[0] = x * eta - nx * f;
            this[1] = y * eta - ny * f;
        }
        return this;
    }

    /** @inheritDoc */
    public normalize(): this {
        const len = Math.hypot(this[0], this[1]);
        this[0] /= len;
        this[1] /= len;
        return this;
    }

    /** @inheritDoc */
    public radians(): this {
        this[0] = radians(this[0]);
        this[1] = radians(this[1]);
        return this;
    }

    /** @inheritDoc */
    public degrees(): this {
        this[0] = degrees(this[0]);
        this[1] = degrees(this[1]);
        return this;
    }

    /** @inheritDoc */
    public sin(): this {
        this[0] = Math.sin(this[0]);
        this[1] = Math.sin(this[1]);
        return this;
    }

    /** @inheritDoc */
    public cos(): this {
        this[0] = Math.cos(this[0]);
        this[1] = Math.cos(this[1]);
        return this;
    }

    /** @inheritDoc */
    public tan(): this {
        this[0] = Math.tan(this[0]);
        this[1] = Math.tan(this[1]);
        return this;
    }

    /** @inheritDoc */
    public asin(): this {
        this[0] = Math.asin(this[0]);
        this[1] = Math.asin(this[1]);
        return this;
    }

    /** @inheritDoc */
    public acos(): this {
        this[0] = Math.acos(this[0]);
        this[1] = Math.acos(this[1]);
        return this;
    }

    /** @inheritDoc */
    public atan(): this {
        this[0] = Math.atan(this[0]);
        this[1] = Math.atan(this[1]);
        return this;
    }

    /** @inheritDoc */
    public atan2(v: ReadonlyVectorLike<2> | number): this {
        if (typeof v === "number") {
            this[0] = Math.atan2(this[0], v);
            this[1] = Math.atan2(this[1], v);
        } else {
            this[0] = Math.atan2(this[0], v[0]);
            this[1] = Math.atan2(this[1], v[1]);
        }
        return this;
    }

    /** @inheritDoc */
    public sinh(): this {
        this[0] = Math.sinh(this[0]);
        this[1] = Math.sinh(this[1]);
        return this;
    }

    /** @inheritDoc */
    public cosh(): this {
        this[0] = Math.cosh(this[0]);
        this[1] = Math.cosh(this[1]);
        return this;
    }

    /** @inheritDoc */
    public tanh(): this {
        this[0] = Math.tanh(this[0]);
        this[1] = Math.tanh(this[1]);
        return this;
    }

    /** @inheritDoc */
    public asinh(): this {
        this[0] = Math.asinh(this[0]);
        this[1] = Math.asinh(this[1]);
        return this;
    }

    /** @inheritDoc */
    public acosh(): this {
        this[0] = Math.acosh(this[0]);
        this[1] = Math.acosh(this[1]);
        return this;
    }

    /** @inheritDoc */
    public atanh(): this {
        this[0] = Math.atanh(this[0]);
        this[1] = Math.atanh(this[1]);
        return this;
    }

    /** @inheritDoc */
    public pow(v: ReadonlyVectorLike<2> | number): this {
        if (typeof v === "number") {
            this[0] = this[0] ** v;
            this[1] = this[1] ** v;
        } else {
            this[0] = this[0] ** v[0];
            this[1] = this[1] ** v[1];
        }
        return this;
    }

    /** @inheritDoc */
    public exp(): this {
        this[0] = Math.exp(this[0]);
        this[1] = Math.exp(this[1]);
        return this;
    }

    /** @inheritDoc */
    public log(): this {
        this[0] = Math.log(this[0]);
        this[1] = Math.log(this[1]);
        return this;
    }

    /** @inheritDoc */
    public exp2(): this {
        this[0] = 2 ** this[0];
        this[1] = 2 ** this[1];
        return this;
    }

    /** @inheritDoc */
    public log2(): this {
        this[0] = Math.log2(this[0]);
        this[1] = Math.log2(this[1]);
        return this;
    }

    /** @inheritDoc */
    public sqrt(): this {
        this[0] = Math.sqrt(this[0]);
        this[1] = Math.sqrt(this[1]);
        return this;
    }

    /** @inheritDoc */
    public inverseSqrt(): this {
        this[0] = 1 / Math.sqrt(this[0]);
        this[1] = 1 / Math.sqrt(this[1]);
        return this;
    }

    /** @inheritDoc */
    public abs(): this {
        this[0] = Math.abs(this[0]);
        this[1] = Math.abs(this[1]);
        return this;
    }

    /** @inheritDoc */
    public sign(): this {
        this[0] = Math.sign(this[0]);
        this[1] = Math.sign(this[1]);
        return this;
    }

    /** @inheritDoc */
    public floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        return this;
    }

    /** @inheritDoc */
    public trunc(): this {
        this[0] = Math.trunc(this[0]);
        this[1] = Math.trunc(this[1]);
        return this;
    }

    /** @inheritDoc */
    public round(): this {
        this[0] = Math.round(this[0]);
        this[1] = Math.round(this[1]);
        return this;
    }

    /** @inheritDoc */
    public roundEven(): this {
        this[0] = roundEven(this[0]);
        this[1] = roundEven(this[1]);
        return this;
    }

    /** @inheritDoc */
    public ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        return this;
    }

    /** @inheritDoc */
    public fract(): this {
        this[0] = fract(this[0]);
        this[1] = fract(this[1]);
        return this;
    }

    /** @inheritDoc */
    public mod(v: ReadonlyVectorLike<2> | number): this {
        if (typeof v === "number") {
            this[0] = this[0] % v;
            this[1] = this[1] % v;
        } else {
            this[0] = this[0] % v[0];
            this[1] = this[1] % v[1];
        }
        return this;
    }

    /** @inheritDoc */
    public modf(i: VectorLike<2>): this {
        i[0] = this[0] | 0;
        i[1] = this[1] | 0;
        this[0] = this[0] % 1;
        this[1] = this[1] % 1;
        return this;
    }

    /** @inheritDoc */
    public min(v: ReadonlyVectorLike<2> | number): this {
        if (typeof v === "number") {
            this[0] = Math.min(this[0], v);
            this[1] = Math.min(this[1], v);
        } else {
            this[0] = Math.min(this[0], v[0]);
            this[1] = Math.min(this[1], v[1]);
        }
        return this;
    }

    /** @inheritDoc */
    public max(v: ReadonlyVectorLike<2> | number): this {
        if (typeof v === "number") {
            this[0] = Math.max(this[0], v);
            this[1] = Math.max(this[1], v);
        } else {
            this[0] = Math.max(this[0], v[0]);
            this[1] = Math.max(this[1], v[1]);
        }
        return this;
    }

    /** @inheritDoc */
    public clamp(min: ReadonlyVectorLike<2> | number,
            max: ReadonlyVectorLike<2> | number): this {
        if (typeof min === "number") {
            if (typeof max === "number") {
                this[0] = clamp(this[0], min, max);
                this[1] = clamp(this[1], min, max);
            } else {
                this[0] = clamp(this[0], min, max[0]);
                this[1] = clamp(this[1], min, max[1]);
            }
        } else {
            if (typeof max === "number") {
                this[0] = clamp(this[0], min[0], max);
                this[1] = clamp(this[1], min[1], max);
            } else {
                this[0] = clamp(this[0], min[0], max[0]);
                this[1] = clamp(this[1], min[1], max[1]);
            }
        }
        return this;
    }

    /** @inheritDoc */
    public mix(v: ReadonlyVectorLike<2> | number,
            blend: ReadonlyVectorLike<2> | number): this {
        if (typeof v === "number") {
            if (typeof blend === "number") {
                this[0] = mix(this[0], v, blend);
                this[1] = mix(this[1], v, blend);
            } else {
                this[0] = mix(this[0], v, blend[0]);
                this[1] = mix(this[1], v, blend[1]);
            }
        } else {
            if (typeof blend === "number") {
                this[0] = mix(this[0], v[0], blend);
                this[1] = mix(this[1], v[1], blend);
            } else {
                this[0] = mix(this[0], v[0], blend[0]);
                this[1] = mix(this[1], v[1], blend[1]);
            }
        }
        return this;
    }

    /** @inheritDoc */
    public step(edge: ReadonlyVectorLike<2> | number): this {
        if (typeof edge === "number") {
            this[0] = step(edge, this[0]);
            this[1] = step(edge, this[1]);
        } else {
            this[0] = step(edge[0], this[0]);
            this[1] = step(edge[1], this[1]);
        }
        return this;
    }

    /** @inheritDoc */
    public smoothStep(edge1: ReadonlyVectorLike<2> | number,
            edge2: ReadonlyVectorLike<2> | number): this {
        if (typeof edge1 === "number") {
            if (typeof edge2 === "number") {
                this[0] = smoothStep(edge1, edge2, this[0]);
                this[1] = smoothStep(edge1, edge2, this[1]);
            } else {
                this[0] = smoothStep(edge1, edge2[0], this[0]);
                this[1] = smoothStep(edge1, edge2[1], this[1]);
            }
        } else {
            if (typeof edge2 === "number") {
                this[0] = smoothStep(edge1[0], edge2, this[0]);
                this[1] = smoothStep(edge1[1], edge2, this[1]);
            } else {
                this[0] = smoothStep(edge1[0], edge2[0], this[0]);
                this[1] = smoothStep(edge1[1], edge2[1], this[1]);
            }
        }
        return this;
    }
}
