/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Callable } from "../../lang/Callable";
import type { Observable } from "../Observable";
import type { Observer } from "../Observer";
import { SharedObservable } from "../SharedObservable";
import type { Subscription } from "../Subscription";
import { SubscriptionObserver } from "../SubscriptionObserver";
import type { Value } from "./Value";

export abstract class AbstractValue<T = unknown> extends Callable<[], T> implements Value<T> {
    private version = 0;
    protected observer: SubscriptionObserver<T> | null = null;
    private readonly observable: Observable<T>;

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
        ++this.version;
    }

    public getVersion(): number {
        return this.version;
    }

    public override valueOf(): T {
        return this.get();
    }

    public override toString(): string {
        return String(this.get());
    }

    public abstract get(): T;
}
