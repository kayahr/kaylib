/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractValue } from "./AbstractValue";
import { Dependencies } from "./Dependencies";

/**
 * Observable value which can be set manually.
 */
export class WritableValue<T = unknown> extends AbstractValue<T> {
    /** The current value. */
    private value: T;

    /**
     * Creates a new observable writable value.
     *
     * @param value - The initial value.
     */
    public constructor(value: T) {
        super();
        this.value = value;
    }

    /** @inheritDoc */
    public override isValid(): boolean {
        // A writable value has no dependencies so it is always valid
        return true;
    }

    /** @inheritDoc */
    public override validate(): void {
        // A writable value has no dependencies so there is nothing to validate
    }

    /**
     * Sets a new value. When the value is different to the old value then the value version is increased and subscribed observers are notified.
     *
     * @param value - The new value to set.
     */
    public set(value: T): void {
        if (value !== this.value) {
            this.value = value;
            this.incrementVersion();
            this.observer?.next(value);
        }
    }

    /**
     * Updates the value by passing the current value to the given function and setting the new value to the value returned by that function.
     *
     * @param updater - The updater function. Receives the current value and must return the new value.
     */
    public update(updater: (value: T) => T): void {
        this.set(updater(this.value));
    }

    /** @inheritDoc */
    public override get(): T {
        Dependencies.register(this);
        return this.value;
    }
}


/**
 * Shortcut function to create a {@link WritableValue}.
 *
 * @param value - The initial value.
 * @returns The created {@link WritableValue}.
 */
export function writable<T>(v: T): WritableValue<T> {
    return new WritableValue(v);
}
