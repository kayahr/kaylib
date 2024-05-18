/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Callable } from "../../lang/Callable";
import type { Observable } from "../Observable";
import type { ObservableLike } from "../ObservableLike";
import type { Observer } from "../Observer";
import { SharedObservable } from "../SharedObservable";
import type { Subscription } from "../Subscription";
import type { SubscriptionObserver } from "../SubscriptionObserver";

export abstract class Value<T = unknown> extends Callable<[], T> implements ObservableLike<T>  {
    private version = 0;
    private readonly observable: Observable<T>;
    protected observer: SubscriptionObserver<T> | null = null;

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
    public subscribe(...args: [ Observer<T> ] | [ (value: T) => void, ((error: Error) => void)?, (() => void)? ]): Subscription {
        return this.observable.subscribe(...args);
    }

    public [Symbol.observable](): this {
        return this;
    }

    public "@@observable"(): this {
        return this;
    }

    protected incrementVersion(): void {
        this.version++;
    }

    public getVersion(): number {
        return this.version;
    }

    /**
     * @returns True if value is valid, false if it must be re-validated.
     */
    public abstract isValid(): boolean;

    public abstract validate(): void;

    public isWatched(): boolean {
        return this.observer != null;
    }

    public abstract get(): T;
}
