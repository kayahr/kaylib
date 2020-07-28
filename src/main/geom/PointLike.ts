/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for point-like objects.
 */
export interface PointLike {
    /**
     * Returns the X position of the point.
     *
     * @return The X position.
     */
    getX(): number;

    /**
     * Returns the Y position of the point.
     *
     * @return The Y position.
     */
    getY(): number;
}

/**
 * Checks if given object is point-like.
 *
 * @param object - The object to check.
 * @return True if object is point-like, false if not.
 */
export function isPointLike(object: unknown): object is PointLike {
    return object != null
        && typeof (object as PointLike).getX === "function"
        && typeof (object as PointLike).getY === "function";
}
