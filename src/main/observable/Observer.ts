/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Subscription } from "./Subscription";

/**
 * Partial interface type for observer defining a mandatory `next` method. Used to construct the actual
 * [[Observer]] type.
 */
export type NextObserver<T> = {
    /**
     * Receives the next value in the sequence.
     *
     * @param value - The next value in the sequence. Not set when observable doesn't have a value type.
     */
    next(value: T): void;
};

/**
 * Partial interface type for observer defining a mandatory `error` method. Used to construct the actual
 * [[Observer]] type.
 */
export type ErrorObserver = {
    /**
     * Receives the sequence error.
     *
     * @param error - The error.
     */
    error(error: Error): void;
};

/**
 * Partial interface type for observer defining a mandatory `complete` method. Used to construct the actual
 * [[Observer]] type.
 */
export type CompleteObserver = {
    /**
     * Receives a completion notification.
     *
     * @param value - Optional completion value. This is not documented in the spec but used in the specs unit tests.
     */
    complete(value?: unknown): void;
};

/**
 * Observer interface type. It is constructed as a union type to ensure that at least one of the next/error/complete
 * properties is set.
 */
export type Observer<T> = (NextObserver<T> | ErrorObserver | CompleteObserver) & {
    /**
     * Receives the subscription object when `subscribe` is called.
     *
     * @param subscription - The subscription object.
     */
    start?(subscription: Subscription): void;

    /**
     * Receives the next value in the sequence.
     *
     * @param next - The next value in the sequence. Undefined when observable doesn't have a value type.
     */
    next?(value: T): void;

    /**
     * Receives the sequence error.
     *
     * @param error - The error.
     */
    error?(error: Error): void;

    /**
     * Receives a completion notification.
     *
     * @param value - Optional completion value. This is not documented in the spec but used in the specs unit tests.
     */
    complete?(value?: unknown): void;
};

/**
 * Validates the given observer object. When object is a valid observer then it is returned. Otherwise an exception
 * is thrown.
 */
export function createObserver<T>(observer: Observer<T>): Observer<T>;

/**
 * Creates and returns an observer from the given callback arguments
 *
 * @param onNext     - Receives the next value in the sequence.
 * @param onError    - Receives the sequence error.
 * @param onComplete - Receives a completion notification.
 * @return The created observer.
 */
export function createObserver<T>(onNext: (value: T) => void, onError?: null | ((error: Error) => void),
    onComplete?: null | (() => void)): Observer<T>;

export function createObserver<T>(observerOrOnNext: Observer<T> | ((value?: T) => void),
        onError?: null | ((error: Error) => void), onComplete?: null | (() => void)): Observer<T> {
    if (observerOrOnNext instanceof Function) {
        return {
            start: undefined,
            next: observerOrOnNext,
            error: onError ?? undefined,
            complete: onComplete ?? undefined
        };
    } else if (observerOrOnNext instanceof Object) {
        return observerOrOnNext;
    } else {
        throw new TypeError("Parameter must be an observer object or function");
    }
}
