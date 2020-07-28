/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/** Function type of the unlock function returned by the lock method. */
export type UnlockMutex = () => void;

/**
 * Mutex which can be used to synchronize asynchronous operations.
 */
export class Mutex {
    private locked: Promise<void> | null = null;

    /**
     * Checks whether mutex is locked or not.
     *
     * @return True if mutex is currently locked, false if not.
     */
    public isLocked(): boolean {
        return this.locked != null;
    }

    /**
     * Locks the mutex. The returned promise is either resolved immediately when mutex wasn't locked before or
     * after the lock has been released from the previous locker and could be acquired for the current locker.
     */
    public lock(): Promise<UnlockMutex> | UnlockMutex {
        if (this.locked == null) {
            // Synchronously lock mutex if possible
            return this.createLock();
        } else {
            // Otherwise wait for mutex getting unlocked and then lock it
            return this.waitAndLock();
        }
    }

    private async waitAndLock(): Promise<UnlockMutex> {
        while (this.locked !== null) {
            await this.locked;
        }
        return this.createLock();
    }

    private createLock(): UnlockMutex {
        let resolveLock: (() => void) | null = null;
        this.locked = new Promise<void>(resolve => { resolveLock = resolve; });
        return () => {
            if (resolveLock != null) {
                this.locked = null;
                resolveLock();
                resolveLock = null;
            }
        };
    }
}
