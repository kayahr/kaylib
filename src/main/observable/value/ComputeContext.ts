/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalStateException } from "../../util/exception";
import { Dependency } from "./Dependency";
import type { Value } from "./Value";

let currentComputeContext: ComputeContext | null = null;
const computeContextStack: Array<ComputeContext | null> = [];

export class ComputeContext {
    private readonly dependencies = new Map<Value, Dependency>();
    private watched = false;
    private readonly update: () => void;

    public constructor(update: () => void) {
        this.update = update;
    }

    public runInContext<T>(fn: () => T): T {
        computeContextStack.push(currentComputeContext);
        currentComputeContext = this;
        try {
            return fn();
        } finally {
            currentComputeContext = computeContextStack.pop() ?? null;
        }
    }

    public static registerDependency(value: Value): void {
        const context = currentComputeContext;
        if (context == null) {
            return;
        }
        const dependency = context.dependencies.get(value);
        if (dependency == null) {
            const dependency = new Dependency(value);
            context.dependencies.set(value, dependency);
            if (context.watched) {
                dependency.watch(context.update);
            }
        } else {
            dependency.update();
        }
    }

    public isDirty(): boolean {
        for (const dependency of this.dependencies.values()) {
            if (dependency.isDirty()) {
                return true;
            }
        }
        return false;
    }

    public watch(): void {
        if (this.watched) {
            throw new IllegalStateException("Compute context is already watched");
        }
        for (const dependency of this.dependencies.values()) {
            dependency.watch(this.update);
        }
        this.watched = true;
    }

    public unwatch(): void {
        if (!this.watched) {
            throw new IllegalStateException("Compute context is not watched");
        }
        for (const dependency of this.dependencies.values()) {
            dependency.unwatch();
        }
        this.watched = false;
    }
}
