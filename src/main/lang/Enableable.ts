/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for objects which can be enabled.
 */
export interface Enableable {
    /**
     * Checks if object is enabled or not.
     *
     * @return True if enabled, false if not.
     */
    isEnabled(): boolean;

    /**
     * Enables the object.
     */
    enable(): void;
}

/**
 * Checks if given object is enableable.
 *
 * @return True if enableable, false if not.
 */
export function isEnableable(object: unknown): object is Enableable {
    return object != null
        && typeof (object as Enableable).isEnabled === "function"
        && typeof (object as Enableable).enable === "function";
}
