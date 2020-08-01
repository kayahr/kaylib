/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Equatable, isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { cacheResult } from "../util/cache";
import { IllegalArgumentException } from "../util/exception";
import { formatNumber } from "../util/string";
import { Direction } from "./Direction";
import { Point } from "./Point";
import { PointLike } from "./PointLike";
import { RectLike } from "./RectLike";
import { Size, SizeJSON } from "./Size";
import { SizeLike } from "./SizeLike";

/**
 * Serialized JSON structure of a rectangle.
 */
export interface RectJSON extends SizeJSON {
    /** Left edge of the rectangle. */
    left: number;

    /** Top edge of the rectangle. */
    top: number;
}

/**
 * Normalizes rectangle coordinates with anchor and possibly negative size into left/top with positive size.
 *
 * @param x      - The X position at anchor.
 * @param y      - The Y position at anchor.
 * @param width  - The width of the rectangle. May be negative.
 * @param height - The height of the rectangle. May be negative.
 * @param anchor - The anchor point.
 * @return Array with normalized left, top, width and height values.
 */
function normalizeRect<T>(x: number, y: number, width: number, height: number, anchor: Direction):
        [ number, number, number, number ] {
    let left: number;
    let top: number;

    // Set left position depending on anchor
    if (Direction.isWest(anchor)) {
        left = x + Math.min(0, width);
    } else if (Direction.isEast(anchor)) {
        left = x - Math.max(0, width);
    } else {
        left = x - Math.abs(width) / 2;
    }

    // Set top position depending on anchor
    if (Direction.isNorth(anchor)) {
        top = y + Math.min(0, height);
    } else if (Direction.isSouth(anchor)) {
        top = y - Math.max(0, height);
    } else {
        top = y - Math.abs(height) / 2;
    }

    return [ left, top, Math.abs(width), Math.abs(height) ];
}

/**
 * Immutable rectangle with a position and size.
 */
export class Rect implements RectLike, SizeLike, Serializable<RectJSON>, Equatable, PointLike {
    /** The left edge. */
    private readonly left: number;

    /** The top edge. */
    private readonly top: number;

    /** The rectangle width. */
    private readonly width: number;

    /** The rectangle height. */
    private readonly height: number;

    /**
     * Creates a new rectangle.
     *
     * @param x      - The X position of the rectangle. Meaning depends on anchor.
     * @param y      - The Y position of the rectangle. Meaning depends on anchor.
     * @param width  - The rectangle width.
     * @param height - The rectangle height.
     */
    public constructor(x: number, y: number, width: number, height: number, anchor = Direction.NORTH_WEST) {
        [ this.left, this.top, this.width, this.height ] = normalizeRect(x, y, width, height, anchor);
    }

    /**
     * Creates a new rectangle from given rectangle like.
     *
     * @param rect - The rectangle to copy the position and size from.
     * @return The new rectangle.
     */
    public static fromRect(rect: RectLike): Rect {
        return new Rect(rect.getLeft(), rect.getTop(), rect.getWidth(), rect.getHeight());
    }

    /**
     * Creates a new rectangle from two given corner points. Order of points doesn't matter.
     *
     * @param a - The first point.
     * @param b - The second point.
     * @return The created rectangle.
     */
    public static fromPoints(a: PointLike, b: PointLike): Rect {
        return new Rect(a.getX(), a.getY(), b.getX() - a.getX(), b.getY() - a.getY());
    }

    /**
     * Creates a new rectangle from a size and an optional position with optional anchor.
     *
     * @param size     - The size of the rectangle.
     * @param position - Optional position of the rectangle. Defaults to 0,0.
     * @param anchor   - Optional anchor of the position of the rectangle. Defaults to north-west.
     * @return The created rectangle.
     */
    public static fromSize(size: SizeLike, position: PointLike = Point.NULL, anchor = Direction.NORTH_WEST): Rect {
        return new Rect(position.getX(), position.getY(), size.getWidth(), size.getHeight(), anchor);
    }

    /**
     * Creates a rectangle from a string. Width, height, left and top can be separated by any character/string which
     * is not a number. Left and top can also be appended without any separator as long as the values are signed with
     * `-` or `+`.
     *
     * @param s - The rectangle as a string.
     * @return The parsed rectangle.
     */
    public static fromString(s: string): Rect {
        const values = s.trim().split(/(?:[^-+0-9.]|(?=[+-]))+/s, 4).map(value => +value);
        if (values.length !== 4 || values.some(value => isNaN(value))) {
            throw new IllegalArgumentException("Invalid rectangle string: " + s);
        }
        return new Rect(values[2], values[3], values[0], values[1]);
    }

    public static fromJSON(json: RectJSON): Rect {
        return new Rect(json.left, json.top, json.width, json.height);
    }

