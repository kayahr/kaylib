/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Equatable, isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { IllegalArgumentException } from "../util/exception";
import { formatNumber } from "../util/string";
import { PointLike } from "./PointLike";

/**
 * Serialized JSON structure of a point.
 */
export interface PointJSON {
    /** The X position of the point. */
    x: number;

    /** The Y position of the point. */
    y: number;
}

/**
 * Immutable 2D point with an X and Y position.
 */
export class Point implements PointLike, Serializable<PointJSON>, Equatable {
    /** Point constant for position x=0,y=0 */
    public static readonly NULL = new Point(0, 0);

    /**
     * Creates new insets.
     *
     * @param x - The X position.
     * @param y - The Y position.
     */
    public constructor(
        private readonly x: number,
        private readonly y: number
    ) {}

    /**
     * Creates a new point from the given point-like object.
     *
     * @param point - The object to copy the coordinates from.
     * @return The created point object.
     */
    public static fromPoint(point: PointLike): Point {
        return new Point(point.getX(), point.getY());
    }

    public static fromJSON(json: PointJSON): Point {
        return new Point(json.x, json.y);
    }

    /**
     * Creates a point from a string. X and Y can be separated by any character/string which is not a number.
     *
     * @param s - The point as a string.
     * @return The parsed point.
     */
    public static fromString(s: string): Point {
        const values = s.trim().split(/[^-+0-9.]+/, 2).map(value => +value);
        if (values.length !== 2 || values.some(value => isNaN(value))) {
            throw new IllegalArgumentException("Invalid point string: " + s);
        }
        return new Point(values[0], values[1]);
    }

    /** @inheritDoc */
    public toJSON(): PointJSON {
        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Returns the point as a string in format `${x},${y}`.
     *
     * @param maximumFractionDigits - The maximum number of fraction digits. Defaults to 6.
     * @return The point as a string.
     */
    public toString(maximumFractionDigits: number = 6): string {
        const x = formatNumber(this.x, { maximumFractionDigits });
        const y = formatNumber(this.y, { maximumFractionDigits });
        return `${x},${y}`;
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.x === other.x && this.y === other.y);
    }

    /** @inheritDoc */
    public getX(): number {
        return this.x;
    }

    /** @inheritDoc */
    public getY(): number {
        return this.y;
    }

    /**
     * Returns true if point is null (width and height is 0).
     *
     * @return True if point is null, false if not.
     */
    public isNull(): boolean {
        return this.x === 0 && this.y === 0;
    }

    /**
     * Transposes the point by swapping x and y.
     *
     * @return The transposed point.
     */
    public transpose(): Point {
        if (this.x === this.y) {
            return this;
        }
        return new Point(this.y, this.x);
    }

    /**
     * Adds the given coordinates to this point and returns the new point.
     *
     * @param x - The X coordinate to add.
     * @param y - The Y coordinate to add.
     * @return The new point.
     */
    public add(x: number, y: number): Point {
        if (x === 0 && y === 0) {
            return this;
        }
        return new Point(this.x + x, this.y + y);
    }

    /**
     * Adds the given coordinates to this point and returns the new point.
     *
     * @param point - The coordinates to add.
     * @return The new point.
     */
    public addPoint(point: PointLike): Point {
        return this.add(point.getX(), point.getY());
    }

    /**
     * Subtracts the given coordinates from this point and returns the new point.
     *
     * @param x - The X coordinate to subtract.
     * @param y - The Y coordinate to subtract.
     * @return The new point.
     */
    public sub(x: number, y: number): Point {
        if (x === 0 && y === 0) {
            return this;
        }
        return new Point(this.x - x, this.y - y);
    }

    /**
     * Subtracts the given coordinates from this point and returns the new point.
     *
     * @param point - The coordinates to subtract.
     * @return The new point.
     */
    public subPoint(point: PointLike): Point {
        return this.sub(point.getX(), point.getY());
    }

    /**
     * Multiplies this point with the given factors and returns the new point.
     *
     * @param xFactor - The factor to multiply the X coordinate with.
     * @param yFactor - The factor to multiply the Y coordinate with. Defaults to X factor.
     * @return The new point.
     */
    public mul(xFactor: number, yFactor: number = xFactor): Point {
        if (xFactor === 1 && yFactor === 1) {
            return this;
        }
        return new Point(this.x * xFactor, this.y * yFactor);
    }

    /**
     * Divides this point by the given divisor and returns the new point.
     *
     * @param xDivisor - The divisor to divide the X coordinate by.
     * @param yDivisor - The divisor to divide the Y coordinate by. Defaults to X divisor.
     * @return The new point.
     */
    public div(xDivisor: number, yDivisor: number = xDivisor): Point {
        if (xDivisor === 1 && yDivisor === 1) {
            return this;
        }
        return new Point(this.x / xDivisor, this.y / yDivisor);
    }

    /**
     * Returns the square distance between this point and the given point.
     *
     * @param point - The distant point. If not specified then the Point at 0,0 is used.
     * @return The square distance.
     */
    public getSquareDistance(point: PointLike = Point.NULL): number {
        const x = point.getX() - this.x;
        const y = point.getY() - this.y;
        return x * x + y * y;
    }

    /**
     * Returns the distance between this point and the given point.
     *
     * @param point - The distant point. If not specified then the Point at 0,0 is used.
     * @return The distance.
     */
    public getDistance(point: PointLike = Point.NULL): number {
        return Math.sqrt(this.getSquareDistance(point));
    }
}
