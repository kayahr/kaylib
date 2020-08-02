/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Comparable } from "../lang/Comparable";
import { Equatable, isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { IllegalArgumentException } from "../util/exception";
import { formatNumber } from "../util/string";
import { InsetsLike } from "./InsetsLike";
import { SizeLike } from "./SizeLike";

/** JSON representation of a size. */
export interface SizeJSON {
    width: number;
    height: number;
}

/**
 * Immutable container for a size with a width and height component.
 */
export class Size implements SizeLike, Serializable<SizeJSON>, Equatable, Comparable<Size> {
    /**
     * Creates new insets.
     *
     * @param width - The width.
     * @param height - The height.
     */
    public constructor(
        private readonly width: number,
        private readonly height: number
    ) {}

    /**
     * Creates a new size from the given size-like object.
     *
     * @param size - The object to copy the size from.
     * @return The created size object.
     */
    public static fromSize(size: SizeLike): Size {
        return new Size(size.getWidth(), size.getHeight());
    }

    public static fromJSON(json: SizeJSON): Size {
        return new Size(json.width, json.height);
    }

    /**
     * Creates a size from a string. Width and height can be separated by any character/string which is not a number.
     *
     * @param s - The size as a string.
     * @return The parsed size.
     */
    public static fromString(s: string): Size {
        const values = s.trim().split(/[^-+0-9.]+/s, 2).map(value => +value);
        if (values.length !== 2 || values.some(value => isNaN(value))) {
            throw new IllegalArgumentException("Invalid size string: " + s);
        }
        return new Size(values[0], values[1]);
    }

    /** @inheritDoc */
    public toJSON(): SizeJSON {
        return {
            width: this.width,
            height: this.height
        };
    }

    /**
     * Returns the size as a string in format `${width}x${height}`.
     *
     * @param maximumFractionDigits - The maximum number of fraction digits. Defaults to 6.
     * @return The size as a string.
     */
    public toString(maximumFractionDigits: number = 6): string {
        const width = formatNumber(this.width, { maximumFractionDigits });
        const height = formatNumber(this.height, { maximumFractionDigits });
        return `${width}x${height}`;
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.width === other.width && this.height === other.height);
    }

    /** @inheritDoc */
    public compareTo(other: Size): number {
        return this.getArea() - other.getArea();
    }

    /** @inheritDoc */
    public getWidth(): number {
        return this.width;
    }

    /** @inheritDoc */
    public getHeight(): number {
        return this.height;
    }

    /**
     * Returns true if size is empty. A size is empty when width or height is smaller or equal 0.
     *
     * @return True if size is empty, false if not.
     */
    public isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    /**
     * Returns true if size is null (width and height is 0).
     *
     * @return True if size is null, false if not.
     */
    public isNull(): boolean {
        return this.width === 0 && this.height === 0;
    }

    /**
     * Checks if size is valid. A valid size has no negative width or height.
     *
     * @return True if size is valid, false if not.
     */
    public isValid(): boolean {
        return this.width >= 0 && this.height >= 0;
    }

    /**
     * Transposes the size by swapping width and height.
     *
     * @return The transposed size.
     */
    public transpose(): Size {
        if (this.width === this.height) {
            return this;
        }
        return new Size(this.height, this.width);
    }

    /**
     * Adds the given width and height to this size and returns the new size.
     *
     * @param width - The width to add.
     * @param height - The height to add.
     * @return The new size.
     */
    public add(width: number, height: number): Size {
        if (width === 0 && height === 0) {
            return this;
        }
        return new Size(this.width + width, this.height + height);
    }

    /**
     * Adds the given size to this size and returns the new size.
     *
     * @param size - The size to add.
     * @return The new size.
     */
    public addSize(size: SizeLike): Size {
        return this.add(size.getWidth(), size.getHeight());
    }

    /**
     * Adds the given insets to this size and returns the new size.
     *
     * @param insets - The insets to add.
     * @return The new size.
     */
    public addInsets(insets: InsetsLike): Size {
        return this.add(insets.getLeft() + insets.getRight(), insets.getTop() + insets.getBottom());
    }

    /**
     * Subtracts the given width and height from this size and returns the new size.
     *
     * @param width - The width to subtract.
     * @param height - The height to subtract.
     * @return The new size.
     */
    public sub(width: number, height: number): Size {
        if (width === 0 && height === 0) {
            return this;
        }
        return new Size(this.width - width, this.height - height);
    }

    /**
     * Subtracts the given size from this size and returns the new size.
     *
     * @param size - The size to subtract.
     * @return The new size.
     */
    public subSize(size: SizeLike): Size {
        return this.sub(size.getWidth(), size.getHeight());
    }

    /**
     * Subtract the given insets from this size and returns the new size.
     *
     * @param insets - The insets to subtract.
     * @return The new size.
     */
    public subInsets(insets: InsetsLike): Size {
        return this.sub(insets.getLeft() + insets.getRight(), insets.getTop() + insets.getBottom());
    }

    /**
     * Multiplies the size with the given factors and returns the new size.
     *
     * @param widthFactor - The width factor to multiply with.
     * @param heightFactor - The height factor to multiply with. Defaults to width factor.
     * @return The new size.
     */
    public mul(widthFactor: number, heightFactor: number = widthFactor): Size {
        if (widthFactor === 1 && heightFactor === 1) {
            return this;
        }
        return new Size(this.width * widthFactor, this.height * heightFactor);
    }

    /**
     * Divides the size by the given divisors and returns the new size.
     *
     * @param widthDivisor  - The width divisor to divide by.
     * @param heightDivisor - The height divisor to divide by. Defaults to width divisor.
     * @return The new size.
     */
    public div(widthDivisor: number, heightDivisor = widthDivisor): Size {
        if (widthDivisor === 1 && heightDivisor === 1) {
            return this;
        }
        return new Size(this.width / widthDivisor, this.height / heightDivisor);
    }

    /**
     * Returns the aspect ratio (width / height) of this size.
     *
     * @return The aspect ratio.
     */
    public getAspectRatio(): number {
        return this.width / this.height;
    }

    /**
     * Returns the area (width * height) of this size.
     *
     * @return The area.
     */
    public getArea(): number {
        return this.width * this.height;
    }
}
