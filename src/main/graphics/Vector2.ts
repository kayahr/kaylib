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
     * Creates a new vector with all components set to the given value.
     *
     * @param xy - The value to initialize each vector component with.
     */
    public constructor(xy: number);

    /**
     * Creates a new vector with the given component values.
     *
     * @param x - The initial X component value.
     * @param y - The initial Y component value.
     */
    public constructor(x: number, y: number);

    /**
     * Creates a new vector by copying the component values from another vector.
     *
     * @param xy - The other vector to copy the X and Y component values from.
     */
    public constructor(xy: ReadonlyVectorLike);

    /**
     * Creates a new vector using the given array buffer as component values.
     *
     * @param buffer - The array buffer to use.
     * @param offset - Optional byte offset within the array buffer. Defaults to 0.
     */
    public constructor(buffer: ArrayBuffer | SharedArrayBuffer, offset?: number);

    public constructor(...args: Array<number | ReadonlyVectorLike> | [ ArrayBuffer | SharedArrayBuffer, number? ]) {
        if (args.length === 0) {
            super(2);
        } else if (AbstractVector.isInitFromArrayBuffer(args)) {
            super(args[0], args[1] ?? 0, 2);
        } else {
            super(2);
            this.setValues(args);
        }
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
     * Sets all vector component values to the given value.
     *
     * @param xy - The value to set for each vector component value.
     */
    public set(xy: number): this;

    /**
     * Sets the vector component values.
     *
     * @param x - The X component value to set.
     * @param y - The Y component value to set.
     */
    public set(x: number, y: number): this;

    /**
     * Sets the vector component values by copying them from the given vector.
     *
     * @param xy - The vector to copy the X and Y component values from.
     */
    public set(xy: ReadonlyVectorLike): this;

    public set(...args: Array<number | ReadonlyVectorLike>): this {
        return this.setValues(args);
    }

    /** @inheritDoc */
    public clone(): Vector2 {
        return new Vector2(this);
    }

    /** @inheritDoc */
    public toJSON(fractionDigits?: number): Vector2JSON {
        if (fractionDigits != null) {
            return [ +this[0].toFixed(fractionDigits), +this[1].toFixed(fractionDigits) ];
        } else {
            return [ this[0], this[1] ];
        }
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
     * Creates a result vector initialized with the given component values. This is used internally to create result
     * vectors returned by the various methods.
     *
     * @param result - The result vector to re-use. A new one is created when undefined.
     * @param x - The X component value.
     * @param y - The Y component value.
     * @return The result vector. Either a new one or the specified result vector.
     * @hidden
     */
    public static createResult<T extends Vector2Like = Vector2>(result: T | undefined, x: number, y: number): T {
        if (result != null) {
            result[0] = x;
            result[1] = y;
            return result;
        } else {
            return new Vector2(x, y) as unknown as T;
        }
    }

    /** @inheritDoc */
    public equals(obj: unknown, fractionDigits?: number): boolean {
        return isEqual(this, obj, other => {
            if (fractionDigits != null) {
                return this[0].toFixed(fractionDigits) === other[0].toFixed(fractionDigits)
                    && this[1].toFixed(fractionDigits) === other[1].toFixed(fractionDigits);
            } else {
                return this[0] === other[0] && this[1] === other[1];
            }
        });
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
    public negate<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            -this[0],
            -this[1]
        );
    }

    /** @inheritDoc */
    public add<T extends Vector2Like = Vector2>(summand: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof summand === "number") {
            return Vector2.createResult(result,
                this[0] + summand,
                this[1] + summand
            );
        } else {
            return Vector2.createResult(result,
                this[0] + summand[0],
                this[1] + summand[1]
            );
        }
    }

    /** @inheritDoc */
    public sub<T extends Vector2Like = Vector2>(subtrahend: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof subtrahend === "number") {
            return Vector2.createResult(result,
                this[0] - subtrahend,
                this[1] - subtrahend
            );
        } else {
            return Vector2.createResult(result,
                this[0] - subtrahend[0],
                this[1] - subtrahend[1]
            );
        }
    }

    /** @inheritDoc */
    public mul<T extends Vector2Like = Vector2>(arg: ReadonlyMatrixLike<2, 2>, result?: T): T {
        const x = this[0];
        const y = this[1];
        return Vector2.createResult(result,
            x * arg[0] + y * arg[2],
            x * arg[1] + y * arg[3]
        );
    }

    /** @inheritDoc */
    public transposeMul<T extends Vector2Like = Vector2>(arg: ReadonlyMatrixLike<2, 2>, result?: T): T {
        const x = this[0];
        const y = this[1];
        return Vector2.createResult(result,
            x * arg[0] + y * arg[1],
            x * arg[2] + y * arg[3]
        );
    }

    /** @inheritDoc */
    public div<T extends Vector2Like = Vector2>(arg: ReadonlyMatrixLike<2, 2>, result?: T): T {
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
        return Vector2.createResult(result,
            x * c11 + y * c21,
            x * c12 + y * c22
        );
    }

    /** @inheritDoc */
    public transposeDiv<T extends Vector2Like = Vector2>(arg: ReadonlyMatrixLike<2, 2>, result?: T): T {
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
        return Vector2.createResult(result,
            x * c11 + y * c12,
            x * c21 + y * c22
        );
    }

    /** @inheritDoc */
    public compMul<T extends Vector2Like = Vector2>(factor: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof factor === "number") {
            return Vector2.createResult(result,
                this[0] * factor,
                this[1] * factor
            );
        } else {
            return Vector2.createResult(result,
                this[0] * factor[0],
                this[1] * factor[1]
            );
        }
    }

    /** @inheritDoc */
    public compDiv<T extends Vector2Like = Vector2>(divisor: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof divisor === "number") {
            return Vector2.createResult(result,
                this[0] / divisor,
                this[1] / divisor
            );
        } else {
            return Vector2.createResult(result,
                this[0] / divisor[0],
                this[1] / divisor[1]
            );
        }
    }

    /** @inheritDoc */
    public reflect<T extends Vector2Like = Vector2>(normal: ReadonlyVectorLike<2>, result?: T): T {
        const dot2 = (normal[0] * this[0] + normal[1] * this[1]) * 2;
        return Vector2.createResult(result,
            this[0] - normal[0] * dot2,
            this[1] - normal[1] * dot2
        );
    }

    /** @inheritDoc */
    public refract<T extends Vector2Like = Vector2>(normal: ReadonlyVectorLike<2>, eta: number, result?: T): T {
        const x = this[0], y = this[1];
        const nx = normal[0], ny = normal[1];
        const dot = x * nx + y * ny;
        const k = 1.0 - eta * eta * (1.0 - dot * dot);
        if (k < 0.0) {
            return Vector2.createResult(result, 0, 0);
        } else {
            const f = eta * dot + Math.sqrt(k);
            return Vector2.createResult(result,
                x * eta - nx * f,
                y * eta - ny * f
            );
        }
    }

    /** @inheritDoc */
    public normalize<T extends Vector2Like = Vector2>(result?: T): T {
        return this.compDiv(this.getLength(), result);
    }

    /** @inheritDoc */
    public radians<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            radians(this[0]),
            radians(this[1])
        );
    }

    /** @inheritDoc */
    public degrees<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            degrees(this[0]),
            degrees(this[1])
        );
    }

    /** @inheritDoc */
    public sin<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.sin(this[0]),
            Math.sin(this[1])
        );
    }

    /** @inheritDoc */
    public cos<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.cos(this[0]),
            Math.cos(this[1])
        );
    }

    /** @inheritDoc */
    public tan<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.tan(this[0]),
            Math.tan(this[1])
        );
    }

    /** @inheritDoc */
    public asin<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.asin(this[0]),
            Math.asin(this[1])
        );
    }

    /** @inheritDoc */
    public acos<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.acos(this[0]),
            Math.acos(this[1])
        );
    }

    /** @inheritDoc */
    public atan<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.atan(this[0]),
            Math.atan(this[1])
        );
    }

    /** @inheritDoc */
    public atan2<T extends Vector2Like = Vector2>(v: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector2.createResult(result,
                Math.atan2(this[0], v),
                Math.atan2(this[1], v)
            );
        } else {
            return Vector2.createResult(result,
                Math.atan2(this[0], v[0]),
                Math.atan2(this[1], v[1])
            );
        }
    }

    /** @inheritDoc */
    public sinh<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.sinh(this[0]),
            Math.sinh(this[1])
        );
    }

    /** @inheritDoc */
    public cosh<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.cosh(this[0]),
            Math.cosh(this[1])
        );
    }

    /** @inheritDoc */
    public tanh<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.tanh(this[0]),
            Math.tanh(this[1])
        );
    }

    /** @inheritDoc */
    public asinh<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.asinh(this[0]),
            Math.asinh(this[1])
        );
    }

    /** @inheritDoc */
    public acosh<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.acosh(this[0]),
            Math.acosh(this[1])
        );
    }

    /** @inheritDoc */
    public atanh<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.atanh(this[0]),
            Math.atanh(this[1])
        );
    }

    /** @inheritDoc */
    public pow<T extends Vector2Like = Vector2>(v: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector2.createResult(result,
                this[0] ** v,
                this[1] ** v
            );
        } else {
            return Vector2.createResult(result,
                this[0] ** v[0],
                this[1] ** v[1]
            );
        }
    }

    /** @inheritDoc */
    public exp<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.exp(this[0]),
            Math.exp(this[1])
        );
    }

    /** @inheritDoc */
    public log<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.log(this[0]),
            Math.log(this[1])
        );
    }

    /** @inheritDoc */
    public exp2<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            2 ** this[0],
            2 ** this[1]
        );
    }

    /** @inheritDoc */
    public log2<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.log2(this[0]),
            Math.log2(this[1])
        );
    }

    /** @inheritDoc */
    public sqrt<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.sqrt(this[0]),
            Math.sqrt(this[1])
        );
    }

    /** @inheritDoc */
    public inverseSqrt<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            1 / Math.sqrt(this[0]),
            1 / Math.sqrt(this[1])
        );
    }

    /** @inheritDoc */
    public abs<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.abs(this[0]),
            Math.abs(this[1])
        );
    }

    /** @inheritDoc */
    public sign<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.sign(this[0]),
            Math.sign(this[1])
        );
    }

    /** @inheritDoc */
    public floor<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.floor(this[0]),
            Math.floor(this[1])
        );
    }

    /** @inheritDoc */
    public trunc<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.trunc(this[0]),
            Math.trunc(this[1])
        );
    }

    /** @inheritDoc */
    public round<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.round(this[0]),
            Math.round(this[1])
        );
    }

    /** @inheritDoc */
    public roundEven<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            roundEven(this[0]),
            roundEven(this[1])
        );
    }

    /** @inheritDoc */
    public ceil<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            Math.ceil(this[0]),
            Math.ceil(this[1])
        );
    }

    /** @inheritDoc */
    public fract<T extends Vector2Like = Vector2>(result?: T): T {
        return Vector2.createResult(result,
            fract(this[0]),
            fract(this[1])
        );
    }

    /** @inheritDoc */
    public mod<T extends Vector2Like = Vector2>(v: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector2.createResult(result,
                this[0] % v,
                this[1] % v
            );
        } else {
            return Vector2.createResult(result,
                this[0] % v[0],
                this[1] % v[1]
            );
        }
    }

    /** @inheritDoc */
    public modf<T extends Vector2Like = Vector2>(i: VectorLike<2>, result?: T): T {
        i[0] = this[0] | 0;
        i[1] = this[1] | 0;
        return Vector2.createResult(result,
            this[0] % 1,
            this[1] % 1
        );
    }

    /** @inheritDoc */
    public min<T extends Vector2Like = Vector2>(v: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector2.createResult(result,
                Math.min(this[0], v),
                Math.min(this[1], v)
            );
        } else {
            return Vector2.createResult(result,
                Math.min(this[0], v[0]),
                Math.min(this[1], v[1])
            );
        }
    }

    /** @inheritDoc */
    public max<T extends Vector2Like = Vector2>(v: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof v === "number") {
            return Vector2.createResult(result,
                Math.max(this[0], v),
                Math.max(this[1], v)
            );
        } else {
            return Vector2.createResult(result,
                Math.max(this[0], v[0]),
                Math.max(this[1], v[1])
            );
        }
    }

    /** @inheritDoc */
    public clamp<T extends Vector2Like = Vector2>(min: ReadonlyVectorLike<2> | number,
            max: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof min === "number") {
            if (typeof max === "number") {
                return Vector2.createResult(result,
                    clamp(this[0], min, max),
                    clamp(this[1], min, max)
                );
            } else {
                return Vector2.createResult(result,
                    clamp(this[0], min, max[0]),
                    clamp(this[1], min, max[1])
                );
            }
        } else {
            if (typeof max === "number") {
                return Vector2.createResult(result,
                    clamp(this[0], min[0], max),
                    clamp(this[1], min[1], max)
                );
            } else {
                return Vector2.createResult(result,
                    clamp(this[0], min[0], max[0]),
                    clamp(this[1], min[1], max[1])
                );
            }
        }
    }

    /** @inheritDoc */
    public mix<T extends Vector2Like = Vector2>(v: ReadonlyVectorLike<2> | number,
            blend: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof v === "number") {
            if (typeof blend === "number") {
                return Vector2.createResult(result,
                    mix(this[0], v, blend),
                    mix(this[1], v, blend)
                );
            } else {
                return Vector2.createResult(result,
                    mix(this[0], v, blend[0]),
                    mix(this[1], v, blend[1])
                );
            }
        } else {
            if (typeof blend === "number") {
                return Vector2.createResult(result,
                    mix(this[0], v[0], blend),
                    mix(this[1], v[1], blend)
                );
            } else {
                return Vector2.createResult(result,
                    mix(this[0], v[0], blend[0]),
                    mix(this[1], v[1], blend[1])
                );
            }
        }
    }

    /** @inheritDoc */
    public step<T extends Vector2Like = Vector2>(edge: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof edge === "number") {
            return Vector2.createResult(result,
                step(edge, this[0]),
                step(edge, this[1])
            );
        } else {
            return Vector2.createResult(result,
                step(edge[0], this[0]),
                step(edge[1], this[1])
            );
        }
    }

    /** @inheritDoc */
    public smoothStep<T extends Vector2Like = Vector2>(edge1: ReadonlyVectorLike<2> | number,
            edge2: ReadonlyVectorLike<2> | number, result?: T): T {
        if (typeof edge1 === "number") {
            if (typeof edge2 === "number") {
                return Vector2.createResult(result,
                    smoothStep(edge1, edge2, this[0]),
                    smoothStep(edge1, edge2, this[1])
                );
            } else {
                return Vector2.createResult(result,
                    smoothStep(edge1, edge2[0], this[0]),
                    smoothStep(edge1, edge2[1], this[1])
                );
            }
        } else {
            if (typeof edge2 === "number") {
                return Vector2.createResult(result,
                    smoothStep(edge1[0], edge2, this[0]),
                    smoothStep(edge1[1], edge2, this[1])
                );
            } else {
                return Vector2.createResult(result,
                    smoothStep(edge1[0], edge2[0], this[0]),
                    smoothStep(edge1[1], edge2[1], this[1])
                );
            }
        }
    }
}
