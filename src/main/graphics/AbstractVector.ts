/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { StrictArrayBufferLike } from "../util/types";
import { ReadonlyVectorLike } from "./Vector";

/**
 * Abstract base class for 32-bit floating point vectors.
 */
export abstract class AbstractVector<Size extends number = number> extends Float32Array {
    /**
     * Helper method to check if constructor arguments are for initializing a matrix from a components array.
     *
     * @param args - The arguments to check.
     * @return True if arguments are for initializing a matrix from a components array.
     */
    protected static isInitFromComponents(args: number[] | [ StrictArrayBufferLike, number? ]): args is number[] {
        return typeof args[0] === "number";
    }

    /**
     * Helper method to set vector components from any set of numbers and vector like structures.
     *
     * @param args - Array which can contain numbers and vector like structures to use as vector components.
     */
    protected fillComponents(args: Array<number | ReadonlyVectorLike>): this {
        let i = 0;
        for (const arg of args) {
            if (typeof arg === "number") {
                this[i++] = arg;
            } else {
                for (let j = 0, max = Math.min(this.length - i, arg.length); j < max; ++j) {
                    this[i++] = arg[j];
                }
            }
        }
        return this;
    }

    /**
     * Returns a human-readable string representation of the vector.
     *
     * @param maxFractionDigits - Optional number of maximum fraction digits to use in the string. Defaults to 5.
     * @return The human-readable string representation of the vector.
     */
    public toString(maxFractionDigits = 5): string {
        return `[ ${Array.from(this).map(v => +v.toFixed(maxFractionDigits)).join(", ")} ]`;
    }

    /**
     * Returns the squared length of the vector. In some cases (Like comparing vector lengths) it is not necessary to
     * compare the real length, it is enough to compare the squared length. This is faster because it only does
     * addition and multiplication without a square root. If you need the real vector length then use the
     * [[getLength]] method instead.
     *
     * @return The squared vector length.
     */
    public abstract getSquareLength(): number;

    /**
     * Returns the length of the vector. If you only need to compare vector lengths so the real length doesn't matter
     * then consider using the faster [[getSquareLength]] method which omits the expensive square root calculation.
     *
     * @return The vector length.
     */
    public getLength(): number {
        return Math.sqrt(this.getSquareLength());
    }

    /**
     * Returns the squared distance between this vector and the specified one. In some cases (Like comparing
     * vector distances) it is not necessary to compare the real distance, it is enough to compare the squared
     * distance. This is faster because it only does addition and multiplication without a square root. If you need
     * the real vector distance then use the [[getDistance]] method instead.
     *
     * @param v - The other vector.
     * @return The squared distance between the two vectors.
     */
    public abstract getSquareDistance(v: ReadonlyVectorLike<Size>): number;

    /**
     * Returns the distance between this vector and the specified one. If you only need to compare vector distances so
     * the real distance doesn't matter then consider using the faster [[getSquareDistance]] method which omits the
     * expensive square root calculation.
     *
     * @param v - The other vector.
     * @return The distance between this vector and the specified one.
     */
    public getDistance(v: ReadonlyVectorLike<Size>): number {
        return Math.sqrt(this.getSquareDistance(v));
    }
}
