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

/* eslint-disable max-len */
export function pipe<A extends unknown[], B>(a: (...a: A) => B): (...a: A) => B;
export function pipe<A extends unknown[], B, C>(a: (...a: A) => B, b: (a: B) => C): (...a: A) => C;
export function pipe<A extends unknown[], B, C, D>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D): (...a: A) => D;
export function pipe<A extends unknown[], B, C, D, E>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E): (...a: A) => E;
export function pipe<A extends unknown[], B, C, D, E, F>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F): (...a: A) => F;
export function pipe<A extends unknown[], B, C, D, E, F, G>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G): (...a: A) => G;
export function pipe<A extends unknown[], B, C, D, E, F, G, H>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H): (...a: A) => H;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I): (...a: A) => I;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J): (...a: A) => J;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K): (...a: A) => K;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L): (...a: A) => L;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M): (...a: A) => M;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N): (...a: A) => N;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O): (...a: A) => O;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P): (...a: A) => P;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q): (...a: A) => Q;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R): (...a: A) => R;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S): (...a: A) => S;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T): (...a: A) => T;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U): (...a: A) => U;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V): (...a: A) => V;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V, v: (a: V) => W): (...a: A) => W;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V, v: (a: V) => W, w: (a: W) => X): (...a: A) => X;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V, v: (a: V) => W, w: (a: W) => X, x: (a: X) => Y): (...a: A) => Y;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z>(a: (...a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V, v: (a: V) => W, w: (a: W) => X, x: (a: X) => Y, y: (a: Y) => Z): (...a: A) => Z;
/* eslint-enable max-len */
export function pipe(fn: (...a: unknown[]) => unknown, ...fns: Array<(a: unknown) => unknown>): unknown;
export function pipe(fn: (...a: unknown[]) => unknown, ...fns: Array<(a: unknown) => unknown>): unknown {
    return (...arg: unknown[]) => fns.reduce((result, fn) => fn(result), fn(...arg));
}

/* eslint-disable max-len */
export function pipeWith<A>(a: A): A;
export function pipeWith<A, B>(a: A, b: (a: A) => B): B;
export function pipeWith<A, B, C>(a: A, b: (a: A) => B, c: (a: B) => C): C;
export function pipeWith<A, B, C, D>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D): D;
export function pipeWith<A, B, C, D, E>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E): E;
export function pipeWith<A, B, C, D, E, F>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F): F;
export function pipeWith<A, B, C, D, E, F, G>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G): G;
export function pipeWith<A, B, C, D, E, F, G, H>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H): H;
export function pipeWith<A, B, C, D, E, F, G, H, I>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I): I;
export function pipeWith<A, B, C, D, E, F, G, H, I, J>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J): J;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K): K;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L): L;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M): M;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N): N;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O): O;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P): P;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q): Q;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q, r: (a: Q) => R): R;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q, r: (a: Q) => R, s: (a: R) => S): S;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q, r: (a: Q) => R, s: (a: R) => S, t: (a: S) => T): T;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q, r: (a: Q) => R, s: (a: R) => S, t: (a: S) => T, u: (a: T) => U): U;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q, r: (a: Q) => R, s: (a: R) => S, t: (a: S) => T, u: (a: T) => U, v: (a: U) => V): V;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q, r: (a: Q) => R, s: (a: R) => S, t: (a: S) => T, u: (a: T) => U, v: (a: U) => V, w: (a: V) => W): W;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q, r: (a: Q) => R, s: (a: R) => S, t: (a: S) => T, u: (a: T) => U, v: (a: U) => V, w: (a: V) => W, x: (a: W) => X): X;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q, r: (a: Q) => R, s: (a: R) => S, t: (a: S) => T, u: (a: T) => U, v: (a: U) => V, w: (a: V) => W, x: (a: W) => X, y: (a: X) => Y): Y;
export function pipeWith<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z>(a: A, b: (a: A) => B, c: (a: B) => C, d: (a: C) => D, e: (a: D) => E, f: (a: E) => F, g: (a: F) => G, h: (a: G) => H, i: (a: H) => I, j: (a: I) => J, k: (a: J) => K, l: (a: K) => L, m: (a: L) => M, n: (a: M) => N, o: (a: N) => O, p: (a: O) => P, q: (a: P) => Q, r: (a: Q) => R, s: (a: R) => S, t: (a: S) => T, u: (a: T) => U, v: (a: U) => V, w: (a: V) => W, x: (a: W) => X, y: (a: X) => Y, z: (a: Y) => Z): Z;/* eslint-enable max-len */
export function pipeWith(a: unknown, ...fns: Array<(a: unknown) => unknown>): unknown;
export function pipeWith(a: unknown, ...fns: Array<(a: unknown) => unknown>): unknown {
    return fns.reduce((result, fn) => fn(result), a);
}
