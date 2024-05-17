/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Value } from "./Value";

export class WritableValue<T = unknown> extends Value<T> {
    public value: T;
    public constructor(value: T) {
        super();
        this.value = value;
    }

    public isValid(): boolean {
        return true;
    }

    public validate(): void {}

    public set(value: T): void {
        if (value !== this.value) {
            this.value = value;
            this.incrementVersion();
            this.observer?.next(value);
        }
    }

    public override get(): T {
        this.registerDependency();
        return this.value;
    }
}

export function writable<T>(v: T): WritableValue<T> {
    return new WritableValue(v);
}
