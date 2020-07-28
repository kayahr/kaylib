/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { LRUMap } from "../collection/LRUMap";
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
 * [[createCacheKey]] and the cache keys are then combined into a single string separated by ':'.
 *
 * @return values - The set of values for which to create a unique cache key.
 * @return The created cache key.
 */
export function createJoinedCacheKey(values: unknown[]): string {
    return values.map(createCacheKey).join(":");
}

/**
 * Type for cache decorator options passed to the [[cache]] decorator.
 */
export type CacheOptions = {
    /**
     * The maximum number of results to cache for the different sets of method arguments. Not used when method has
     * no arguments because then there always can be only one result. If method has arguments and no maximum size
     * is defined then the cache can grow indefinitely and must be cleared manually.
     */
    maxSize?: number;
};

/** The result value cache. */
let resultCache = new WeakMap<object, WeakMap<Function, Map<string, unknown>>>();

/**
 * Decorator for caching method results. The method is only called on cache miss and then the returned result
 * is cached. Subsequent calls then return the cached result immediately without executing the method until the
 * cache is reset with [[resetResultCache]].
 *
 * @param options - Optional cache options.
 */
export const cacheResult = createMethodDecorator((target, propertyKey,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>, options: CacheOptions) => {
    const origMethod = descriptor.value;
    function newMethod(this: object, ...args: any[]): any {
        let targetCache = resultCache.get(this);
        if (!targetCache) {
            targetCache = new WeakMap<object, Map<string, any>>();
            resultCache.set(this, targetCache);
        }
        let methodCache = targetCache.get(newMethod);
        if (!methodCache) {
            methodCache = options.maxSize != null ? new LRUMap<string, any>(options.maxSize) : new Map<string, any>();
            targetCache.set(newMethod, methodCache);
        }
        const cacheKey = createJoinedCacheKey(args);
        if (methodCache.has(cacheKey)) {
            return methodCache.get(cacheKey);
        }
        if (origMethod == null) {
            throw new Error("Method not found");
        }
        const value = origMethod.apply(this, args) as unknown;
        methodCache.set(cacheKey, value);
        return value;
    }
    descriptor.value = newMethod;
});

/**
 * Resets the result cache.
 *
 * @param target - Optional target object for which to reset the result cache. Resets the whole result cache if no
 *                 target object is specified.
 * @param method - Optional method for which to reset the result cache. Resets the cache for all methods of the target
 *                 object if not specified.
 */
export function resetResultCache(target?: object, method?: Function): void {
    if (target) {
        if (method) {
            const targetCache = resultCache.get(target);
            if (targetCache) {
                targetCache.delete(method);
            }
        } else {
            resultCache.delete(target);
        }
    } else {
        resultCache = new WeakMap<object, WeakMap<Function, Map<string, unknown>>>();
    }
}
