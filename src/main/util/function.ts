/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Exception } from "./exception";

/**
 * Exception type thrown when a weak function can not be called because it has been garbage-collected.
 */
class WeakFunctionDestroyedException extends Exception {
    public constructor() {
        super("Weak function has been destroyed");
    }
}

/** Constant exception thrown when a weak function can not be called because it has been garbage-collected. */
export const weakFunctionDestroyedException = new WeakFunctionDestroyedException();

/** Key symbol used to store a function id symbol under a function object. */
const functionIdKey = Symbol("function id key");

/** Key symbol used to store a weak function under a function object. */
const weakFunctionKey = Symbol("weak function");

/**
 * Binds the given function to the given scope. This is the same as `func.bind(scope)` but caches the created
 * bound function in the scope so binding the same function to the same scope always yields the same bound function.
 *
 * @param func - The function to bind.
 * @param scope - The scope to bind the function to. If not specified then function is returned unbound.
 * @return The bound function.
 */
export function bind<T extends unknown[], R>(func: (...args: T) => R, scope?: object): (...args: T) => R {
    // When no scope is specified then binding is not needed
    if (scope == null) {
        return func;
    }

    // Slots are cached as symbol properties under function instead of using WeakMaps, because this is much
    // faster than using WeakMaps.
    const scopeMap = scope as Record<symbol, (...args: T) => R>;
    const funcMap = func as (object & Record<symbol, symbol>);

    // Get function id from function
    const functionId = funcMap[functionIdKey] ?? (funcMap[functionIdKey] = Symbol("function id"));

    // Create, cache and return bound function
    return scopeMap[functionId] ?? (scopeMap[functionId] = ((...args: T): R => func.apply(scope, args)));
}

function callWeak<T extends unknown[], R>(funcRef: WeakRef<(...args: T) => R>): (...args: T) => R {
    let destroyed = false;
    return (...args: T): R => {
        if (!destroyed) {
            const func = funcRef.deref();
            if (func != null) {
                return func(...args);
            }
        }
        destroyed = true;
        throw weakFunctionDestroyedException;
    };
}

/**
 * Weakly binds the given function to the given scope. This does the same as the [[bind]] function but weakly
 * references the function or scope so even when a reference to the bound function is kept the original function or
 * scope can be garbage-collected. When calling the bound function after the original function or scope has been
 * garbage-collected then the bound function throws a [[weakFunctionDestroyedException]].
 *
 * Note that the weakly bound function is not destroyed when function is bound to a scope and only the function is
 * garbage-collected. Supporting this would require two separate slow WeakRef derefs. This isn't worth it because this
 * scenario is very exotic. Usually you have a function, or you have a method. For a method the function usually
 * is never garbage-collected, only the scope (the class instance) is.
 *
 * @param func - The function to bind.
 * @param scope - The scope to bind the function to. If not specified then function is returned unbound.
 * @return The weakly bound function.
 */
export function weakBind<T extends unknown[], R>(func: (...args: T) => R, scope?: object): (...args: T) => R {
    const bound = bind(func, scope);
    const boundMap = bound as (object & Record<symbol, (...args: T) => R>);
    return boundMap[weakFunctionKey] ?? (boundMap[weakFunctionKey] = callWeak(new WeakRef(bound)));
}
