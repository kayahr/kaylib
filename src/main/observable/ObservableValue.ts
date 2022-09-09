/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { SubscribeArgs } from "./Observable";
import { SharedObservable } from "./SharedObservable";
import { Subscription } from "./Subscription";
import { SubscriptionObserver } from "./SubscriptionObserver";

/**
 * An observable value which can be read and written directly and can also be observed for changes. A new subscriber
 * is immediately informed about the current value.
 */
export class ObservableValue<T> extends SharedObservable<T> {
    private value: T;
    private observer!: SubscriptionObserver<T>;

    /**
     * Creates a new observable value.
     *
     * @param - The initial value.
     */
    public constructor(value: T) {
        super(observer => {
            this.observer = observer;
        });
        this.value = value;
    }

    /** @inheritDoc */
    public override toString(): string {
        return this.value?.toString() ?? ("" + this.value);
    }

    /** @inheritDoc */
    public override valueOf(): T {
        return this.value;
    }

    /**
     * @returns The current value.\
     */
    public get(): T {
        return this.value;
    }

    /**
     * Sets a new value. Observers are informed about the new value only if the value is not the same as the current
     * value.
     *
     * @param value - The new value to set.
     */
    public set(value: T): this {
        if (value !== this.value) {
            this.value = value;
            this.observer.next(value);
        }
        return this;
    }

    /** @inheritDoc */
    public override subscribe(...args: SubscribeArgs<T>): Subscription {
         const subscription = super.subscribe(...args);
         const arg = args[0];
         if (arg instanceof Function) {
             arg(this.value);
         } else {
             arg?.next?.(this.value);
         }
         return subscription;
    }
}
