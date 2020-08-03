/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/** Cached result of [[isLittleEndian]] function */
let littleEndian: boolean | null = null;

/**
 * Checks if runtime is little endian.
 *
 * @return True if little endian, false if not.
 */
export function isLittleEndian(): boolean {
    return littleEndian ?? (littleEndian = new Uint16Array(new Uint8Array([ 0x12, 0x34 ]).buffer)[0] === 0x3412);
}

/**
 * Returns true if current runtime is a browser main window. False if other runtime like NodeJS or a web worker.
 *
 * @return True if browser, false if not.
 */
export function isBrowser(): boolean {
    return typeof Window !== "undefined" && typeof window !== "undefined" && window instanceof Window;
}

/**
 * Returns true if current runtime is NodeJS.
 *
 * @return True if NodeJS, false if not.
 */
export function isNodeJS(): boolean {
    return typeof process !== "undefined" && typeof process.versions !== "undefined"
        && typeof process.versions.node === "string";
}

/**
 * Checks if current runtime is Windows.
 *
 * @return True if windows, false if not.
 */
export function isWindows(): boolean {
    return typeof process !== "undefined" && process.platform === "win32";
}
