/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Mutex, UnlockMutex } from "../main/Mutex";

describe("Mutex", () => {
    describe("isLocked", () => {
        it("returns true for locked mutex and false of unlocked mutex", async () => {
            const mutex = new Mutex();
            expect(mutex.isLocked()).toBe(false);
            const unlock = mutex.lock();
            expect(mutex.isLocked()).toBe(true);
            (await unlock)();
            expect(mutex.isLocked()).toBe(false);
        });
    });
    describe("lock", () => {
        it("returns synchronously when mutex is not already locked", () => {
            const mutex = new Mutex();
            const unlock = mutex.lock();
            expect(unlock).toBeInstanceOf(Function);
        });
        it("returns asynchronously when mutex is already locked", async () => {
            const mutex = new Mutex();
            const unlock1 = mutex.lock() as UnlockMutex;
            const unlock2 = mutex.lock() as Promise<UnlockMutex>;
            expect(unlock2).toBeInstanceOf(Promise);
            const promise = unlock2.then(unlock => {
                expect(unlock).toBeInstanceOf(Function);
                unlock();
                // Second call must not cause havoc
                unlock();
            });
            unlock1();
            await promise;
            expect(mutex.isLocked()).toBe(false);
        });
    });
});
