/*
 * Copyright (C) 2017 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalArgumentException } from "./exception";
import { getHRTime } from "./time";

/** The gregorian calendar offset used for time based UUID. */
const GREGORIAN_OFFSET = Date.UTC(1582, 9, 15);

/**
 * Remembered last generated timestamp for time-based UUID. If this timestamp (or an older one) is seen again then
 * the clock sequence must be incremented to prevent generation of equal UUIDs.
 */
let lastTimestamp = 0;

/**
 * This sequence is incremented when equal timestamps are generated which can happen when timer resolution is too
 * low and UUIDs are generated in the same millisecond for example. This is automatically detected and the clock
 * sequence is incremented to prevent generation of equal UUIDs. The clock sequence is reset to 0 when it exceeds
 * the max value of 0x3fff.
 */
let clockSequence = 0;

/**
 * Creates a random UUID and returns it. Note that there is no guarantee that the returned UUID is unique but it is
 * extremely unlikely that it is not.
 *
 * @return The created random UUID.
 */
export function createRandomUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

/**
 * Creates a time based UUID and returns it. It is guaranteed that this function returns a unique ID for the current
 * machine as long as the clock of the machine is not adjusted back in time. If you need globally unique IDs then you
 * must pass a unique mac address in form of a typed array with six bytes.
 *
 * @param mac - Optional mac address (six bytes) to make the UUID globally unique. If not set then a random mac address
 *              is generated.
 * @return The created time-based UUID.
 */
export function createTimeUUID(mac?: Uint8Array): string {
    // Create timestamp based on Gregorian calendar adoption date and converted to 100-nanosecond intervals
    const timestamp = Math.round((getHRTime() - GREGORIAN_OFFSET) * 10000);

    // Check for timestamp collision and increment clock sequence to fix it
    if (timestamp <= lastTimestamp) {
        clockSequence++;
        if (clockSequence > 0x3fff) {
            clockSequence = 0;
        }
    }
    lastTimestamp = timestamp;

    // Convert timestamp to a hex string with 15 characters length
    let nowHex = timestamp.toString(16);
    while (nowHex.length < 15) {
        nowHex = "0" + nowHex;
    }

    // Fetch high, mid and low UUID parts from hex timestamp
    const high = nowHex.substr(0, 3);
    const mid = nowHex.substr(3, 4);
    const low = nowHex.substr(7, 8);

    // Create sequence UUID part
    const seq = (0x8000 | clockSequence).toString(16);

    // Build the time part of the UUID
    const time = `${low}-${mid}-1${high}-${seq}`;

    // Finalize the UUID by adding the mac address (or random numbers) and then return it
    if (mac) {
        if (mac.length !== 6) {
            throw new IllegalArgumentException("Mac address must contain six bytes");
        }
        const macStr = mac.reduce((result, byte) => result + (byte >> 4).toString(16) + (byte & 15).toString(16), "");
        return `${time}-${macStr}`;
    } else {
        const random = "xyxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = Math.random() * 16 | (c === "x" ? 0 : 1);
            return r.toString(16);
        });
        return `${time}-${random}`;
    }
}
