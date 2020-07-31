/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Observer } from "./Observer";
import { Unsubscribable } from "./Unsubscribable";

/**
 * Interface for subscribable objects.
 */
export interface Subscribable<T> {
    /**
     * Subscribes the given observer to this object.
     *
     * @param observer - The observer to subscribe.
     * @return Object which can be used to unsubscribe the observer.
     */
    subscribe(observer?: Observer<T>): Unsubscribable;

    /**
     * Constructs a new observer using the given callback functions and subscribes it to this object.
     *
     * @param next     - Receives the next value in the sequence.
     * @param error    - Receives the sequence error.
     * @param complete -  Receives a completion notification.
     * @return Object which can be used to unsubscribe the observer.
     */
    subscribe(next?: (value: T) => void, error?: (error: Error) => void, complete?: () => void): Unsubscribable;

    /** @deprecated Use an observer instead of a complete callback */
    subscribe(next: null | undefined, error: null | undefined, complete: () => void): Unsubscribable;

    /** @deprecated Use an observer instead of an error callback */
    subscribe(next: null | undefined, error: (error: any) => void, complete?: () => void): Unsubscribable;

    /** @deprecated Use an observer instead of a complete callback */
    subscribe(next: (value: T) => void, error: null | undefined, complete: () => void): Unsubscribable;
}

/**
 * Checks if the given object is a subscribable.
 *
 * @param object - The object to check.
 * @return True if object is a subscribable, false if not.
 */
export function isSubscribable(object: unknown): object is Subscribable<unknown> {
    // This is a false positive from eslint. subscribe is an overloaded method and only some usages of it are
    // deprecated, not all of them.
    // eslint-disable-next-line deprecation/deprecation
    return object != null && typeof (<Subscribable<unknown>>object).subscribe === "function";
}
