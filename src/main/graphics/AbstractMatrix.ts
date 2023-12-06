/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { formatNumber } from "../util/string";
import { Constructor, StrictArrayBufferLike } from "../util/types";
import { MatrixSize, ReadonlyMatrixLike } from "./Matrix";

/**
 * Abstract base class for 32-bit floating point matrices.
 */
export abstract class AbstractMatrix<Columns extends 2 | 3 | 4, Rows extends 2 | 3 | 4>
        extends Float32Array {
    public abstract override readonly length: MatrixSize<Columns, Rows>;

    /** The number of columns. */
    public readonly columns: Columns;

    /** The number of rows. */
    public readonly rows: Rows;

    /**
     * Constructs a matrix with the given number of columns and rows optionally backed by the given buffer.
     *
     * @param columns - The number of columns.
     * @param rows    - The number of rows.
     * @param buffer  - Optional buffer to back the matrix.
     * @param
     */
    public constructor(columns: Columns, rows: Rows, buffer?: StrictArrayBufferLike, offset?: number) {
        if (buffer == null) {
            super(columns * rows);
        } else {
            super(buffer, offset, columns * rows);
        }
        this.columns = columns;
        this.rows = rows;
    }

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
    public static fromMatrix<Columns extends 2 | 3 | 4, Rows extends 2 | 3 | 4,
            T extends AbstractMatrix<Columns, Rows>>(
                this: Constructor<T>, source: ReadonlyMatrixLike<2 | 3 | 4, 2 | 3 | 4>): T {
        return new this().copyFromMatrix(source);
    }

    private copyFromMatrix(matrix: ReadonlyMatrixLike<2 | 3 | 4, 2 | 3 | 4>): this {
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
    public setMatrix(matrix: ReadonlyMatrixLike<2 | 3 | 4, 2 | 3 | 4>): this {
        return this.reset().copyFromMatrix(matrix);
    }

    /**
     * Returns a human-readable string representation of the matrix.
     *
     * @param maximumFractionDigits - Optional number of maximum fraction digits to use in the string. Defaults to 5.
     * @return The human-readable string representation of the matrix.
     */
    public override toString(maximumFractionDigits = 5): string {
        return `[ ${Array.from(this).map(v => formatNumber(v, { maximumFractionDigits })).join(", ")} ]`;
    }

    /**
     * Resets this matrix to identity.
     */
    public abstract reset(): this;
}
