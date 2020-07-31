/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Observer } from "./Observer";
import { Subscribable } from "./Subscribable";
import { Subscription } from "./Subscription";

/**
 * The base interface for observable objects.
 */
export interface ObservableLike<T> extends Subscribable<T> {
    /** @inheritDoc */
    subscribe(observer: Observer<T>): Subscription;

    /** @inheritDoc */
    subscribe(onNext?: (value: T) => void, onError?: (error: Error) => void, onComplete?: () => void):
        Subscription;

    /** @deprecated Use an observer instead of a complete callback */
    subscribe(next: null | undefined, error: null | undefined, complete: () => void): Subscription;

    /** @deprecated Use an observer instead of an error callback */
    subscribe(next: null | undefined, error: (error: any) => void, complete?: () => void): Subscription;

    /** @deprecated Use an observer instead of a complete callback */
    subscribe(next: (value: T) => void, error: null | undefined, complete: () => void): Subscription;

    /**
     * Returns itself.
     */
    [Symbol.observable]?(): ObservableLike<T>;

    /**
     * Returns itself. This is used as a fallback for environments which don't support `Symbol.observable`.
     */
    "@@observable"?(): ObservableLike<T>;
}
