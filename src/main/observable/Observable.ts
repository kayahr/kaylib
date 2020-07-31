/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isIterable } from "../lang/Iterable";
import { ObservableLike } from "./ObservableLike";
import { createObserver, Observer } from "./Observer";
import { isSubscribable } from "./Subscribable";
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
    from(observable: ObservableLike<T> | Iterable<T>): ObservableLike<T>;
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

    public static from<T>(observable: ObservableLike<T> | Iterable<T>): ObservableLike<T> {
        return createObservableFrom<T>(this, Observable, observable);
    }

    public [Symbol.observable](): this {
        return this;
    }

    public "@@observable"(): this {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public subscribe(arg?: Observer<T> | ((value: T) => void) | null): Subscription {
        // The `arguments` object is used here because the observable spec unit tests don't like typescripts
        // optional parameters...
        // eslint-disable-next-line prefer-rest-params
        const observer = createObserver(arguments[0], arguments[1], arguments[2]);

        let activeObserver: Observer<T> | null = observer;
        let onCleanup: (() => void) | null = null;

        function cleanup(): void {
            const teardown = onCleanup;
            if (teardown) {
                onCleanup = null;
                teardown();
            }
        }

        const subscription = new class implements Subscription {
            public get closed(): boolean {
                return !activeObserver;
            }
            public unsubscribe(): void {
                cleanup();
                activeObserver = null;
            }
        };
        subscription.constructor = Object;
        if (observer.start) {
            observer.start(subscription);
        }
        if (activeObserver != null) {
            let teardown: TeardownLogic | null = null;
            const subscriptionObserver = new class implements SubscriptionObserver<T> {
                public get closed(): boolean {
                    return !activeObserver;
                }
                public next(value?: T): any {
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    const onNext = activeObserver ? activeObserver.next : null;
                    if (onNext) {
                        try {
                            return onNext.call(activeObserver, <T>value);
                        } catch (e) {
                            try {
                                this.error(e);
                            } catch {
                                throw e;
                            }
                        }
                    }
                    return undefined;
                }
                public error(e: Error): void {
                    const observer = activeObserver;
                    try {
                        activeObserver = null;
                        const onError = observer ? observer.error : null;
                        if (onError) {
                            return onError.call(observer, e);
                        } else {
                            throw e;
                        }
                    } catch (e) {
                        try {
                            cleanup();
                        } catch {
                            /* Already handling an error. Additional errors during cleanup are intentionally ignored. */
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
                        const onComplete = observer ? observer.complete : null;
                        if (onComplete) {
                            return onComplete.call(observer, arg);
                        }
                        return undefined;
                    } catch (e) {
                         try {
                            cleanup();
                        } catch {
                            /* Already handling an error. Additional errors during cleanup are intentionally ignored. */
                        }
                        throw e;
                    } finally {
                        cleanup();
                    }
                }
            };
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
                subscriptionObserver.error(e);
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
        fallbackConstructor: ObservableConstructor<T>, observable: ObservableLike<T> | Iterable<T>):
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
        const observableFactory = observable["@@observable"] ?? observable[Symbol.observable];
        if (observableFactory instanceof Function) {
            const observable = observableFactory();
            if (observable instanceof Object) {
                if (observable.constructor !== constructor) {
                    return new constructor(observer => observable.subscribe(observer));
                }
                return <Observable<T>>observable;
            }
        }
        if (isSubscribable(observable)) {
            return new constructor(observer => observable.subscribe(observer));
        }
    }
    throw new TypeError("Not an observable");
}

export function merge<A, B>(o1: ObservableLike<A>, o2: ObservableLike<B>): Observable<A | B>;
export function merge<A extends ObservableLike<T>[], T>(...observables: A): Observable<T> {
    return new Observable<T>(observer => {
        const subscriptions = observables.map(observable => observable.subscribe(observer));
        return (): void => {
            for (const subscription of subscriptions) {
                subscription.unsubscribe();
            }
        };
    });
}
