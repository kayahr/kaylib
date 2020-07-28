/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for insets like objects.
 */
export interface InsetsLike {
    /**
     * Returns the inset from the top.
     *
     * @return The inset from the top.
     */
    getTop(): number;

    /**
     * Returns the inset from the right.
     *
     * @return The inset from the right.
     */
    getRight(): number;

    /**
     * Returns the inset from the bottom.
     *
     * @return The inset from the bottom.
     */
    getBottom(): number;

    /**
     * Returns the inset from the left.
     *
     * @return The inset from the left.
     */
    getLeft(): number;
}

/**
 * Checks if given object is an insets-like object.
 *
 * @param object - The object to check.
 * @return True if insets-like, false if not.
 */
export function isInsetsLike(object: unknown): object is InsetsLike {
    return object != null
        && typeof (object as InsetsLike).getTop === "function"
        && typeof (object as InsetsLike).getRight === "function"
        && typeof (object as InsetsLike).getBottom === "function"
        && typeof (object as InsetsLike).getLeft === "function";
}
