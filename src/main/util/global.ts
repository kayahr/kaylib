/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalArgumentException } from "./exception";

/**
 * The global scope of the current environment. This is `globalThis` if present, the browsers Window object when
 * present or the Node.js global object. When nothing of all this exists then an empty object is returned as fallback.
 */
const globalScope = globalThis as typeof globalThis & Window & Record<string, unknown>;

export { globalScope as global };

/**
 * Exposes the given value under the given global name.
 *
 * @param name  - The global name. Use dots to separate into namespaces.
 * @param value - The value to expose
 */
export function expose(name: string, value: unknown): void;

/**
 * Exposes the decorated class under the given global name.
 *
 * @param name - The global name. Use dots to separate into namespaces.
 */
export function expose(name: string): ClassDecorator;

export function expose(name: string, value?: unknown): ClassDecorator | void {
    let namespace: Record<string, unknown> = globalScope;
    const namespaceNames = name.split(".");
    const exposeName = namespaceNames.pop();
    if (exposeName == null || exposeName === "") {
        throw new IllegalArgumentException("No expose name specified");
    }
    for (const namespaceName of namespaceNames) {
        if (namespaceName === "") {
            throw new IllegalArgumentException("Namespace is empty");
        }
        let subNamespace = namespace[namespaceName] as Record<string, unknown>;
        if (subNamespace == null) {
            subNamespace = {} as Record<string, unknown>;
            namespace[namespaceName] = subNamespace;
        }
        namespace = subNamespace;
    }
    if (value !== undefined) {
        namespace[exposeName] = value;
    } else {
        return (target: Function): void => {
            namespace[exposeName] = target;
        };
    }
}
