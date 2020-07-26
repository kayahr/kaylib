/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for objects which can be disabled.
 */
export interface Disableable {
    /**
     * Checks if object is disabled or not.
     *
     * @return True if disabled, false if not.
     */
    isDisabled(): boolean;

    /**
     * Disables the object.
     */
    disable(): void;
}

/**
 * Checks if given object is disableable.
 *
 * @return True if disableable, false if not.
 */
export function isDisableable(object: unknown): object is Disableable {
    return object != null
        && typeof (object as Disableable).isDisabled === "function"
        && typeof (object as Disableable).disable === "function";
}
