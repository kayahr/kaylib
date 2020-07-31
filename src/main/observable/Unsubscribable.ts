/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Interface for objects which can be unsubscribed.
 */
export interface Unsubscribable {
    /**
     * Cancels the subscription.
     */
    unsubscribe(): void;
}
