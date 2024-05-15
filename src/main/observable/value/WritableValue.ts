/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { equals } from "../../util/object";
import { AbstractValue } from "./AbstractValue";
import { ComputeContext } from "./ComputeContext";

export class WritableValue<T = unknown> extends AbstractValue<T> {
    private value: T;

    public constructor(value: T) {
        super();
        this.value = value;
    }

    public get(): T {
        ComputeContext.registerDependency(this);
        return this.value;
    }

    public set(value: T): this {
        if (!equals(value, this.value)) {
            this.value = value;
            this.incrementVersion();
            this.observer?.next(value);
        }
        return this;
    }
}

export function value<T>(v: T): WritableValue<T> {
    return new WritableValue(v);
}
