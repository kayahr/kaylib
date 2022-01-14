/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Signal } from "./Signal";
import { Slot } from "./Slot";

/**
 * Connection object which is a container for a signal/slot pair.
 *
 * @param T - The signal arguments type.
 */
export class Connection<T extends unknown[] = []> {
    /**
     * @param signal - The signal.
     * @param slot   - The slot connected to the signal.
     */
    public constructor(
        private readonly signal: Signal<T>,
        private readonly slot: Slot<T>
    ) {}

    /**
     * Returns the signal.
     *
     * @return The signal.
     */
    public getSignal(): Signal<T> {
        return this.signal;
    }

    /**
     * Returns the slot connected to the signal.
     *
     * @return The slot connected to the signal.
     */
    public getSlot(): Slot<T> {
        return this.slot;
    }

    /**
     * Disconnects this connection.
     */
    public disconnect(): void {
        this.signal.disconnect(this.slot);
    }

    /**
     * Checks if this connection is still connected.
     */
    public isConnected(): boolean {
        return this.signal.isConnected(this.slot);
    }
}
