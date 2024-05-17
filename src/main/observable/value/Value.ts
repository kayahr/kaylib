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
import { Dependency } from "./Dependency";

let recordingDependencies: Map<Value, Dependency> | null = null;
let recordingValue: Value | null = null;
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

    protected registerDependency(): Dependency | null {
        if (recordingDependencies != null) {
            const dependency = recordingDependencies.get(this);
            if (dependency == null) {
                const newDependency = new Dependency(recordingValue!, this);
                recordingDependencies.set(this, newDependency);
                return newDependency;
            } else {
                dependency.update();
            }
        }
        return null;
    }

    protected recordDependencies<T>(dependencies: Map<Value, Dependency>, owner: Value, func: () => T): T {
        const previousRecordingDependencies = recordingDependencies;
        const previousRecordingValue = recordingValue;
        recordingDependencies = dependencies;
        recordingValue = owner;
        try {
            return func();
        } finally {
            recordingDependencies = previousRecordingDependencies;
            recordingValue = previousRecordingValue;
        }
    }

    protected incrementVersion(): void {
        this.version++;
    }

    public getVersion(): number {
        return this.version;
    }

    public abstract isValid(): boolean;
    public abstract validate(): void ;
    public abstract get(): T;
}
