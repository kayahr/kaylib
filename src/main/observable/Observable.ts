/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Subscribable as RxJSSubscribable } from "rxjs";

import { isIterable } from "../lang/Iterable";
import { toError } from "../util/error";
import { ObservableLike } from "./ObservableLike";
import { createObserver, Observer } from "./Observer";
import { isSubscribable, Subscribable } from "./Subscribable";
import { SubscriberFunction } from "./SubscriberFunction";
import { Subscription } from "./Subscription";
import { SubscriptionObserver } from "./SubscriptionObserver";
import { TeardownLogic } from "./TeardownLogic";

/**
 * Interface of an observable constructor.
 */
export interface ObservableConstructor<T> {
    /**
     * Constructs a new observable.
     *
     * @param subscriber - The subscriber function.
     */
    new (subscriber: SubscriberFunction<T>): ObservableLike<T>;

    /**
     * Converts items to an Observable.
     *
     * @param items - The items to convert.
     * @return The created observable.
     */
    of(...items: T[]): ObservableLike<T>;

    /**
     * Converts an observable or iterable to an Observable.
     *
     * @param observable - The observable or iterable to convert.
     * @return The created observable.
     */
    from(observable: Subscribable<T> | Iterable<T>): ObservableLike<T>;
}

/**
 * Observable implementation.
 */
export class Observable<T> implements ObservableLike<T> {
    /** The subscriber function. */
    private readonly subscriber: SubscriberFunction<T>;

    /**
     * Creates a new observable using the given subscriber function.
     *
     * @param subscriber - The subscriber function.
     */
    public constructor(subscriber: SubscriberFunction<T>) {
        if (!(subscriber instanceof Function)) {
            throw new TypeError("Parameter must be a subscriber function");
        }
        this.subscriber = subscriber;
    }

    public static of<T>(...items: T[]): ObservableLike<T> {
        return createObservableOf<T>(this, Observable, ...items);
    }

    public static from<T>(observable: Subscribable<T> | Iterable<T>): ObservableLike<T> {
        return createObservableFrom<T>(this, Observable, observable);
    }

    public [Symbol.observable](): this & RxJSSubscribable<T> {
        return this;
    }

    public "@@observable"(): this & RxJSSubscribable<T> {
        return this;
    }

    /** @inheritDoc */
    public subscribe(observer: Observer<T>): Subscription;

    /** @inheritDoc */
    public subscribe(onNext: (value: T) => void, onError?: (error: Error) => void,
        onComplete?: () => void): Subscription;

    /** @deprecated Use an observer instead of a complete callback */
    public subscribe(next: null | undefined, error: null | undefined, complete: () => void): Subscription;

    /** @deprecated Use an observer instead of an error callback */
    public subscribe(next: null | undefined, error: (error: any) => void, complete?: () => void): Subscription;

    /** @deprecated Use an observer instead of a complete callback */
    public subscribe(next: (value: T) => void, error: null | undefined, complete: () => void): Subscription;

