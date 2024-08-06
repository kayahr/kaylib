/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

// import { isDirectFunction } from "../../util/function";
import { Dependency } from "./Dependency";
import type { Value } from "./Value";

/** The active dependencies used to record dependencies when a value is used during a computation. */
let activeDependencies: Dependencies | null = null;

/**
 * Manages the dependencies of a value which has dependencies (like a {@link ComputedValue}).
 */
export class Dependencies implements Iterable<Dependency> {
    /** The owner of these dependencies. */
    private readonly owner: Value;

    /** The set of current dependencies. May change when values are used conditionally in a computation. */
    private readonly dependencies = new Set<Dependency>();

    /** Index mapping values to corresponding dependencies. */
    private readonly index = new Map<Value, Dependency>();

    /** Flag indicating that dependencies are currently validating. During validation other validate calls are ignored. */
    private validating = false;

    /**
     * Increased on each recording and set to all found dependencies so after recording we can easily identify and remove dependencies
     * which still have the old record version.
     */
    private recordVersion = 0;

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
        // Call getter once to ensure that dependencies are registered
        this.owner.get();

        // Any change on a dependency must call the getter
        for (const dependency of this.dependencies) {
            dependency.watch(() => untracked(this.owner));
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
        if (!this.validating) {
            this.validating = true;
            try {
                for (const dependency of this.index.values()) {
                    if (dependency.validate()) {
                        needUpdate = true;
                    }
                }
            } finally {
                this.validating = false;
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
        let dependency = this.index.get(value);
        if (dependency == null) {
            // Register new dependency
            dependency = new Dependency(value);
            this.dependencies.add(dependency);
            this.index.set(value, dependency);

            // When owner is watched then start watching this new dependency
            if (this.owner.isWatched()) {
                dependency.watch(() => untracked(this.owner));
            }
        } else {
            // Update existing dependency
            dependency.update();
        }

        // Update the record version to mark the dependency as still-used
        dependency.updateRecordVersion(this.recordVersion);
    }

    /**
     * Registers the given value in the active dependencies. When there are no active dependencies then this method does nothing. This must be called at the
     * end of the getter functions of every value implementation.
     *
     * @param value - The value to register as dependency.
     */
    public static register(value: Value): void {
        activeDependencies?.register(value);
    }

    /**
     * Removes dependencies which are no longer used. This is called right after recording so used the record version of used dependencies must match
     * the current record version. If not then a dependency is out-dated and must be removed and unwatched if necessary.
     */
    private removeUnused(): void {
        for (const [ value, dependency ] of this.index) {
            if (dependency.getRecordVersion() !== this.recordVersion) {
                this.index.delete(value);
                this.dependencies.delete(dependency);
                if (dependency.isWatched()) {
                    dependency.unwatch();
                }
            }
        }
    }

    /**
     * Runs the given function and records all values used during this function execution as dependency.
     *
     * @param fn - The function to call.
     * @returns The function result.
     */
    public record<T>(fn: () => T): T {
        const previousDependencies = activeDependencies;
        activeDependencies = this;
        ++this.recordVersion;
        try {
            return fn();
        } finally {
            activeDependencies = previousDependencies;
            this.removeUnused();
        }
    }
}

/**
 * Helper function to access an observable value or run some function which access observable values without tracking them as dependencies.
 *
 * @param arg - An observable value or a function. When an observable value is given then its current value is returned without tracking it as a dependency.
 *              When a function is given then that function is executed without tracking the referenced values as dependencies.
 * @returns the current value of the given observable value or the function result.
 */
export function untracked<T>(arg: Value<T> | (() => T)): T {
    const previousDependencies = activeDependencies;
    activeDependencies = null;
    try {
        return arg();
    } finally {
        activeDependencies = previousDependencies;
    }
}
