/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for serializable objects.
 */
export interface Serializable<T = unknown> {
    /**
     * Serializes the object to the given JSON object.
     *
     * @return The serialized JSON object.
     */
    toJSON(): T;
}

/**
 * Checks if given object is serializable.
 *
 * @param object - The object to check.
 * @return True if object is serializable, false if not.
 */
export function isSerializable(object: unknown): object is Serializable {
    return object != null && typeof (object as Serializable).toJSON === "function";
}
