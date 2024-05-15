/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalStateException } from "../../util/exception";
import type { Unsubscribable } from "../Unsubscribable";
import type { Value } from "./Value";

export class Dependency {
    private readonly value: Value;
    private version: number;
    private subscription: Unsubscribable | null = null;

    public constructor(value: Value) {
        this.value = value;
        this.version = value.getVersion();
    }

    public isDirty(): boolean {
        return this.value.getVersion() !== this.version;
    }

    public update(): void {
        this.version = this.value.getVersion();
    }

    public watch(update: () => void): void {
        if (this.subscription != null) {
            throw new IllegalStateException("Dependency is already watched");
        }
        this.subscription = this.value.subscribe({ next: () => update() });
    }

    public unwatch(): void {
        if (this.subscription == null) {
            throw new IllegalStateException("Dependency is not watched");
        }
        this.subscription.unsubscribe();
        this.subscription = null;
    }
}
