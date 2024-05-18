/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Dependencies } from "./Dependencies";
import { Value } from "./Value";

/** Special value used to indicate that none value is present yet so `null` and `undefined` can be used as actual value. */
const NONE = Symbol("NONE");

/**
 * Observable value which computes its value with a given compute function. The compute function is called when the getter is called the first (or the first
 * observer is subscribed) and on any subsequent call when one more of the dependencies have been changed. The compute function is also called when the value
 * is observed and one of the dependencies send a change notification.
 */
export class ComputedValue<T = unknown> extends Value<T> {
    /** The dependencies. */
    private readonly dependencies = new Dependencies(this);

    /** The function used to compute the value. */
    private readonly compute: () => T;

    /** The current computed value. NONE if it has not yet been computed. */
    private value: T | typeof NONE = NONE;

    /**
     * Creates a new computed value calling the given function to compute the actual value.\
     *
     * @param compute - The function used to compute the value.
     */
    public constructor(compute: () => T) {
        super(() => this.dependencies.watch(), () => this.dependencies.unwatch());
        this.compute = compute;
    }

    /** @inheritDoc */
    public override isValid(): boolean {
        return this.dependencies.isValid();
    }

    /** @inheritDoc */
    public override validate(): void {
        if (this.dependencies.validate()) {
            // When context validation came to the conclusion that the computed value must be updated then do it
            const newValue = this.dependencies.record(this.compute);
            if (newValue !== this.value) {
                // When new value does not equal the old one then increment version and inform subscribed observers
                this.value = newValue;
                this.incrementVersion();
                this.observer?.next(newValue);
            }
        }
    }

    /** @inheritDoc */
    public override get(): T {
        if (this.value === NONE) {
            // This is the first read access of the value so compute it for the first time, without checking for changes
            this.value = this.dependencies.record(this.compute);
        } else if (!this.isValid()) {
            // When context is invalid then validate it
            this.validate();
        }

        // Register this value as dependency in the current compute context. Such a context only exists when getter was
        // called from within a compute function. Otherwise this call does nothing.
        Dependencies.register(this);

        // Return the current value
        return this.value;
    }
}

/**
 * Shortcut function to create a {@link ComputedValue}.
 *
 * @param compute - The compute function.
 * @returns The created {@link ComputedValue}.
 */
export function computed<T>(compute: () => T): ComputedValue<T> {
    return new ComputedValue(compute);
}
