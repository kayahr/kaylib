/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalStateException } from "../../util/exception";
import type { Unsubscribable } from "../Unsubscribable";
import type { Value } from "./Value";

/**
 * A dependency to a value.
 */
export class Dependency {
    /** The dependency value. */
    private readonly value: Value;

    /**
     * The last seen version of the value. When this number no longer matches the current version of the value
     * then the dependency owner must be updated.
     */
    private version: number;

    /**
     * The record version which was current when the dependency was last used. When this diverges from the record version of the
     * dependency list referencing this dependency then the dependency is no longer used and can be removed.
     */
    private recordVersion = 0;

    /**
     * The active subscription monitoring value changes. Only present when dependency is watched. Null otherwise.
     */
    private subscription: Unsubscribable | null = null;

    /**
     * @param value - The dependency value.
     */
    public constructor(value: Value) {
        this.value = value;
        this.version = value.getVersion();
    }

    /**
     * @returns The dependency value.
     */
    public getValue(): Value {
        return this.value;
    }

    /**
     * Updates the record version to indicate that the dependency is still in use.
     *
     * @param recordVersion - The current record version to set.
     */
    public updateRecordVersion(recordVersion: number): void {
        this.recordVersion = recordVersion;
    }

    /**
     * @returns The last seen record version. When this diverges from the current record version then this dependency is no longer used
     *          and can be removed.
     */
    public getRecordVersion(): number {
        return this.recordVersion;
    }

    /**
     * Checks if the dependency is valid. The dependency is valid when the value itself is valid and the value version matches
     * the last seen version stored in the dependency.
     *
     * @returns True if dependency is valid, false if not.
     */
    public isValid(): boolean {
        return this.value.getVersion() === this.version && this.value.isValid();
    }

    /**
     * Validates the dependency. This validates the value itself and updates the last seen value version if needed.
     *
     * @returns True if value has changed, false if value has not changed.
     */
    public validate(): boolean {
        this.value.validate();
        const valueVersion = this.value.getVersion();
        if (valueVersion !== this.version) {
            this.update();
            return true;
        }
        return false;
    }

    /**
     * Updates the dependency by saving the value version as last seen version.
     */
    public update(): void {
        this.version = this.value.getVersion();
    }

    /**
     * @returns True if dependency is watched, false if not.
     */
    public isWatched(): boolean {
        return this.subscription != null;
    }

    /**
     * Starts watching the dependency. The given function is called when referenced value changes.
     */
    public watch(update: () => void): void {
        if (this.subscription != null) {
            throw new IllegalStateException("Dependency is already watched");
        }
        this.subscription = this.value.subscribe(() => update());
    }

    /**
     * Stops watching the dependency.
     */
    public unwatch(): void {
        if (this.subscription == null) {
            throw new IllegalStateException("Dependency is not watched");
        }
        this.subscription.unsubscribe();
        this.subscription = null;
    }
}
