/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for size-like objects.
 */
export interface SizeLike {
    /**
     * Returns the width part of the size.
     *
     * @return The width.
     */
    getWidth(): number;

    /**
     * Returns the height part of the size.
     *
     * @return The height.
     */
    getHeight(): number;
}

/**
 * Checks if given object is a size-like object.
 *
 * @param object - The object to check.
 * @return True if size-like, false if not.
 */
export function isSizeLike(object: unknown): object is SizeLike {
    return object != null
        && typeof (object as SizeLike).getWidth === "function"
        && typeof (object as SizeLike).getHeight === "function";
}
