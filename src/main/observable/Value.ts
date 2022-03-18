/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { equals } from "../util/object";
import { SharedObservable } from "./SharedObservable";
import { Subscribable } from "./Subscribable";
import { SubscriptionObserver } from "./SubscriptionObserver";

/**
 * Interface for a readonly value.
 */
export interface ReadonlyValue<T> extends Subscribable<T> {
    /**
     * Returns the value.
     *
     * @return The value.
     */
    get(): T;
}

/**
 * Observable container for a value.
 */
export class Value<T> extends SharedObservable<T> implements ReadonlyValue<T> {
    /** The current vale. */
    private value: T;

    /** The subscription observer used to inform subscribers about changed values. */
    private observer: SubscriptionObserver<T> | null = null;

    /**
     * Creates new observable container with the given initial value.
     *
     * @param value - The initial value to set.
     */
    public constructor(value: T) {
        super(observer => {
            this.observer = observer;
            return () => {
                this.observer = null;
            };
        });
        this.value = value;
    }

    /** @inheritDoc */
    public get(): T {
        return this.value;
    }

    /**
     * Sets the value. If new value is not equal to old value then observers are informed about the change.
     *
     * @param value - The value to set.
     */
    public set(value: T): this {
        if (!equals(value, this.value)) {
            this.value = value;
            this.observer?.next(value);
        }
        return this;
    }
}
