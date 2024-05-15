/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { equals } from "../../util/object";
import { AbstractValue } from "./AbstractValue";
import { ComputeContext } from "./ComputeContext";

export type ComputeFunction<T> = () => T;

const NONE = Symbol("None");

export class ComputedValue<T = unknown> extends AbstractValue<T> {
    private readonly compute: ComputeFunction<T>;
    private readonly computeContext = new ComputeContext(() => this.update());
    private value: T | typeof NONE = NONE;

    public constructor(compute: ComputeFunction<T>) {
        super(
            () => {
                this.update();
                this.computeContext.watch();
            },
            () => this.computeContext.unwatch()
        );
        this.compute = compute;
    }

    private update(): void {
        this.get();
    }

    public get(): T {
        let value = this.value;
        if (value === NONE || this.computeContext.isDirty()) {
            value = this.computeContext.runInContext(() => this.compute());
            if (!equals(value, this.value)) {
                this.value = value;
                this.incrementVersion();
                this.observer?.next(value);
            }
        }
        ComputeContext.registerDependency(this);
        return value;
    }
}


export function computed<T>(compute: () => T): ComputedValue<T> {
    return new ComputedValue(compute);
}
