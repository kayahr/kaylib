/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Checks if given object is iterable.
 *
 * @return True if iterable, false if not.
 */
export function isIterable<T>(object: unknown): object is Iterable<T> {
    return object != null && typeof (object as Iterable<unknown>)[Symbol.iterator] === "function";
}
