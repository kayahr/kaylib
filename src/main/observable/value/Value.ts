/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { ObservableLike } from "../ObservableLike";

export interface Value<T = unknown> extends ObservableLike<T> {
    (): T;
    get(): T;
    getVersion(): number;
}
