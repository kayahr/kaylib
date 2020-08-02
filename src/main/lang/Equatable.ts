/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for equatable objects providing an [[equal]] method.
 */
export interface Equatable {
    /**
     * Checks if the given object is equal to this one. It is recommended to use the [[isEqual]] function in the
     * method implementation to correctly implement the equality contract.
     *
     * @param object - The object to check for equality.
     * @return True if object is equal, false if not.
     */
    equals(object: unknown): boolean;
}

/**
 * Checks if given object is equatable.
 *
 * @param object - The object to check.
 * @return True if object is equatable, false if not.
 */
export function isEquatable(object: unknown): object is Equatable {
    return object != null && typeof (object as Equatable).equals === "function";
}

/**
 * Helper function which can be used in equals methods of equatable objects to easily and correctly implement
 * the equality contract.
 *
 * @param a        - First object to compare.
 * @param b        - Second object to compare.
 * @param comparer - Comparer function called within the context of the first object and with the second object
 *                   passed as argument. This function is responsible for comparing the various properties. Type
 *                   checks and null checks are already performed when this function is called. The function must
 *                   return true when objects are equal and false when not.
 * @return True if objects are equal, false if not.
 */
export function isEqual<T extends Equatable>(a: T, b: unknown, comparer: (other: T) => boolean): boolean {
    if (b == null) {
        return false;
    }
    if (b === a) {
        return true;
    }
    const other = b as T;
    if (other.equals !== a.equals) {
        return false;
    }
    return comparer.call(a, other);
}
