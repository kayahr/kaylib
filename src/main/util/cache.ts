/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { createMethodDecorator } from "./decorator";
import { getObjectId } from "./object";

/**
 * Returns a cache key for the given value. If value is null or undefined then the cache key is
 * simply the string "n" or "u". If value is an object then cache key is the object ID converted into
 * a string prefixed with "o" (for object). For any other value (primitives) the cache key is the JSON
 * representation of the value prefixed with "p" (for primitive).
 *
 * Note that for objects this function only cares about the object reference, not the objects state. So the same
 * cache key is created for an object before and after the object has been modified.
 *
 * @param value - The value for which to return the cache key.
 * @return The created cache key.
 */
export function createCacheKey(value: unknown): string {
    if (value === null) {
        return "n";
    } else if (value === undefined) {
        return "u";
    } else if (value instanceof Object) {
        return "o" + getObjectId(value).toString(36);
    } else {
        return "p" + JSON.stringify(value);
    }
}

/**
 * Returns a cache key for the given set of values. For each value a cache key is generated (See
 * {@link createCacheKey} and the cache keys are then combined into a single string separated by ':'.
 *
 * @return values - The set of values for which to create a unique cache key.
 * @return The created cache key.
 */
export function createJoinedCacheKey(values: unknown[]): string {
    return values.map(createCacheKey).join(":");
}

/**
 * Decorator for caching method results. The method is only called on cache miss and then the returned result
 * is cached. Subsequent calls then return the cached result immediately without executing the method until the
 * cache is reset with `delete obj.method`.
 */
export const cacheResult = createMethodDecorator((target, propertyKey, descriptor:
        TypedPropertyDescriptor<() => any>) => {
    const origMethod = target[propertyKey];
    descriptor.value = function () {
        const origValue = origMethod.call(this) as unknown;
        Object.defineProperty(this, propertyKey, {
            configurable: true,
            value: () => origValue
        });
        return origValue;
    };
});
