/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * WeakMap implementation with a better performance than the standard WeakMap provided by browsers. This implementation
 * simply stores the values within a symbol property inside the key object. When key object is garbage-collected then
 * the values are garbage collected, too.
 *
 * This implementation is not fully compatible to the WeakMap spec as it doesn't validate key types at runtime and
 * instead relies on TypeScript typings during compile time to ensure that keys are always objects. Also note that the
 * created symbol property in the key object may influence other code which iterates over symbol properties with
 * `Object.getPropertyDescriptors()` or `Object.getPropertySymbols()`. If this bothers you, use the standard WeakMap.
 */
export class FastWeakMap<K extends object, V> implements WeakMap<K, V> {
    /** The property used by this weak map to store values inside the key object. */
    private readonly property = Symbol("fastWeakMapProperty");

    /** Used in the creation of the default string description of an object. */
    public readonly [Symbol.toStringTag]: string = "FastWeakMap";

    /**
     * Creates a weak map which is a collection of key/value pairs in which the keys are weakly referenced.
     * The keys must be objects and the values can be arbitrary values.
     *
     * @param iterable - Optional iterable object whose elements are key-value pairs (2-element Arrays). Each
     *                   key-value pair will be added to the new weak map.
     */
    public constructor(iterator?: Iterable<[ K, V ]>) {
        if (iterator != null) {
            for (const [ key, value ] of iterator) {
                this.set(key, value);
            }
        }
    }

    /**
     * Removes the specified element from the weak map.
     *
     * @param key - The key of the element to remove from the weak map.
     * @return True if an element in the weak map has been removed successfully. False if the key is not found.
     */
    public delete(key: K): boolean {
        if ((key as Record<symbol, unknown>)[this.property] !== undefined) {
            delete (key as Record<symbol, unknown>)[this.property];
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns a specified element from the weak map.
     *
     * @param key - The key of the element to return from the weak map.
     * @return The element associated with the specified key in the weak map. If the key can't be found,
     *         undefined is returned.
     */
    public get(key: K): V | undefined {
        return (key as Record<symbol, unknown>)[this.property] as V;
    }

    /**
     * Returns a boolean indicating whether an element with the specified key exists in the weak map or not.
     *
     * @param key - The key of the element to return from the weak map.
     * @return True if an element with the specified key exists in the weak map. False otherwise.
     */
    public has(key: K): boolean {
        return (key as Record<symbol, unknown>)[this.property] !== undefined;
    }

    /**
     * Adds a new element with a specified key and value to the weak map.
     *
     * @param key   - The key of the element to add to the weak map.
     * @param value - The value of the element to add to the weak map.
     * @return This weak map.
     */
    public set(key: K, value: V): this {
        (key as Record<symbol, unknown>)[this.property] = value;
        return this;
    }
}