    /** @inheritDoc */
    public subscribe(arg: unknown): Subscription {
        // The `arguments` object is used here because the observable spec unit tests don't like typescripts
        // optional parameters... For the same reason the subscribe function implementation has a single unused
        // argument.
        // eslint-disable-next-line prefer-rest-params
        const args = arguments as unknown as [ Observer<T> ]
            | [ (value: T) => void, ((error: Error) => void) | undefined, (() => void) | undefined ]
            | [ null | undefined, null | undefined, (() => void) ]
            | [ null | undefined, ((error: any) => void) | undefined, (() => void) | undefined ]
            | [ (value: T) => void, null | undefined, () => void ];
        let observer: Observer<T>;
        if (args[0] instanceof Function) {
            observer = createObserver(args[0], args[1], args[2]);
        } else if (args[0] instanceof Object) {
            observer = createObserver(args[0]);
        } else {
            throw new TypeError("Parameter must be an observer object or function");
        }
        let activeObserver: Observer<T> | null = observer;
        let onCleanup: (() => void) | null = null;

        function cleanup(): void {
            const teardown = onCleanup;
            if (teardown != null) {
                onCleanup = null;
                teardown();
            }
        }

        const subscription = new class implements Subscription {
            public get closed(): boolean {
                return activeObserver == null;
            }
            public unsubscribe(): void {
                cleanup();
                activeObserver = null;
            }
        };
        subscription.constructor = Object;
        if (observer.start != null) {
            observer.start(subscription);
        }
        if (activeObserver != null) {
            let teardown: TeardownLogic | null = null;
            const subscriptionObserver = new class implements SubscriptionObserver<T> {
                public get closed(): boolean {
                    return activeObserver == null;
                }
                public next(arg: T): any {
                    const onNext = activeObserver?.next;
                    if (onNext != null) {
                        // Speed optimization: Replace next method with a more direct function call
                        const boundOnNext = onNext.bind(activeObserver);
                        this.next = (arg: T): any => {
                            try {
                                return boundOnNext(arg);
                            } catch (e) {
                                try {
                                    this.error(toError(e));
                                } catch {
                                    throw e;
                                }
                            }
                        };
                    } else {
                        this.next = () => undefined;
                    }
                    return this.next(arg);
                }
                public error(e: Error): void {
                    const observer = activeObserver;
                    try {
                        activeObserver = null;
                        // Speed optimization: Replace next method instead of doing null checks in next method
                        this.next = () => undefined;
                        const onError = observer?.error ?? null;
                        if (onError != null) {
                            return onError.call(observer, e);
                        } else {
                            throw e;
                        }
                    } catch (e) {
                        try {
                            cleanup();
                        } catch {
                            // Already handling an error. Additional errors during cleanup are intentionally ignored.
                        }
                        throw e;
                    } finally {
                        cleanup();
                    }
                }
                public complete(arg?: unknown): any {
                    const observer = activeObserver;
                    try {
                        activeObserver = null;
                        // Speed optimization: Replace next method instead of doing null checks in next method
                        this.next = () => undefined;
                        const onComplete = observer?.complete ?? null;
                        if (onComplete != null) {
                            return onComplete.call(observer, arg);
                        }
                    } catch (e) {
                         try {
                            cleanup();
                        } catch {
                            // Already handling an error. Additional errors during cleanup are intentionally ignored.
                        }
                        throw e;
                    } finally {
                        cleanup();
                    }
                }
            }();
            subscriptionObserver.constructor = Object;
            try {
                teardown = this.subscriber(subscriptionObserver);
                if (teardown != null) {
                    if (teardown instanceof Function) {
                        onCleanup = teardown;
                    } else if (teardown instanceof Object && teardown.unsubscribe instanceof Function) {
                        onCleanup = teardown.unsubscribe.bind(teardown);
                    } else {
                        throw new TypeError("Result must be a callable or subscription");
                    }
                    if (activeObserver == null) {
                        cleanup();
                    }
                } else {
                    onCleanup = null;
                }
            } catch (e) {
                subscriptionObserver.error(toError(e));
            }
        }
        return subscription;
    }
}

export function createObservableOf<T>(thisConstructor: ObservableConstructor<T>,
        fallbackConstructor: ObservableConstructor<T>, ...items: T[]): ObservableLike<T> {
    const constructor = thisConstructor instanceof Function ? thisConstructor : fallbackConstructor;
    return new constructor(observer => {
        for (const value of items) {
            observer.next(value);
        }
        observer.complete();
    });
}

export function createObservableFrom<T>(thisConstructor: ObservableConstructor<T>,
        fallbackConstructor: ObservableConstructor<T>, observable: Subscribable<T> | Iterable<T>):
        ObservableLike<T> {
    const constructor = thisConstructor instanceof Function ? thisConstructor : fallbackConstructor;
    if (isIterable(observable)) {
        return new constructor(observer => {
            for (const value of observable) {
                observer.next(value);
            }
            observer.complete();
        });
    } else if (observable instanceof Object) {
        const observableFactory = (observable as Observable<T>)["@@observable"]
            ?? (observable as Observable<T>)[Symbol.observable];
        if (observableFactory instanceof Function) {
            const observable = observableFactory();
            if (observable instanceof Object) {
                if (observable.constructor !== constructor) {
                    return new constructor(observer => observable.subscribe(observer));
                }
                return observable;
            }
        }
        if (isSubscribable(observable)) {
            return new constructor(observer => observable.subscribe(observer));
        }
    }
    throw new TypeError("Not an observable");
}