    /** @inheritDoc */
    public toJSON(): RectJSON {
        return {
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Returns the rectangle as a string in format `${width}x${height}[+-]${left}[+-]${top}`.
     *
     * @param maximumFractionDigits - The maximum number of fraction digits. Defaults to 6.
     * @return The rectangle as a string.
     */
    public toString(maximumFractionDigits: number = 6): string {
        const width = formatNumber(this.width, { maximumFractionDigits });
        const height = formatNumber(this.height, { maximumFractionDigits });
        const left = formatNumber(this.left, { maximumFractionDigits });
        const top = formatNumber(this.top, { maximumFractionDigits });
        return `${width}x${height}${this.left >= 0 ? "+" : ""}${left}${this.top >= 0 ? "+" : ""}${top}`;
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.left === other.left && this.top === other.top
            && this.width === other.width && this.height === other.height
        );
    }

    /** @inheritDoc */
    public getLeft(): number {
        return this.left;
    }

    /** @inheritDoc */
    public getTop(): number {
        return this.top;
    }

    /**
     * Returns The X position of the rectangle. By default this returns the left edge but you can define a different
     * anchor point to return a different X position.
     *
     * @param anchor - The anchor point. Defaults to north-west.
     * @return The X position relative to given anchor.
     */
    public getX(anchor: Direction = Direction.NORTH_WEST): number {
        if (Direction.isWest(anchor)) {
            return this.getLeft();
        } else if (Direction.isEast(anchor)) {
            return this.getRight();
        } else {
            return this.getCenterX();
        }
    }

    /**
     * Returns the Y position of the rectangle. By default this returns the top edge but you can define a different
     * anchor point to return a different Y position.
     *
     * @param anchor - The anchor point. Defaults to north-west.
     * @return The Y position relative to given anchor.
     */
    public getY(anchor: Direction = Direction.NORTH_WEST): number {
        if (Direction.isNorth(anchor)) {
            return this.getTop();
        } else if (Direction.isSouth(anchor)) {
            return this.getBottom();
        } else {
            return this.getCenterY();
        }
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
     * Returns the bottom edge of the rectangle.
     *
     * @return The bottom edge.
     */
    public getBottom(): number {
        return this.top + this.height;
    }

    /**
     * Returns the right edge of the rectangle.
     *
     * @return The right edge.
     */
    public getRight(): number {
        return this.left + this.width;
    }

    /**
     * Returns the top-left position of the rectangle.
     *
     * @return The top-left position.
     */
    @cacheResult
    public getTopLeft(): Point {
        return new Point(this.left, this.top);
    }

    /**
     * Returns the top-right position of the rectangle.
     *
     * @return The top-right position.
     */
    @cacheResult
    public getTopRight(): Point {
        return new Point(this.getRight(), this.top);
    }

    /**
     * Returns the bottom-right position of the rectangle.
     *
     * @return The bottom-right position.
     */
    @cacheResult
    public getBottomRight(): Point {
        return new Point(this.getRight(), this.getBottom());
    }

    /**
     * Returns the bottom-left position of the rectangle.
     *
     * @return The bottom-left position.
     */
    @cacheResult
    public getBottomLeft(): Point {
        return new Point(this.left, this.getBottom());
    }

    /**
     * Returns the center position of the rectangle.
     *
     * @return The center position.
     */
    @cacheResult
    public getCenter(): Point {
        return new Point(this.getCenterX(), this.getCenterY());
    }

    /**
     * Returns the horizontal center position of the rectangle.
     *
     * @return The horizontal center position.
     */
    public getCenterX(): number {
        return this.left + this.width / 2;
    }

    /**
     * Returns the vertical center position of the rectangle.
     *
     * @return The vertical center position.
     */
    public getCenterY(): number {
        return this.top + this.height / 2;
    }

    /**
     * Returns the rectangle size.
     *
     * @return The rectangle size.
     */
    @cacheResult
    public getSize(): Size {
        return new Size(this.width, this.height);
    }

    /**
     * Checks if rectangle is empty. A rectangle is empty when width or height is smaller or equal 0.
     *
     * @return True if rectangle is empty, false if not.
     */
    public isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    /**
     * Checks if rectangle is null. A rectangle is null when top, left, width and height is exactly 0.
     *
     * @return True if rectangle is null, false if not.
     */
    public isNull(): boolean {
        return this.left === 0 && this.top === 0 && this.width === 0 && this.height === 0;
    }

    /**
     * Checks if given rectangle is within this rectangle. By skipping the width/height arguments this can also check
     * if point is within this rectangle.
     *
     * @param x      - The X position at anchor.
     * @param y      - The Y position at anchor.
     * @param width  - Optional width of the rectangle. May be negative. Defaults to 0.
     * @param height - Optional height of the rectangle. May be negative. Defaults to 0.
     * @param anchor - Optional anchor point.
     * @return True if point or rectangle is within this rectangle. False if not.
     */
    public contains(x: number, y: number, width = 0, height = 0, anchor = Direction.NORTH_WEST): boolean {
        let left: number, top: number;
        [ left, top, width, height ] = normalizeRect(x, y, width, height, anchor);
        return left >= this.left && left + width <= this.getRight()
            && top >= this.top && top + height <= this.getBottom();
    }

    public containsPoint(point: PointLike): boolean {
        return this.contains(point.getX(), point.getY());
    }

    public containsRect(rect: RectLike): boolean {
        return this.contains(rect.getLeft(), rect.getTop(), rect.getWidth(), rect.getHeight());
    }

    /**
     * Transposes the rectangle by swapping left/top and width/height.
     *
     * @return The transposed rectangle.
     */
    public transpose(): Rect {
        return new Rect(this.top, this.left, this.height, this.width);
    }

/*
    public moveBy(left: number, top: number): Rect {
        return new Rect(this.left + left, this.top + top, this.width, this.height);
    }

    public moveByPoint(point: PointLike): Rect {
        return this.moveBy(point.getX(), point.getY());
    }
*/
    /*
    moveTo(x, y, anchor);
    moveToPoint(point, anchor);

    resizeTo(width, height, anchor)
    resizeBy(width, height, anchor)

    setSize(size, anchor);
    addSize(size, anchor);
    subSize(size, anchor);

    addInsets(size);
    subInsets(size);
    */
}
