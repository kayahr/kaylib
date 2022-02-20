/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Sleeps the specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep. Defaults to 0 which sleeps as short as possible.
 */
export async function sleep(ms: number = 0): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms);
    });
}
