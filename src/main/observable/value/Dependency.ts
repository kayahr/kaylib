/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalStateException } from "../../util/exception";
import type { Unsubscribable } from "../Unsubscribable";
import type { Value } from "./Value";

export class Dependency {
    private readonly value: Value;
    private dependencyVersion = 0;
    private valueVersion: number;
    private subscription: Unsubscribable | null = null;

    public constructor(value: Value) {
        this.value = value;
        this.valueVersion = value.getVersion();
    }

    public getValue(): Value {
        return this.value;
    }

    public use(dependencyVersion: number): void {
        this.dependencyVersion = dependencyVersion;
    }

    public getDependencyVersion(): number {
        return this.dependencyVersion;
    }

    public isValid(): boolean {
        return this.value.getVersion() === this.valueVersion && this.value.isValid();
    }

    public validate(): boolean {
        this.value.validate();
        const valueVersion = this.value.getVersion();
        if (valueVersion !== this.valueVersion) {
            this.update();
            return true;
        }
        return false;
    }

    public update(): void {
        this.valueVersion = this.value.getVersion();
    }

    public isWatched(): boolean {
        return this.subscription != null;
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
