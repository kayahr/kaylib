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

export function pipe(): <A>(a: A) => A;
/* eslint-disable max-len */
export function pipe<A, B>(a: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(a: (a: A) => B, b: (a: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D): (a: A) => D;
export function pipe<A, B, C, D, E>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E): (a: A) => E;
export function pipe<A, B, C, D, E, F>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F): (a: A) => F;
export function pipe<A, B, C, D, E, F, G>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G): (a: A) => G;
export function pipe<A, B, C, D, E, F, G, H>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H): (a: A) => H;
export function pipe<A, B, C, D, E, F, G, H, I>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I): (a: A) => I;
export function pipe<A, B, C, D, E, F, G, H, I, J>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J): (a: A) => J;
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K): (a: A) => K;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L): (a: A) => L;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M): (a: A) => M;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N): (a: A) => N;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O): (a: A) => O;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P): (a: A) => P;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q): (a: A) => Q;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R): (a: A) => R;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S): (a: A) => S;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T): (a: A) => T;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U): (a: A) => U;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V): (a: A) => V;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V, v: (a: V) => W): (a: A) => W;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V, v: (a: V) => W, w: (a: W) => X): (a: A) => X;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V, v: (a: V) => W, w: (a: W) => X, x: (a: X) => Y): (a: A) => Y;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z>(a: (a: A) => B, b: (a: B) => C, c: (a: C) => D, d: (a: D) => E, e: (a: E) => F, f: (a: F) => G, g: (a: G) => H, h: (a: H) => I, i: (a: I) => J, j: (a: J) => K, k: (a: K) => L, l: (a: L) => M, m: (a: M) => N, n: (a: N) => O, o: (a: O) => P, p: (a: P) => Q, q: (a: Q) => R, r: (a: R) => S, s: (a: S) => T, t: (a: T) => U, u: (a: U) => V, v: (a: V) => W, w: (a: W) => X, x: (a: X) => Y, y: (a: Y) => Z): (a: A) => Z;
/* eslint-enable max-len */
export function pipe(...fns: Array<(a: unknown) => unknown>): unknown;
export function pipe(...fns: Array<(a: unknown) => unknown>): unknown {
    return (arg: unknown) => fns.reduce((result, fn) => fn(result), arg);
}

export function compose(): <A>(a: A) => A;
/* eslint-disable max-len */
export function compose<B, A>(a: (a: A) => B): (a: A) => B;
export function compose<C, B, A>(b: (a: B) => C, a: (a: A) => B): (a: A) => C;
export function compose<D, C, B, A>(c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => D;
export function compose<E, D, C, B, A>(d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => E;
export function compose<F, E, D, C, B, A>(e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => F;
export function compose<G, F, E, D, C, B, A>(f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => G;
export function compose<H, G, F, E, D, C, B, A>(g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => H;
export function compose<I, H, G, F, E, D, C, B, A>(h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => I;
export function compose<J, I, H, G, F, E, D, C, B, A>(i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => J;
export function compose<K, J, I, H, G, F, E, D, C, B, A>(j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => K;
export function compose<L, K, J, I, H, G, F, E, D, C, B, A>(k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => L;
export function compose<M, L, K, J, I, H, G, F, E, D, C, B, A>(l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => M;
export function compose<N, M, L, K, J, I, H, G, F, E, D, C, B, A>(m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => N;
export function compose<O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => O;
export function compose<P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => P;
export function compose<Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => Q;
export function compose<R, Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(q: (a: Q) => R, p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => R;
export function compose<S, R, Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(r: (a: R) => S, q: (a: Q) => R, p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => S;
export function compose<T, S, R, Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(s: (a: S) => T, r: (a: R) => S, q: (a: Q) => R, p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => T;
export function compose<U, T, S, R, Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(t: (a: T) => U, s: (a: S) => T, r: (a: R) => S, q: (a: Q) => R, p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => U;
export function compose<V, U, T, S, R, Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(u: (a: U) => V, t: (a: T) => U, s: (a: S) => T, r: (a: R) => S, q: (a: Q) => R, p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => V;
export function compose<W, V, U, T, S, R, Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(v: (a: V) => W, u: (a: U) => V, t: (a: T) => U, s: (a: S) => T, r: (a: R) => S, q: (a: Q) => R, p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => W;
export function compose<X, W, V, U, T, S, R, Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(w: (a: W) => X, v: (a: V) => W, u: (a: U) => V, t: (a: T) => U, s: (a: S) => T, r: (a: R) => S, q: (a: Q) => R, p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => X;
export function compose<Y, X, W, V, U, T, S, R, Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(x: (a: X) => Y, w: (a: W) => X, v: (a: V) => W, u: (a: U) => V, t: (a: T) => U, s: (a: S) => T, r: (a: R) => S, q: (a: Q) => R, p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => Y;
export function compose<Z, Y, X, W, V, U, T, S, R, Q, P, O, N, M, L, K, J, I, H, G, F, E, D, C, B, A>(y: (a: Y) => Z, x: (a: X) => Y, w: (a: W) => X, v: (a: V) => W, u: (a: U) => V, t: (a: T) => U, s: (a: S) => T, r: (a: R) => S, q: (a: Q) => R, p: (a: P) => Q, o: (a: O) => P, n: (a: N) => O, m: (a: M) => N, l: (a: L) => M, k: (a: K) => L, j: (a: J) => K, i: (a: I) => J, h: (a: H) => I, g: (a: G) => H, f: (a: F) => G, e: (a: E) => F, d: (a: D) => E, c: (a: C) => D, b: (a: B) => C, a: (a: A) => B): (a: A) => Z;
/* eslint-enable max-len */
export function compose(...fns: Array<(a: unknown) => unknown>): unknown;
export function compose(...fns: Array<(a: unknown) => unknown>): unknown {
    return (arg: unknown) => fns.reduceRight((result, fn) => fn(result), arg);
}

// Code to generate all these pipe/compose signatures above. Uncomment, execute with Node and copy the output to the
// source. Hopefully some day typescript has recursive types which makes these signatures obsolete.
/*
const a = (s: number): number[] => [ ...new Array<unknown>(s) ].map((v, i) => i);
const A = (s: number): number[] => a(s).reverse();
const C = (i: number): string => String.fromCharCode(65 + i);
const c = (i: number): string => C(i + 32);
const f = (a: number, b: number = a + 1): string => `(a: ${C(a)}) => ${C(b)}`;
for (let i = 2; i < 27; i++) {
    console.log(`export function pipe<${a(i).map(i => C(i)).join(", ")}>(${a(i - 1).map(i =>
        `${c(i)}: ${f(i)}`).join(", ")}): ${f(0, i - 1)};`);
}
console.log("");
for (let i = 2; i < 27; i++) {
    console.log(`export function compose<${A(i).map(i => C(i)).join(", ")}>(${A(i - 1).map(i =>
        `${c(i)}: ${f(i)}`).join(", ")}): ${f(0, i - 1)};`);
}
*/
