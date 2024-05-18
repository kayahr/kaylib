/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Dependency } from "./Dependency";
import type { Value } from "./Value";

/**
 * Manages the dependencies of a value which has dependencies (like a {@link ComputedValue}.
 */
export class Dependencies implements Iterable<Dependency> {
    /** The active dependencies used to record dependencies when a value is used during a computation. */
    private static active: Dependencies | null = null;

    /** The owner of these dependencies. */
    private readonly owner: Value;

    /** The set of current dependencies. May change when values are used conditionally in a computation. */
    private readonly dependencies = new Set<Dependency>();

    /** Index mapping values to corresponding dependencies. */
    private readonly index = new Map<Value, Dependency>();

    /**
     * Creates a new dependencies container for the given owner value.
     *
     * @param owner - The value owning these dependencies.
     */
    public constructor(owner: Value) {
        this.owner = owner;
    }

    /** @inheritDoc */
    public *[Symbol.iterator](): IterableIterator<Dependency> {
        for (const dependency of this.dependencies) {
            yield dependency;
        }
    }

    /**
     * Starts watching the current dependencies. Whenever one of these dependencies sends a change notification then the getter of the owner is called to
     * update the value and (if value changed) notify its observers.
     */
    public watch(): void {
        for (const dependency of this.dependencies) {
            dependency.watch(() => this.owner.get());
        }
    }

    /**
     * Stops watching the current dependencies.
     */
    public unwatch(): void {
        for (const dependency of this.dependencies) {
            dependency.unwatch();
        }
    }

    /**
     * Checks if the dependencies are valid.
     *
     * @returns True if all dependencies are valid, false if at least one is invalid.
     */
    public isValid(): boolean {
        for (const dependency of this.dependencies) {
            if (!dependency.isValid()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Validates the dependencies.
     *
     * @returns True if at least one of the validated dependencies has updated its value during validation.
     */
    public validate(): boolean {
        let needUpdate = false;
        for (const dependency of this.index.values()) {
            if (dependency.validate()) {
                needUpdate = true;
            }
        }
        return needUpdate;
    }

    /**
     * Registers the given value as dependency.
     *
     * @param value - The value to register as dependency.
     */
    private register(value: Value): void {
        const dependency = this.index.get(value);
        if (dependency == null) {
            const newDependency = new Dependency(value);
            this.dependencies.add(newDependency);
            this.index.set(value, newDependency);
            if (this.owner.isWatched()) {
                newDependency.watch(() => this.owner.get());
            }
        } else {
            dependency.update();
        }
    }

    /**
     * Registers the given value in the active dependencies. When there are no active dependencies then this method does nothing. This must be called at the
     * end of the getter functions of every value implementation.
     *
     * @param value - The value to register as dependency.
     */
    public static register(value: Value): void {
        this.active?.register(value);
    }

    /**
     * Runs the given function and records all values used during this function execution as dependency.
     *
     * @param fn - The function to call.
     * @returns The function result.
     */
    public record<T>(fn: () => T): T {
        const previousDependencies = Dependencies.active;
        Dependencies.active = this;
        try {
            return fn();
        } finally {
            Dependencies.active = previousDependencies;
        }
    }
}
