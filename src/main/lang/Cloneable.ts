/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for cloneable objects.
 */
export interface Cloneable<T = unknown> {
    /**
     * Clones the object.
     *
     * @return The created clone of the object.
     */
    clone(): T;
}

/**
 * Checks if given object is cloneable.
 *
 * @return True if cloneable, false if not.
 */
export function isCloneable(object: unknown): object is Cloneable {
    return object != null && typeof (object as Cloneable).clone === "function";
}
