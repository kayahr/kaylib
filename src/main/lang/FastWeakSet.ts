/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * WeakSet implementation with a better performance than the standard WeakSEt provided by browsers. This implementation
 * simply stores a boolean value within a symbol property inside the key object. When key object is garbage-collected
 * then the values are garbage collected, too.
 *
 * This implementation is not fully compatible to the WeakSEt spec as it doesn't validate key types at runtime and
 * instead relies on TypeScript typings during compile time to ensure that keys are always objects. Also note that the
 * created symbol property in the key object may influence other code which iterates over symbol properties with
 * `Object.getPropertyDescriptors()` or `Object.getPropertySymbols()`. If this bothers you, use the standard WeakSet.
 */
export class FastWeakSet<T extends object> implements WeakSet<T> {
    /** The property used by this weak set to store values inside the key object. */
    private readonly property = Symbol("fastWeakSetProperty");

    /** Used in the creation of the default string description of an object. */
    public readonly [Symbol.toStringTag]: string = "FastWeakSet";

    /**
     * Creates a weak set that stores weakly held objects.
     *
     * @param iterable - Optional iterable object from which each value will be added to the new weak set.
     */
    public constructor(iterator?: Iterable<T>) {
        if (iterator != null) {
            for (const value of iterator) {
                this.add(value);
            }
        }
    }

    /**
     * Removes the specified value from the weak set.
     *
     * @param value - The value to remove from the weak set.
     * @return True if value has been removed successfully. False if the value was not found.
     */
    public delete(value: T): boolean {
        if ((value as Record<symbol, unknown>)[this.property] !== undefined) {
            delete (value as Record<symbol, unknown>)[this.property];
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns a boolean indicating whether the specified value exists in the weak set or not.
     *
     * @param value - The value to check for existence in the weak set.
     * @return True if specified value exists in the weak set. False otherwise.
     */
    public has(value: T): boolean {
        return (value as Record<symbol, unknown>)[this.property] !== undefined;
    }

    /**
     * Adds a new value to the weak set.
     *
     * @param value - The value to add to the weak set.
     * @return This weak set.
     */
    public add(value: T): this {
        (value as Record<symbol, unknown>)[this.property] = true;
        return this;
    }
}
