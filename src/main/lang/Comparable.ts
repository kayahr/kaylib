/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for comparable objects providing a {@link compareTo} method.
 */
export interface Comparable<T = unknown> {
    /**
     * Compares this object with the given one and returns the comparison result (0 if objects are equal, negative
     * number when this object is less then given one, positive number when this object is greater than given object.
     *
     * @param object - The object to compare this one with.
     * @return comparison result
     */
    compareTo(object: T): number;
}

/**
 * Checks if given object is comparable.
 *
 * @param object - The object to check.
 * @return True if object is comparable, false if not.
 */
export function isComparable(object: unknown): object is Comparable {
    return object != null && typeof (object as Comparable).compareTo === "function";
}

/**
 * Helper compare function which can be used as a sort predicate for example.
 *
 * @param a - First comparable to compare.
 * @param b - Second comparable to compare.
 * @return The comparison result.
 */
export function compare<T extends Comparable<T>>(a: T, b: T): number {
    return a.compareTo(b);
}
