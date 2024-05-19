/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractValue } from "./AbstractValue";
import { Dependencies } from "./Dependencies";

export class WritableValue<T = unknown> extends AbstractValue<T> {
    public value: T;
    public constructor(value: T) {
        super();
        this.value = value;
    }

    /** @inheritDoc */
    public override isValid(): boolean {
        // A writable value has no dependencies so it is always valid
        return true;
    }

    /** @inheritDoc */
    public override validate(): void {
        // A writable value has no dependencies so there is nothing to validate
    }

    public set(value: T): void {
        if (value !== this.value) {
            this.value = value;
            this.incrementVersion();
            this.observer?.next(value);
        }
    }

    public override get(): T {
        Dependencies.register(this);
        return this.value;
    }
}

export function writable<T>(v: T): WritableValue<T> {
    return new WritableValue(v);
}
