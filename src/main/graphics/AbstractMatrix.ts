/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { formatNumber } from "../util/string";
import { Constructor, StrictArrayBufferLike } from "../util/types";
import { ReadonlyMatrixLike } from "./Matrix";

/**
 * Abstract base class for 32-bit floating point matrices.
 */
export abstract class AbstractMatrix<Size extends number = 4 | 6 | 9 | 16> extends Float32Array {
    /** The number of vector components. */
    public readonly length!: Size;

    public readonly columns!: number;

    public readonly rows!: number;

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
     * Creates a new matrix initialized to the given matrix. If given matrix has smaller dimensions then the missing
     * columns/rows are filled from an identity matrix.
     *
     * @param matrix - The matrix to copy the components from.
     * @return The created matrix.
     */
    public static fromMatrix<T extends AbstractMatrix>(this: Constructor<T>, source: ReadonlyMatrixLike): T {
        return new this().copyFromMatrix(source);
    }

    private copyFromMatrix(matrix: ReadonlyMatrixLike): this {
        const otherRows = matrix.rows;
        const thisRows = this.rows;
        const columns = Math.min(this.columns, matrix.columns);
        const rows = Math.min(thisRows, otherRows);
        for (let y = 0; y < rows; ++y) {
            for (let x = 0; x < columns; ++x) {
                this[y + x * thisRows] = matrix[y + x * otherRows];
            }
        }
        return this;
    }

    /**
     * Sets the matrix component values from another matrix. If given matrix has smaller dimensions then the missing
     * columns/rows are filled from an identity matrix.
     *
     * @param matrix - The matrix to copy the component values from.
     */
    public setMatrix(matrix: ReadonlyMatrixLike): this {
        return this.reset().copyFromMatrix(matrix);
    }

    /**
     * Returns a human-readable string representation of the matrix.
     *
     * @param maximumFractionDigits - Optional number of maximum fraction digits to use in the string. Defaults to 5.
     * @return The human-readable string representation of the matrix.
     */
    public toString(maximumFractionDigits = 5): string {
        return `[ ${Array.from(this).map(v => formatNumber(v, { maximumFractionDigits })).join(", ")} ]`;
    }

    /**
     * Resets this matrix to identity.
     */
    public abstract reset(): this;
}
