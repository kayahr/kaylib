/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Dependencies } from "./Dependencies";
import { Value } from "./Value";

const NONE = Symbol("NONE");

export class ComputedValue<T = unknown> extends Value<T> {
    private readonly dependencies = new Dependencies(this);
    public value: T | typeof NONE = NONE;

    public constructor(public compute: () => T) {
        super(
            () => {
                this.get();
                this.dependencies.watch();
            },
            () => {
                this.dependencies.unwatch();
            }
        );
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


export function computed<T>(compute: () => T): ComputedValue<T> {
    return new ComputedValue(compute);
}
