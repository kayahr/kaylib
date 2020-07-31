/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/** The available time APIs. */
enum TimeAPI {
    /** Performance API in modern browsers. */
    PERFORMANCE,

    /** High-resolution timer of Node.js process. */
    HRTIME,

    /** Falling back to Date object. */
    DATE
}

/** Determine the clock type applicable for local system. */
const timeAPI: TimeAPI
    = typeof performance !== "undefined" && performance.now != null ? TimeAPI.PERFORMANCE
    : typeof process !== "undefined" && process.hrtime != null ? TimeAPI.HRTIME
    : TimeAPI.DATE;

/**
 * Calculate delta between the normal time and the high resolution time. This delta is needed because the high
 * resolution timers do not contain the real time and this delta must be added to it to get the real time.
 */
const timeDelta = Date.now() - getHighResTime();

/**
 * Returns the current high resolution timestamp in milliseconds.
 *
 * @return The high resolution timestamp in milliseconds.
 */
export function getHRTime(): number {
    return getHighResTime() + timeDelta;
}

/**
 * Returns the internal high resolution time in milliseconds relative to an arbitrary time in the past and not
 * necessarily related to the current time of day.
 *
 * @return The internal high resolution time.
 */
function getHighResTime(): number {
    switch (timeAPI) {
        case TimeAPI.PERFORMANCE: {
            return performance.now();
        }
        case TimeAPI.HRTIME: {
            const hrtime = process.hrtime();
            return hrtime[0] * 1000 + hrtime[1] / 1000000;
        }
        default: {
            return Date.now();
        }
    }
}

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
