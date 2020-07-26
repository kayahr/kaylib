/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Generic list type describing objects with a `length` attribute and an `item` getter method.
 *
 * @param T - The list item type.
 */
export interface List<T = unknown> {
    /** The number of items in the list. */
    readonly length: number;

    /**
     * Returns the item at the given list item.
     *
     * @param index - The index within the list.
     * @return The value at the given index.
     */
    item(index: number): T;
}

/**
 * Checks if given argument is a list. A list has a numeric `length` attribute and an `item` method.
 *
 * @return True if argument is a list, false if not.
 */
export function isList<T>(obj: unknown): obj is List<T> {
    return obj != null && typeof (obj as List).length === "number" && typeof (obj as List).item === "function";
}
