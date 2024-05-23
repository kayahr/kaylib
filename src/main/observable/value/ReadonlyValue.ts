import { Callable } from "../../lang/Callable";
import type { Observer } from "../Observer";
import type { Subscription } from "../Subscription";
import type { Value } from "./Value";

/**
 * Readonly wrapper for a value.
 */
export class ReadonlyValue<T> extends Callable<[], T> implements Value<T> {
    public constructor(
        private readonly value: Value<T>
    ) {
        super(() => this.get());
    }

    /** @inheritDoc */
    public [Symbol.observable](): Value<T> {
        return this.value;
    }

    /** @inheritDoc */
    public "@@observable"(): Value<T> {
        return this.value;
    }

    /** @inheritDoc */
    public subscribe(...args: [ Observer<T> ] | [ (value: T) => void, ((error: Error) => void)?, (() => void)? ]): Subscription {
        return this.value.subscribe(...args);
    }

    /** @inheritDoc */
    public getVersion(): number {
        return this.value.getVersion();
    }

    /** @inheritDoc */
    public isWatched(): boolean {
        return this.value.isWatched();
    }

    /** @inheritDoc */
    public isValid(): boolean {
        return this.value.isValid();
    }

    /** @inheritDoc */
    public validate(): void {
        this.value.validate();
    }

    /** @inheritDoc */
    public get(): T {
        return this.value.get();
    }
}
