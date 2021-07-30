/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { TypedArray, WritableArrayLike } from "./types";

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
export function concat<T extends TypedArray | unknown[]>(array1: T, ...moreArrays: T[]): T {
    if (array1 instanceof Array) {
        return array1.concat(...moreArrays) as T;
    } else {
        const type = array1.constructor as new (size: number) => TypedArray;
        const size = moreArrays.reduce((length, array) => length + array.length, array1.length);
        const result = new type(size);
        result.set(array1);
        let offset = array1.length;
        for (const array of moreArrays) {
            result.set(array as TypedArray, offset);
            offset += array.length;
        }
        return result as T;
    }
}

/**
 * Swaps two elements within the given array.
 *
 * @param array - The array to swap entries within.
 * @param i     - Index of first entry to swap.
 * @param j     - Index of second entry to swap.
 */
export function swap(array: WritableArrayLike<unknown>, i: number, j: number): void {
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
}

/**
 * Permutes the given array. The used algorithm also prevents duplicate permutations.
 *
 * @param values - The array to permute.
 * @return The unique permutations of the given values.
 */
export function permute<T>(values: T[]): T[][] {
    // Shortcuts. Return empty array when no values are given and one-and-only value if only one value is given
    if (values.length === 0) {
        return [];
    } else if (values.length === 1) {
        return [ values ];
    }

    // Generate array with sorted indices. Duplicate values are represented by the same index of the first duplicate
    // value. This ensures that the permutation result does not contain duplicate permutations.
    const indices = values.map(v => values.indexOf(v)).sort((a, b) => a - b);
    const numIndices = indices.length;

    const result: T[][] = [];
    do {
        result.push(indices.map(v => values[v]));
        let i = numIndices - 2;
        while (indices[i] >= indices[i + 1]) {
            if (--i < 0) {
                return result;
            }
        }
        let j = numIndices - 1;
        while (indices[i] >= indices[j]) {
            --j;
        }
        swap(indices, i, j);
        const length = (numIndices - (i + 1)) / 2;
        for (let k = 0; k < length; k++) {
            swap(indices, i + 1 + k, numIndices - 1 - k);
        }
    } while (true);
}
