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
import { InsetsLike } from "./InsetsLike";
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
function normalizeRect(x: number, y: number, width: number, height: number, anchor: Direction):
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
    /** Rectangle constant for position x=0,y=0 with empty size. */
    public static readonly NULL = new Rect(0, 0, 0, 0);

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
     * Creates a new rectangle from the given edges.
     *
     * @param left - The left edge.
     * @param top  - The top edge.
     * @param right - The right edge.
     * @param bottom - The bottom edge.
     * @return The created rectangle.
     */
    public static fromEdges(left: number, top: number, right: number, bottom: number): Rect {
        return new Rect(left, top, right - left, bottom - top);
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
        const values = s.trim().split(/(?:[^-+0-9.]|(?=[+-]))+/, 4).map(value => +value);
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

    /**
     * Returns the location of the given anchor on the rectangle.
     *
     * @return anchor - Optional anchor. Defaults to north-west.
     * @return The location relative to given anchor.
     */
    public getLocation(anchor: Direction = Direction.NORTH_WEST): Point {
        return new Point(this.getX(anchor), this.getY(anchor));
    }

    /**
     * Moves this rectangle to the given location and returns the new rectangle.
     *
     * @param location - The location to set. Relative to given anchor.
     * @param anchor   - Optional anchor. Defaults to north-west.
     * @return The new rectangle.
     */
    public setLocation(location: PointLike, anchor = Direction.NORTH_WEST): Rect {
        if (location.getX() === this.getX(anchor) && location.getY() === this.getY(anchor)) {
            return this;
        }
        return new Rect(location.getX(), location.getY(), this.width, this.height, anchor);
    }

    /**
     * Moves the rectangle by the given delta.
     *
     * @param x - The horizontal position delta.
     * @param y - The vertical position delta.
     * @return The new rectangle.
     */
    public move(x: number, y: number): Rect {
        if (x === 0 && y === 0) {
            return this;
        }
        return new Rect(this.left + x, this.top + y, this.width, this.height);
    }

    /**
     * Moves the rectangle to the given position.
     *
     * @param x      - The new horizontal position.
     * @param y      - The new vertical position.
     * @param anchor - Optional anchor. Defaults to north-west.
     * @return The new rectangle.
     */
    public moveTo(x: number, y: number, anchor = Direction.NORTH_WEST): Rect {
        const [ left, top ] = normalizeRect(x, y, this.width, this.height, anchor);
        if (left === this.left && top === this.top) {
            return this;
        }
        return new Rect(left, top, this.width, this.height);
    }

    /**
     * Moves the rectangle to the given position.
     *
     * @param point  - The new position.
     * @param anchor - Optional anchor. Defaults to north-west.
     * @return The new rectangle.
     */
    public moveToPoint(point: PointLike, anchor = Direction.NORTH_WEST): Rect {
        return this.moveTo(point.getX(), point.getY(), anchor);
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
     * Resizes the rectangle by the given additional size and returns the new rectangle.
     *
     * @param addWidth  - The horizontal size to add.
     * @param addHeight - The vertical size to add.
     * @param anchor    - Optional resize anchor. Defaults to north-west.
     * @return The new rectangle.
     */
    public resize(addWidth: number, addHeight: number, anchor = Direction.NORTH_WEST): Rect {
        if (addWidth === 0 && addHeight === 0) {
            return this;
        }
        return new Rect(this.getX(anchor), this.getY(anchor), this.width + addWidth, this.height + addHeight, anchor);
    }

    /**
     * Resizes the rectangle by the given size and returns the new rectangle.
     *
     * @param size   - The size to add.
     * @param anchor - Optional resize anchor. Defaults to north-west.
     * @return The new rectangle.
     */
    public addSize(size: SizeLike, anchor = Direction.NORTH_WEST): Rect {
        return this.resize(size.getWidth(), size.getHeight(), anchor);
    }

    /**
     * Subtracts the given size from this rectangle and returns the new rectangle.
     *
     * @param size   - The size to subtract.
     * @param anchor - Optional resize anchor. Defaults to north-west.
     * @return The new rectangle.
     */
    public subSize(size: SizeLike, anchor = Direction.NORTH_WEST): Rect {
        return this.resize(-size.getWidth(), -size.getHeight(), anchor);
    }

    /**
     * Resizes the rectangle to the given size and returns the new rectangle.
     *
     * @param newWidth  - The new rectangle width.
     * @param newHeight - The new rectangle height.
     * @param anchor    - Optional resize anchor. Defaults to north-west.
     * @return The new rectangle.
     */
    public resizeTo(newWidth: number, newHeight: number, anchor = Direction.NORTH_WEST): Rect {
        if (newWidth === this.width && newHeight === this.height) {
            return this;
        }
        return new Rect(this.getX(anchor), this.getY(anchor), newWidth, newHeight, anchor);
    }

    /**
     * Resizes the rectangle to the given size and returns the new rectangle.
     *
     * @param size - The new size.
     * @param anchor    - Optional resize anchor. Defaults to north-west.
     * @return The new rectangle.
     */
    public setSize(size: SizeLike, anchor = Direction.NORTH_WEST): Rect {
        return this.resizeTo(size.getWidth(), size.getHeight(), anchor);
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

    /**
     * Checks if given point is within this rectangle.
     *
     * @param point - The point to check.
     * @return True if point is within this rectangle. False if not.
     */
    public containsPoint(point: PointLike): boolean {
        return this.contains(point.getX(), point.getY());
    }

    /**
     * Checks if given rectangle is within this rectangle.
     *
     * @param rect - The rectangle to check.
     * @return True if rectangle is within this rectangle. False if not.
     */
    public containsRect(rect: RectLike): boolean {
        return this.contains(rect.getLeft(), rect.getTop(), rect.getWidth(), rect.getHeight());
    }

    /**
     * Transposes the rectangle by swapping left/top and width/height.
     *
     * @return The transposed rectangle.
     */
    public transpose(): Rect {
        if (this.top === this.left && this.width === this.height) {
            return this;
        }
        return new Rect(this.top, this.left, this.height, this.width);
    }

    /**
     * Returns the intersection rectangle with the given rectangle data. When rectangles do not intersect then an
     * empty rectangle is returned.
     *
     * @param x      - The X position of the other rectangle at anchor.
     * @param y      - The Y position of the other rectangle at anchor.
     * @param width  - The width of the other rectangle. May be negative.
     * @param height - The height of the other rectangle. May be negative.
     * @param anchor - The optional anchor point. Defaults to north-west.
     * @return The new rectangle describing the intersection. Empty rectangle when not intersecting.
     */
    public getIntersection(x: number, y: number, width: number, height: number, anchor = Direction.NORTH_WEST): Rect {
        let left: number, top: number;
        [ left, top, width, height ] = normalizeRect(x, y, width, height, anchor);
        const right = left + width;
        const maxLeft = Math.max(left, this.left);
        const minRight = Math.min(right, this.getRight());
        if (maxLeft < minRight) {
            const bottom = top + height;
            const maxTop = Math.max(top, this.top);
            const minBottom = Math.min(bottom, this.getBottom());
            if (maxTop < minBottom) {
                return new Rect(maxLeft, maxTop, minRight - maxLeft, minBottom - maxTop);
            }
        }
        return Rect.NULL;
    }

    /**
     * Returns the intersection rectangle with the given rectangle. When rectangles do not intersect then an
     * empty rectangle is returned.
     *
     * @param rect - The other rectangle for intersection calculation.
     * @return The new rectangle describing the intersection. Empty rectangle when not intersecting.
     */
    public getRectIntersection(rect: RectLike): Rect {
        return this.getIntersection(rect.getLeft(), rect.getTop(), rect.getWidth(), rect.getHeight());
    }

    /**
     * Checks if this rectangle intersects with the given one.
     *
     * @param x      - The X position of the other rectangle at anchor.
     * @param y      - The Y position of the other rectangle at anchor.
     * @param width  - The width of the other rectangle. May be negative.
     * @param height - The height of the other rectangle. May be negative.
     * @param anchor - The optional anchor point. Defaults to north-west.
     * @return True if rectangles intersect, false if not.
     */
    public intersects(x: number, y: number, width: number, height: number, anchor = Direction.NORTH_WEST): boolean {
        let left: number, top: number;
        [ left, top, width, height ] = normalizeRect(x, y, width, height, anchor);
        const right = left + width;
        const maxLeft = Math.max(left, this.left);
        const minRight = Math.min(right, this.getRight());
        if (maxLeft >= minRight) {
            return false;
        }
        const bottom = top + height;
        const maxTop = Math.max(top, this.top);
        const minBottom = Math.min(bottom, this.getBottom());
        return maxTop < minBottom;
    }

    /**
     * Checks if this rectangle intersects with the given one.
     *
     * @param rect - The other rectangle for intersection calculation.
     * @return The new rectangle describing the intersection. Empty rectangle when not intersecting.
     */
    public intersectsRect(rect: RectLike): boolean {
        return this.intersects(rect.getLeft(), rect.getTop(), rect.getWidth(), rect.getHeight());
    }

    /**
     * Returns a new rectangle containing the current one and the given point or rectangle coordinates.
     *
     * @param x - The X position of the point to add.
     * @param y - The Y position of the point to add.
     * @return The new rectangle containing the rectangle and the given point.
     */
    public add(x: number, y: number, width = 0, height = 0, anchor = Direction.NORTH_WEST): Rect {
        let left: number, top: number;
        [ left, top, width, height ] = normalizeRect(x, y, width, height, anchor);
        if (this.contains(left, top, width, height)) {
            return this;
        }
        const right = left + width;
        const bottom = top + height;
        return Rect.fromEdges(
            Math.min(this.left, this.getRight(), left, right),
            Math.min(this.top, this.getBottom(), top, bottom),
            Math.max(this.left, this.getRight(), left, right),
            Math.max(this.top, this.getBottom(), top, bottom)
        );
    }

    /**
     * Returns a new rectangle containing the current one and the given point.
     *
     * @param point - The point to add.
     * @return The new rectangle containing the rectangle and the given point.
     */
    public addPoint(point: PointLike): Rect {
        return this.add(point.getX(), point.getY());
    }

    /**
     * Returns a new rectangle containing the current one and the given one.
     *
     * @param rect - The rectangle to add.
     * @return The new rectangle containing this rectangle and the given one.
     */
    public addRect(rect: RectLike): Rect {
        return this.add(rect.getLeft(), rect.getTop(), rect.getWidth(), rect.getHeight());
    }

    /**
     * Adds the given insets to this rectangle and returns the new one.
     *
     * @param insets - The insets to add.
     * @return The new rectangle.
     */
    public addInsets(insets: InsetsLike): Rect {
        const left = insets.getLeft();
        const top = insets.getTop();
        const right = insets.getRight();
        const bottom = insets.getBottom();
        if (left === 0 && top === 0 && right === 0 && bottom === 0) {
            return this;
        }
        return new Rect(this.left - left, this.top - top, this.width + (left + right), this.height + (top + bottom));
    }

    /**
     * Subtracts the given insets from this rectangle and returns the new one.
     *
     * @param insets - The insets to subtract.
     * @return The new rectangle.
     */
    public subInsets(insets: InsetsLike): Rect {
        const left = insets.getLeft();
        const top = insets.getTop();
        const right = insets.getRight();
        const bottom = insets.getBottom();
        if (left === 0 && top === 0 && right === 0 && bottom === 0) {
            return this;
        }
        return new Rect(this.left + left, this.top + top, this.width - (left + right), this.height - (top + bottom));
    }

    /**
     * Multiplies this rectangle with the given factors and returns the new rectangle.
     *
     * @param xFactor      - The factor to multiply the X coordinate with.
     * @param yFactor      - The factor to multiply the Y coordinate with. Defaults to X factor.
     * @param widthFactor  - The factor to multiply the width with. Defaults to X factor.
     * @param heightFactor - The factor to multiply the height with. Defaults to Y factor.
     * @return The new rectangle.
     */
    public mul(xFactor: number, yFactor = xFactor, widthFactor = xFactor, heightFactor = yFactor): Rect {
        if (xFactor === 1 && yFactor === 1 && widthFactor === 1 && heightFactor === 1) {
            return this;
        }
        return new Rect(this.left * xFactor, this.top * yFactor, this.width * widthFactor, this.height * heightFactor);
    }

    /**
     * Divides this rectangle by the given divisors and returns the new rectangle.
     *
     * @param xDivisor      - The divisor to divide the X coordinate by.
     * @param yDivisor      - The divisor to divide the Y coordinate by. Defaults to X factor.
     * @param widthDivisor  - The divisor to divide the width by. Defaults to X factor.
     * @param heightDivisor - The divisor to divide the height by. Defaults to Y factor.
     * @return The new rectangle.
     */
    public div(xDivisor: number, yDivisor = xDivisor, widthDivisor = xDivisor, heightDivisor = yDivisor): Rect {
        if (xDivisor === 1 && yDivisor === 1 && widthDivisor === 1 && heightDivisor === 1) {
            return this;
        }
        return new Rect(this.left / xDivisor, this.top / yDivisor, this.width / widthDivisor,
            this.height / heightDivisor);
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
