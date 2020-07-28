/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { TypedArray } from "./types";

/**
 * Checks whether the given object is an array like object providing a numeric length property.
 *
 * @param T   - The array item type.
 * @param obj - The object to check.
 * @return True if object is an ArrayLike, false if not.
 */
export function isArrayLike<T>(obj: unknown): obj is ArrayLike<T> {
    return obj != null && typeof (obj as ArrayLike<T>).length === "number";
}

/**
 * Checks if given object is a typed array.
 *
 * @param obj - The object to check.
 * @return True if typed array, false if not.
 */
export function isTypedArray(obj: unknown): obj is TypedArray {
    return obj != null && (
        obj instanceof Uint8Array
        || obj instanceof Uint8ClampedArray
        || obj instanceof Uint16Array
        || obj instanceof Uint32Array
        || obj instanceof Int8Array
        || obj instanceof Int16Array
        || obj instanceof Int32Array
        || obj instanceof Float32Array
        || obj instanceof Float64Array
    );
}

/**
 * Finds the last array element for which the given predicate function returns true. Also works with typed arrays.
 *
 * @param T        - The array type.
 * @param V        - The array item type.
 * @param C        - The type of `this`.
 * @param array    - The array to search.
 * @param callback - A function to execute on each value in the array until the function returns true, indicating that
 *                   the satisfying element was found.
 * @param thisArg  - Optional object to use as `this` when executing `callback`.
 * @return The value of the last element in the array that satisfies the provided testing function.
 *         Otherwise, undefined is returned.
 */
export function findLast<T, V, C>(array: T & ArrayLike<V>,
        callback: (this: C, value: V, index: number, array: T) => boolean, thisArg?: C): V | undefined {
    for (let i = array.length - 1; i >= 0; --i) {
        const value = array[i];
        if (callback.call(thisArg as C, value, i, array)) {
            return value;
        }
    }
    return undefined;
}

/**
 * Finds the index of the last array element for which the given predicate function returns true. Also works with
 * typed arrays.
 *
 * @param T        - The array type.
 * @param V        - The array item type.
 * @param C        - The type of `this`.
 * @param array    - The array to search.
 * @param callback - A function to execute on each value in the array until the function returns true, indicating that
 *                   the satisfying element was found.
 * @param thisArg  - Optional object to use as `this` when executing `callback`.
 * @return The index of the last element in the array that satisfies the provided testing function.
 *         Otherwise, -1 is returned.
 */
export function findLastIndex<T, V, C>(array: T & ArrayLike<V>,
        callback: (this: C, value: V, index: number, array: T) => boolean, thisArg?: C): number {
    for (let i = array.length - 1; i >= 0; --i) {
        if (callback.call(thisArg as C, array[i], i, array)) {
            return i;
        }
    }
    return -1;
}

/**
 * Concatenates multiple arrays into one. Also works with typed arrays.
 *
 * @param T          - The array type.
 * @param array1     - First array to concatenate.
 * @param array2     - Second array to concatenate.
 * @param moreArrays - Optional additional arrays to concatenate.
 * @return The concatenated arrays.
 */
export function concat<T extends TypedArray | unknown[]>(array1: T, array2: T, ...moreArrays: T[]): T;
export function concat<T extends TypedArray | unknown[]>(array1: T, ...moreArrays: Array<T>): T {
    if (array1 instanceof Array) {
        return array1.concat(...moreArrays) as T;
    } else {
        const type = array1.constructor as new (size: number) => TypedArray;
        const size = moreArrays.reduce((length, array) => length + array.length, array1.length);
        const result = new type(size);
        result.set(array1 as TypedArray);
        let offset = array1.length;
        for (const array of moreArrays) {
            result.set(array as TypedArray, offset);
            offset += array.length;
        }
        return <T>result;
    }
}
