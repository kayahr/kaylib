/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { ObservableLike } from "../ObservableLike";

/**
 * Interface for an observable value.
 */
export interface Value<T = unknown> extends ObservableLike<T>  {
    /**
     * @returns The value.
     */
    (): T;

    /**
     * @returns The current value version.
     */
    getVersion(): number;

    /**
     * @returns True if value is valid, false if it must be re-validated.
     */
    isValid(): boolean;

    /**
     * Validates the value.
     */
    validate(): void;

    /**
     * @returns True if value is watched/observed (Observer is subscribed), false if not.
     */
    isWatched(): boolean;

    /**
     * @returns The value.
     */
    get(): T;
}
