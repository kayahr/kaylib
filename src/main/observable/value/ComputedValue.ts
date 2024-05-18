/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ComputeContext } from "./ComputeContext";
import { Value } from "./Value";

const NONE = Symbol("NONE");

export class ComputedValue<T = unknown> extends Value<T> {
    public value: T | typeof NONE = NONE;
    private readonly context: ComputeContext;

    public constructor(public compute: () => T) {
        super(
            () => {
                this.get();
                this.context.watch();
            },
            () => {
                this.context.unwatch();
            }
        );
        this.context = new ComputeContext(this);
    }

    public update(): void {
    }

    /** @inheritDoc */
    public override isValid(): boolean {
        return this.context.isValid();
    }


    /** @inheritDoc */
    public override validate(): void {
        this.context.validate();
    }


    /** @inheritDoc */
    public override get(): T {
        if (this.value === NONE) {
            // This is the first read access of the value so compute it for the first time, without checking for changes
            this.value = this.context.recordDependencies(this.compute);
        } else if (!this.context.isValid()) {
            // When context is invalid then validate it
            if (this.context.validate()) {
                // When context validation came to the conclusion that the computed value must be updated then do it
                const newValue = this.context.recordDependencies(this.compute);
                if (newValue !== this.value) {
                    // When new value does not equal the old one then increment version and inform subscribed observers
                    this.value = newValue;
                    this.incrementVersion();
                    this.observer?.next(newValue);
                }
            }
        }

        // Register this value as dependency in the current compute context. Such a context only exists when getter was
        // called from within a compute function. Otherwise this call does nothing.
        ComputeContext.registerDependency(this);

        // Return the current value
        return this.value;
    }
}


export function computed<T>(compute: () => T): ComputedValue<T> {
    return new ComputedValue(compute);
}
