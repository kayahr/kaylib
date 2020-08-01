/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isSizeLike, SizeLike } from "./SizeLike";

/**
 * Interface for rectangle-like objects. Width and height must always be 0 or positive.
 */
export interface RectLike extends SizeLike {
    /**
     * Returns the left position of the rectangle.
     *
     * @return The left position.
     */
    getLeft(): number;

    /**
     * Returns the top position of the rectangle.
     *
     * @return The top position.
     */
    getTop(): number;
}

/**
 * Checks if given object is a rectangle-like object.
 *
 * @param object - The object to check.
 * @return True if rectangle-like, false if not.
 */
export function isRectLike(arg: unknown): arg is RectLike {
    return isSizeLike(arg)
        && typeof (arg as RectLike).getLeft === "function"
        && typeof (arg as RectLike).getTop === "function";
}
