/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * The global scope of the current environment. This `globalThis` if present, the browsers Window object when
 * present or the Node.js global object. When nothing of all this exists then an empty object is returned as fallback.
 */
const globalScope = <NodeJS.Global & Window & Record<string, unknown>>(
    typeof globalThis !== "undefined" ? globalThis :
    typeof window !== "undefined" ? window :
    typeof global !== "undefined" ? global :
    {}
);

export { globalScope as global };
