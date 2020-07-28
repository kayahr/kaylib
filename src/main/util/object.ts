/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isEquatable } from "../lang/Equatable";
import { isTypedArray } from "./array";
import { getClass } from "./class";
import { IllegalStateException } from "./exception";

/** Cached object IDs. */
const objectIds = new WeakMap<object, number>();

/** Next object ID. */
let nextObjectId = Number.MIN_SAFE_INTEGER;

/**
 * Returns the object ID of the given object. This is simply an automatically incremented 54 bit integer which is
 * cached in a WeakMap so the function always returns the same ID for an object on each call.
 *
 * @param object - The object for which to return the ID.
 * @return The object ID.
 */
export function getObjectId(object: object): number {
    let id = objectIds.get(object);
    if (id == null) {
        id = nextObjectId++;
        if (id === Number.MAX_SAFE_INTEGER) {
            // If this ever happens I really like to know what the application is doing with object IDs...
            throw new IllegalStateException("Object IDs exhausted");
        }
        objectIds.set(object, id);
    }
    return id;
}

/**
 * Checks if the specified object is a record. Only direct instances of the Object type are recognized as record.
 * Types extending Object (Like Array, Date or custom types) are not records.
 *
 * @param object - The object to check.
 * @return True if object is a record, false if not.
 */
export function isRecord(object: unknown): object is Record<string, unknown> {
    return object != null && (object as object).constructor === Object;
}

/**
 * This function is used internally for a deep equals check.
 *
 * @param a    - The first object to compare.
 * @param b    - The second object to compare.
 * @param seen - Optional weak map with already seen objects to prevent recursion loops.
 * @return True if objects are equal, false if not.
 */
function deepEquals(a: unknown | null | undefined, b: unknown | null | undefined,
        seen = new WeakMap<object, object>()): boolean {
    // Check if objects are exactly the same instance or same primitive value
    if (a === b) {
        return true;
    }

    // Check for null/undefined
    if (a == null || b == null) {
        return false;
    }

    if (a instanceof Object && b instanceof Object) {
        // Check if object combination has already been checked to prevent endless recursion loops when cyclic
        // references are encountered within objects or arrays. We assume the values are equal when already seen
        // because otherwise we would not be here
        if (seen.get(a) === b) {
            return true;
        }
        seen.set(a, b);
        seen.set(b, a);

        // Use equals if equatable
        if (isEquatable(a)) {
            return a.equals(b);
        }

        // Perform deep equality check on arrays
        if (a instanceof Array) {
            if (b instanceof Array) {
                if (a.length !== b.length) {
                    return false;
                }
                for (let i = 0, max = a.length; i !== max; ++i) {
                    if (!deepEquals(a[i], b[i], seen)) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        }

        // Perform equality check on typed arrays
        if (isTypedArray(a)) {
            if (isTypedArray(b)) {
                if (a.length !== b.length || getClass(a) !== getClass(b)) {
                    return false;
                }
                for (let i = 0, max = a.length; i !== max; ++i) {
                    if (a[i] !== b[i]) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        }

        // Perform order-indifferent check on sets
        if ((a instanceof Set) && (b instanceof Set)) {
            if (a.size !== b.size) {
                return false;
            }
            for (const value of a.values()) {
                if (!b.has(value)) {
                    return false;
                }
            }
            return true;
        }

        // Functions are also objects but when they didn't matched at the `===` check at the beginning then we
        // already know that they can't be equal
        if ((a instanceof Function) || (b instanceof Function)) {
            return false;
        }

        // Build array with all keys from obj1 and obj2
        const keys = Object.keys(a);
        for (const key of Object.keys(b)) {
            if (!keys.includes(key)) {
                keys.push(key);
            }
        }

        // Check if all properties of the objects are equal
        return keys.every(key => deepEquals((a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key], seen));
    }

    // Not equal
    return false;
}

/**
 * Checks if the two given objects are equal. The objects can be of any type including `null` and `undefined`.
 * The equality check is done recursively if objects are arrays or generic objects. When an object has an `equals`
 * method then this method is used for the equality check.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @return True if objects are equal, false if not.
 */
export function equals(a: unknown | null | undefined, b: unknown | null | undefined): boolean {
    return deepEquals(a, b);
}
