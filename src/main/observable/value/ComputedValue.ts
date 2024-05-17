/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Dependency } from "./Dependency";
import { Value } from "./Value";

export class ComputedValue<T = unknown> extends Value<T> {
    public value?: T;
    private readonly dependencies = new Map<Value, Dependency>();
    private watched = false;

    public constructor(public func: () => T) {
        super(
            () => {
                this.get();
                for (const dependency of this.dependencies.values()) {
                    dependency.watch(() => this.get());
                }
                this.watched = true;
            },
            () => {
                for (const dependency of this.dependencies.values()) {
                    dependency.unwatch();
                }
                this.watched = false;
            }
        );
    }

    public override isValid(): boolean {
        for (const dependency of this.dependencies.values()) {
            if (!dependency.isValid()) {
                return false;
            }
        }
        return true;
    }

    public override validate(): void {
        let needUpdate = false;
        for (const dependency of this.dependencies.values()) {
            if (dependency.validate()) {
                needUpdate = true;
            }
        }
        if (needUpdate) {
            const newValue = this.recordDependencies(this.dependencies, this, this.func);
            if (newValue !== this.value) {
                this.value = newValue;
                this.incrementVersion();
                this.observer?.next(newValue);
            }
        }
    }

    public override get(): T {
        if (this.value === undefined) {
            this.value = this.recordDependencies(this.dependencies, this, this.func);
        } else if (!this.isValid()) {
            this.validate();
        }
        this.registerDependency();
        return this.value;
    }

    protected override registerDependency(): Dependency | null {
        const dep = super.registerDependency();
        if (dep != null && this.watched) {
            dep.watch(() => this.get());
        }
        return dep;
    }

    public isWatched(): boolean {
        return this.watched;
    }
}

export function computed<T>(compute: () => T): ComputedValue<T> {
    return new ComputedValue(compute);
}
