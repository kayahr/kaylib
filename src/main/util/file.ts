/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { isNodeJS, isWindows } from "./runtime";

/**
 * The directory separator character of the operating system. This is a backslash for Windows on Node.js and a slash
 * on any other operating system or in a browser.
 */
export const dirSeparator = isNodeJS() && isWindows() ? "\\" : "/";

/**
 * The path separator character of the operating system. This is a semicolon for Windows on Node.js and a colon on
 * any other operating system or in a browser.
 */
export const pathSeparator = isNodeJS() && isWindows() ? ";" : ":";

/**
 * Normalizes the given path by removing empty and "." components and resolving ".." components.
 *
 * @param path - The path to normalize.
 * @param separator - The directory separator character. Defaults to operating specific directory separator.
 * @return The normalized path.
 */
export function normalizePath(path: string, separator = dirSeparator): string {
    // Remember if original path has leading or trailing slash
    const leadingSlash = path.startsWith(separator);
    const trailingSlash = path.endsWith(separator);

    // Remove empty components and useless "." components
    const components = path.split(separator).filter(component => component !== "" && component !== ".");

    // Resolve ".." components
    for (let i = 0; i < components.length; ++i) {
        if (components[i] === "..") {
            if (leadingSlash && i === 0) {
                components.splice(i--, 1);
            } else if (i > 0 && components[i - 1] !== "..") {
                components.splice(i - 1, 2);
                i -= 2;
            }
        }
    }

    // Add leading slash if original path had one
    if (leadingSlash) {
        if (components.length === 0) {
            components.push("");
        }
        components.unshift("");
    }

    // If there are no components yet then push a "." component
    if (components.length === 0) {
        components.push(".");
    }

    // Add trailing slash if original path had one
    if (trailingSlash && components[components.length - 1] !== "") {
        components.push("");
    }

    // Convert components back into a path again and return it
    return components.join(separator);
}
