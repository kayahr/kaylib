/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Callable } from "../lang/Callable";
import { Observable } from "../observable/Observable";
import { Subscribable } from "../observable/Subscribable";
import { Exception } from "../util/exception";
import { bind } from "../util/function";

/**
 * Special type to convert signal values (Which can be more than one) to a single observable value (Because
 * observables only support one value). If only one signal value is used then this value is also the observable
 * value. If multiple signal values are used then the observable value is an array with the signal values.
 *
 * @param T - The signal arguments type.
 */
export type ObservableSignalValue<T extends unknown[]> = T[1] extends undefined ? T[0] : T;

/**
 * Type of a signal finalizer which is simply a function or nothing (void).
 */
export type SignalFinalizer = (() => void) | void;

/**
 * Type of a signal initializer which is a function with the signal to initialize as only argument and which returns
 * an optional signal finalizer.
 *
 * @param T - The signal arguments type.
 */
export type SignalInitializer<T extends unknown[] = []> = (signal: Signal<T>) => SignalFinalizer;

/** Exception thrown when something goes wrong when connecting/disconnecting signals. */
export class SignalException extends Exception {}

/**
 * Type of a slot function which is simply any kind of function which arguments must match the signals arguments.
 *
 * @param T - The slot arguments type.
 */
export type SlotFunction<T extends unknown[] = unknown[]> = (...args: T) => unknown;

/** Type of a slot receiver to which a slot function is bound */
export type SlotReceiver = object;

/**
 * Returns the name of a slot which can be used in error messages.
 *
 * @param slotFunction - The slot function.
 * @param slotReceiver - Optional slot receiver.
 * @return The slot name.
 */
function slotName(slotFunction: SlotFunction<any>, slotReceiver?: SlotReceiver): string {
    let funcName = slotFunction.name;
    if (funcName === "") {
         funcName = "<anonymous>";
    }
    if (slotReceiver == null) {
        return funcName;
    }
    const className = slotReceiver.constructor.name;
    return className + "::" + funcName;
}

/**
 * A signal is a special type of function to which slots can be connected. These slots are then called whenever the
 * signal is called. Signals can have any number and type of arguments. Only slots matching this argument signature can
 * be connected to the signal.
 *
 * @param T - The signal arguments type.
 */
export class Signal<T extends unknown[] = []> extends Callable<T, void> {
    /** Array with slots connected to this signal. */
    private slots: Array<SlotFunction<T> | null> = [];

    /** The number of connected slots. */
    private slotCounter: number = 0;

    /** Optional signal initializer to call when first slot is connected. */
    private readonly initializer: SignalInitializer<T> | null;

    /** Optional signal finalizer to call when last slot is disconnected. */
    private finalizer: SignalFinalizer | null = null;

    /**
     * Creates a new signal.
     */
    public constructor(initializer: SignalInitializer<T> | null = null) {
        super((...args) => this.emit(args));
        this.initializer = initializer;
    }

    public get [Symbol.toStringTag](): string {
        return "Signal";
    }

    /**
     * Emits the signal with the given arguments.
     *
     * @parma args - The signal arguments as an array.
     */
    private emit(args: T): void {
        const slots = this.slots;
        for (let i = 0, len = slots.length; i < len; i++) {
            const slot = slots[i];
            if (slot == null) {
                slots.splice(i, 1);
                i--;
                len--;
            } else {
                slot(...args);
            }
        }
    }

    /**
     * Connects this signal to the slot build from the given slot function and optional receiver.
     *
     * @param slotFunction - The slot function to connect to the signal.
     * @param slotReceiver - Optional slot receiver. Needed if slot function is a method. If no receiver is
     *                       specified then the slot function is connected as an unbound function.
     * @return The created connection.
     * @throws SignalException - If slot is already connected.
     */
    public connect(slotFunction: SlotFunction<T>, slotReceiver?: SlotReceiver): void {
        const slot = slotReceiver == null ? slotFunction : bind(slotFunction, slotReceiver);
        if (this.slots.includes(slot)) {
            throw new SignalException(`Slot '${slotName(slotFunction, slotReceiver)}' is already connected`);
        }

        // Run initializer (if present) before first slot is connected
        if (this.slotCounter === 0 && this.initializer != null) {
            this.finalizer = this.initializer(this);
        }

        this.slots.push(slot);
        this.slotCounter++;
    }

    /**
     * Disconnects all slots from this signal. Does nothing if there are no slots to disconnect.
     */
    public disconnect(): void;

    /**
     * Disconnects the slot build from the given slot function and optional receiver from this signal.
     *
     * @param slotFunction - The slot function to disconnect from the signal.
     * @param slotReceiver - Optional slot receiver. Needed if slot function is a method. If no receiver is
     *                       specified then the slot function is disconnected as an unbound function.
     * @throws SignalException - If slot is not connected.
     */
    public disconnect(slotFunction: SlotFunction<T>, slotReceiver?: SlotReceiver): void;

    public disconnect(slotFunction?: SlotFunction<T>, slotReceiver?: SlotReceiver): void {
        if (slotFunction == null) {
            if (this.slotCounter > 0) {
                this.slots = [];
                this.slotCounter = 0;
            }
        } else {
            const slot = slotReceiver == null ? slotFunction : bind(slotFunction, slotReceiver);
            const index = this.slots.indexOf(slot);
            if (index === -1) {
                throw new SignalException(`Slot '${slotName(slotFunction, slotReceiver)}' is not connected`);
            }
            // Disconnecting only sets the slot to null so the for loop in [[emit]] is not affected. The actual
            // slot removal is done in [[emit]] when the for loop encounters a nulled slot.
            this.slots[index] = null;
            this.slotCounter--;
        }

        // Run finalizer (if present) when last slot has been disconnected
        if (this.slotCounter === 0) {
            if (this.finalizer != null) {
                this.finalizer();
            }
            this.finalizer = null;
        }
    }

    /**
     * Checks if this signal is connected to at least one slot.
     *
     * @return True if signal is connected, false if there are no connected slots.
     */
    public isConnected(): boolean;

    /**
     * Checks if the slot build from the given slot function and optional receiver is connected to this signal.
     *
     * @param slotFunction - The slot function to check for connection.
     * @param slotReceiver - Optional slot receiver. Needed if slot function is a method. If no receiver is
     *                       specified then the slot function to check is considered to be an unbound function.
     * @return True if slot is connected to this signal, false if not.
     */
    public isConnected(slotFunction: SlotFunction<T>, slotReceiver?: SlotReceiver): boolean;

    public isConnected(slotFunction?: SlotFunction<T>, slotReceiver?: SlotReceiver): boolean {
        if (slotFunction == null) {
            return this.slotCounter > 0;
        } else {
            if (slotReceiver != null) {
                slotFunction = bind(slotFunction, slotReceiver);
            }
            return this.slots.indexOf(slotFunction) >= 0;
        }
    }

    /**
     * Returns an observable connected to this signal.
     *
     * @Return A new observable.
     */
    public asObservable<R extends ObservableSignalValue<T>>(this: Signal<T>): Subscribable<R> {
        return new Observable(subscriber => {
            const slot = (...values: unknown[]): void => {
                subscriber.next((values.length === 1 ? values[0] : values) as R);
            };
            this.connect(slot);
            return (): void => {
                this.disconnect(slot);
            };
        });
    }

    public [Symbol.observable](this: Signal<T>): Subscribable<ObservableSignalValue<T>> {
        return this.asObservable();
    }

    public "@@observable"(this: Signal<T>): Subscribable<ObservableSignalValue<T>> {
        return this.asObservable();
    }
}
