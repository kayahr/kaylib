/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Equatable, isEqual } from "./Equatable";
import { IllegalArgumentException } from "./exception";
import { InsetsLike } from "./InsetsLike";
import { Serializable } from "./Serializable";
import { formatNumber } from "./string";

/** JSON representation of insets. */
export interface InsetsJSON {
    /** The inset from the top. */
    top: number;

    /** The inset from the right. */
    right: number;

    /** The inset from the bottom. */
    bottom: number;

    /** The inset from the left. */
    left: number;
}

/**
 * This type can be used for paddings, margins, borders, nine-patch split coordinates and so on. The parameter order
 * of the constructor and various methods use CSS order (clock-wise starting at top: top, right, bottom, left).
 */
export class Insets implements InsetsLike, Serializable<InsetsJSON>, Equatable {
    /**
     * Creates new insets.
     *
     * @param top    - The inset from the top.
     * @param right  - The inset from the right. Defaults to top inset.
     * @param bottom - The inset from the bottom. Defaults to top inset.
     * @param left   - The inset from the left. Defaults to right inset.
     */
    public constructor(
        private readonly top: number,
        private readonly right: number = top,
        private readonly bottom: number = top,
        private readonly left: number = right
    ) {}

    /**
     * Creates new insets from the given insets-like object.
     *
     * @param insets - The object to copy the insets from.
     * @return The created insets object.
     */
    public static fromInsets(insets: InsetsLike): Insets {
        return new Insets(insets.getTop(), insets.getRight(), insets.getBottom(), insets.getLeft());
    }

    public static fromJSON(json: InsetsJSON): Insets {
        return new Insets(json.top, json.right, json.bottom, json.left);
    }

    /**
     * Parses insets from a string. The 1-4 components can be separated by any character/string which is not a number.
     *
     * @param s - The insets string to parse.
     * @return The parsed insets.
     */
    public static fromString(s: string): Insets {
        const values = s.trim().split(/[^-+0-9.]+/s, 4).filter(value => value !== "").map(value => +value);
        if (values.length < 1 || values.some(value => isNaN(value))) {
            throw new IllegalArgumentException("Invalid insets string: " + s);
        }
        return new Insets(values[0], values[1], values[2], values[3]);
    }

    /** @inheritDoc */
    public toJSON(): InsetsJSON {
        return {
            top: this.top,
            right: this.right,
            bottom: this.bottom,
            left: this.left
        };
    }

    /**
     * Returns string representation of the insets. An optional unit can be specified to generate a CSS compatible
     * string with the unit `px` for example.
     *
     * @param unit                  - Optional unit to append to each inset. Defaults to empty string.
     * @param maximumFractionDigits - The maximum number of fraction digits. Defaults to 6.
     * @return The string representation.
     */
    public toString(unit: string = "", maximumFractionDigits: number = 6): string {
        const top = formatNumber(this.top, { maximumFractionDigits });
        const right = formatNumber(this.right, { maximumFractionDigits });
        const bottom = formatNumber(this.bottom, { maximumFractionDigits });
        const left = formatNumber(this.left, { maximumFractionDigits });
        if (top === bottom) {
            if (left === right) {
                if (left === top) {
                    return `${top}${unit}`;
                } else {
                    return `${top}${unit} ${right}${unit}`;
                }
            }
        }
        return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.top === other.top && this.right === other.right
            && this.bottom === other.bottom && this.left === other.left
        );
    }

    /** @inheritDoc */
    public getTop(): number {
        return this.top;
    }

    /** @inheritDoc */
    public getRight(): number {
        return this.right;
    }

    /** @inheritDoc */
    public getBottom(): number {
        return this.bottom;
    }

    /** @inheritDoc */
    public getLeft(): number {
        return this.left;
    }

    /**
     * Returns the sum of the top and bottom insets.
     *
     * @param the vertical insets.
     */
    public getVertical(): number {
        return this.top + this.bottom;
    }

    /**
     * Returns the sum of the left and right insets.
     *
     * @param the horizontal insets.
     */
    public getHorizontal(): number {
        return this.left + this.right;
    }

    /**
     * Checks if insets are empty (All insets are 0).
     *
     * @return True if insets are empty, false if not.
     */
    public isNull(): boolean {
        return this.top === 0 && this.right === 0 && this.bottom === 0 && this.left === 0;
    }

    /**
     * Adds the given insets to this ones and returns the result.
     *
     * @param top    - The inset from the top.
     * @param right  - The inset from the right. Defaults to top inset.
     * @param bottom - The inset from the bottom. Defaults to top inset.
     * @param left   - The inset from the left. Defaults to right inset.
     * @return The new insets.
     */
    public add(top: number, right: number = top, bottom: number = top, left: number = right): Insets {
        return new Insets(
            this.top + top,
            this.right + right,
            this.bottom + bottom,
            this.left + left
        );
    }

    /**
     * Adds the given insets from this ones and returns the result.
     *
     * @param insets - The insets to add.
     * @return The new insets.
     */
    public addInsets(insets: InsetsLike): Insets {
        return this.add(insets.getTop(), insets.getRight(), insets.getBottom(), insets.getLeft());
    }

    /**
     * Subtracts the given insets from this ones and returns the result.
     *
     * @param top    - The inset from the top.
     * @param right  - The inset from the right. Defaults to top inset.
     * @param bottom - The inset from the bottom. Defaults to top inset.
     * @param left   - The inset from the left. Defaults to right inset.
     * @return The new insets.
     */
    public sub(top: number, right: number = top, bottom: number = top, left: number = right): Insets {
        return new Insets(
            this.top - top,
            this.right - right,
            this.bottom - bottom,
            this.left - left
        );
    }

    /**
     * Subtracts the given insets from this ones and returns the result.
     *
     * @param insets - The insets to subtract.
     * @return The new insets.
     */
    public subInsets(insets: InsetsLike): Insets {
        return this.sub(insets.getTop(), insets.getRight(), insets.getBottom(), insets.getLeft());
    }

    /**
     * Multiplies the insets with the given factors and returns the new insets.
     *
     * @param top    - The top inset factor.
     * @param right  - The right inset factor. Defaults to top factor.
     * @param bottom - The bottom inset factor. Defaults to top factor.
     * @param left   - The left inset factor. Defaults to right factor.
     * @return The new insets.
     */
    public mul(top: number, right = top, bottom = top, left = right): Insets {
        return new Insets(
            this.top * top,
            this.right * right,
            this.bottom * bottom,
            this.left * left
        );
    }

    /**
     * Divides the insets by the given factors and returns the new insets.
     *
     * @param top    - The top inset factor.
     * @param right  - The right inset factor. Defaults to top factor.
     * @param bottom - The bottom inset factor. Defaults to top factor.
     * @param left   - The left inset factor. Defaults to right factor.
     * @return The new insets.
     */
    public div(top: number, right = top, bottom = top, left = right): Insets {
        return new Insets(
            this.top / top,
            this.right / right,
            this.bottom / bottom,
            this.left / left
        );
    }
}
