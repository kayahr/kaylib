/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Callable } from "../../lang/Callable";
import type { Observable } from "../Observable";
import type { Observer } from "../Observer";
import { SharedObservable } from "../SharedObservable";
import type { Subscription } from "../Subscription";
import type { SubscriptionObserver } from "../SubscriptionObserver";
import type { Value } from "./Value";

/**
 * Base class for observable value implementations providing the value version, observable and callable functionality.
 */
export abstract class AbstractValue<T = unknown> extends Callable<[], T> implements Value<T>  {
    /** Value version which is incremented every time the value actually changes. */
    private version = 0;

    /** The observable on which observers can be subscribed to get informed about value changes. */
    private readonly observable: Observable<T>;

    /** The shared observer on which to emit new values. */
    protected observer: SubscriptionObserver<T> | null = null;

    /**
     * @param init - Optional function to call on first subscription.
     * @param tearDown - Optional function call when last subscriber is unsubscribed.
     */
    public constructor(init?: () => void, tearDown?: () => void) {
        super(() => this.get());
        this.observable = new SharedObservable(observer => {
            init?.();
            this.observer = observer;
            return () => {
                tearDown?.();
                this.observer = null;
            };
        });
    }

    public subscribe(observer: Observer<T>): Subscription;
    public subscribe(next: (value: T) => void, error?: (error: Error) => void, complete?: () => void): Subscription;

    /** @inheritDoc */
    public subscribe(...args: [ Observer<T> ] | [ (value: T) => void, ((error: Error) => void)?, (() => void)? ]): Subscription {
        return this.observable.subscribe(...args);
    }

    /** @inheritDoc */
    public [Symbol.observable](): this {
        return this;
    }

    /** @inheritDoc */
    public "@@observable"(): this {
        return this;
    }

    /**
     * Increments the value version. Must be called when the value changes.
     */
    protected incrementVersion(): void {
        this.version++;
    }

    /** @inheritDoc */
    public getVersion(): number {
        return this.version;
    }

    /** @inheritDoc */
    public abstract isValid(): boolean;

    /** @inheritDoc */
    public abstract validate(): void;

    /** @inheritDoc */
    public isWatched(): boolean {
        return this.observer != null;
    }

    /** @inheritDoc */
    public abstract get(): T;
}
