/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Observable } from "../observable/Observable";
import { Subscribable } from "../observable/Subscribable";
import { DOMEventWrapperConstructor, isEventTargetProvider } from "../util/events";
import { IllegalArgumentException, IllegalStateException, NotFoundException } from "../util/exception";
import { Connection } from "./Connection";
import { Slot } from "./Slot";

/**
 * Special type to convert signal values (Which can be more than one) to a single observable value (Because
 * observables only support one value). If only one signal value is used then this value is also the observable
 * value. If multiple signal values are used then the observable value is an array with the signal values.
 */
export type ObservableSignalValue<T extends unknown[]> = T[1] extends undefined ? T[0] : T;

/**
 * Type of a signal.
 *
 * @param T - The signal argument types defined as an array. For example `[ string, number ]` defines a signal with
 *            two arguments, first is a `string` and second is a `number`. When not specified or an empty array is
 *            specified then the signal has no arguments.
 */
export interface Signal<T extends unknown[] = []> {
    /**
     * Emits the signal with the given arguments.
     */
    (...args: T): void;

    /**
     * Connects the given slot to this signal.
     *
     * @param slot     - The slot function to connect.
     * @param receiver - Optional receiver object.
     * @return Connection object containing references to the signal and slot and which also provides methods to
     *         disconnect the signal or check if slot is still connected to the signal.
     */
    connect(slot: Slot<T>, receiver?: object | null): Connection<T>;

    /**
     * Disconnects the given slot from this signal.
     *
     * @param slot     - The slot function to disconnect.
     * @param receiver - Optional receiver object.
     */
    disconnect(slot: Slot<T>, receiver?: object | null): void;

    /**
     * Checks if the given slot is connected to this signal.
     *
     * @param slot     - The slot function to check. If not specified then this method checks if there is any slot
     *                   connected to the signal.
     * @param receiver - Optional receiver object.
     * @return True if connected to signal, false if not.
     */
    isConnected(slot?: Slot<T>, receiver?: object | null): boolean;

    /**
     * Disconnects all slots from this signal.
     */
    disconnectAll(): void;

    /**
     * Returns an observable which observes this signal.
     *
     * @return The created observable.
     */
    asObservable(): Subscribable<ObservableSignalValue<T>>;

    /**
     * Returns an observable which observes this signal.
     *
     * @return The created observable.
     */
    [Symbol.observable](): Subscribable<ObservableSignalValue<T>>;

    /**
     * Returns an observable which observes this signal.
     *
     * @return The created observable.
     */
    "@@observable"(): Subscribable<ObservableSignalValue<T>>;
}

/**
 * Type of a signal finalizer which is a connection object, a simple finalizer function without arguments returning
 * nothing or is simply not present (void).
 */
export type SignalFinalizer<T extends unknown[] = any> = Connection<T> | (() => void) | void;

/**
 * Type of a signal initializer which is a function with the signal to initialize as only argument and which returns
 * an optional signal finalizer.
 *
 * @param T - The signal arguments type.
 */
export type SignalInitializer<T extends unknown[] = []> = (signal: Signal<T>) => SignalFinalizer;

/**
 * Type for signal options passed to the [[createSignal]] function or [[signal]] decorator.
 *
 * @param T - The signal arguments type.
 */
export type SignalOptions<T extends unknown[] = []> = {
    /**
     * Optional signal name used in error messages for example. The [[signal]] decorator can automatically create
     * this name by using the constructor name of the sender type and the signal property name. But when using the
     * [[createSignal]] function directly then no name can automatically be determined.
     */
    name?: string;

    /**
     * Optional signal initializer. Called when first slot is connected to the signal. The initializer can return
     * an optional signal finalizer function which is called when last slot has been disconnected from the signal.
     */
    init?: SignalInitializer<T>;

    /**
     * Optional name of a DOM event the signal should listen on. When set then the target type of the
     * decorated property must implement the [[EventTargetProvider]] interface.
     */
    domEvent?: string;

    /**
     * Optional wrapper type. Only makes sense when [[domEvent]] is specified, too. When set then the DOM event is
     * wrapped by this wrapper type before emitting.
     */
    wrapper?: DOMEventWrapperConstructor<any, any>;
};

/**
 * This map is internally used to create unique bindings between slot functions and receiver objects so the same
 * binding is returned for the same function and receiver object.
 */
const slotBindings = new WeakMap<Function, WeakMap<object, Function>>();

/**
 * Binds the given slot function to the given optional receiver and returns the bound function. The same bound function
 * is returned for same pairs of slot functions and receiver objects. If receiver object is not set then the slot
 * function is already unique and is returned unbound.
 *
 * @param slot     - The slot function to bind.
 * @param receiver - Optional receiver object.
 * @return The bound slot. When no receiver was specified then no binding is performed and slot function is returned
 *         directly.
 */
function bindSlot<T extends Function>(slot: T, receiver: object | null = null): T {
    // When no receiver is specified then directly return slot function because no binding is needed.
    if (receiver == null) {
        return slot;
    }

    // Get (or create) the bound slots for the slot function
    let boundSlots = slotBindings.get(slot);
    if (boundSlots == null) {
        boundSlots = new WeakMap<object, T>();
        slotBindings.set(slot, boundSlots);
    }

    // Get (or create) the bound slot for the receiver
    let boundSlot = boundSlots.get(receiver) as T;
    if (boundSlot == null) {
        boundSlot = slot.bind(receiver) as T;
        boundSlots.set(receiver, boundSlot);

        // Sets the name property for nicer error messages
        Object.defineProperty(boundSlot, "name", {
            configurable: false,
            writable: false,
            enumerable: true,
            value: `${receiver.constructor.name}.${slot.name}`
        });
    }

    // Return the bound slot
    return boundSlot;
}

/**
 * Creates and returns a new signal.
 *
 * @param options - Optional signal options.
 * @param context - Optional this-context to use for executing initialization and finalization callbacks.
 * @param <T>     - The signal argument types defined as an array. For example `[ string, number ]` defines a signal
 *                  with two arguments, first is a `string` and second is a `number`. When not specified or an empty
 *                  array is specified then the signal has no arguments.
 * @return The created signal.
 */
export function createSignal<T extends unknown[] = []>(options?: SignalOptions<T>, context?: object): Signal<T> {
    let finalizer: SignalFinalizer;
    let initialized = false;
    function finalize(): void {
        if (finalizer != null) {
            if (finalizer instanceof Function) {
                finalizer.call(context);
            } else {
                finalizer.disconnect();
            }
            finalizer = undefined;
            initialized = false;
        }
    }
    const slots = new Set<Slot<T>>();
    const signal = function(...args: unknown[]): void {
        for (const slot of slots) {
            slot(...args as T);
        }
    };
    Object.defineProperty(signal, "name", {
        configurable: false,
        writable: false,
        enumerable: true,
        value: (options != null ? options.name : null) ?? "<unnamed>"
    });
    return Object.assign(bindSlot(signal, null), {
        connect(this: Signal<T>, slot: Slot<T>, receiver: object | null = null): Connection<T> {
            const boundSlot = bindSlot(slot, receiver);
            if (slots.has(boundSlot)) {
                throw new IllegalStateException(
                    `Slot '${boundSlot.name}' is already connected to signal '${this.name}'`);
            }
            slots.add(boundSlot);
            if (!initialized) {
                initialized = true;
                if (options != null) {
                    const domEvent = options.domEvent;
                    const wrapper = options.wrapper;
                    const init = options.init;
                    if (init != null) {
                        finalizer = init.call(context, this);
                    } else if (domEvent != null) {
                        if (!isEventTargetProvider(context)) {
                            throw new IllegalArgumentException(
                                "For DOM events the signal sender must be an event target provider");
                        }
                        const eventTarget = context.getEventTarget();
                        const listener = (event: Event): void => {
                            signal(wrapper != null ? new wrapper(event, context, eventTarget) : event);
                        };
                        eventTarget.addEventListener(domEvent, listener);
                        finalizer = () => {
                            eventTarget.removeEventListener(domEvent, listener);
                        };
                    }
                }
            }
            return new Connection(this, boundSlot);
        },

        disconnect(this: Signal<T>, slot: Slot<T>, receiver: object | null = null): void {
            const boundSlot = bindSlot(slot, receiver);
            if (!slots.has(boundSlot)) {
                throw new NotFoundException(`Signal '${this.name}' is not connected to slot '${boundSlot.name}'`);
            }
            slots.delete(boundSlot);
            if (slots.size === 0) {
                finalize();
            }
        },

        isConnected(this: Signal<T>, slot?: Slot<T>, receiver: object | null = null): boolean {
            if (slot != null) {
                const boundSlot = bindSlot(slot, receiver);
                return slots.has(boundSlot);
            } else {
                return slots.size > 0;
            }
        },

        disconnectAll(): void {
            slots.clear();
            finalize();
        },

        asObservable<R extends ObservableSignalValue<T>>(this: Signal<T>): Subscribable<R> {
            return new Observable(observer => {
                const connection = this.connect((...values) => {
                    observer.next((values.length === 1 ? values[0] : values) as R);
                });
                return (): void => {
                    connection.disconnect();
                };
            });
        },

        [Symbol.observable](this: Signal<T>): Subscribable<ObservableSignalValue<T>> {
            return this.asObservable();
        },

        "@@observable"(this: Signal<T>): Subscribable<ObservableSignalValue<T>> {
            return this.asObservable();
        }
    });
}

/**
 * Parameter-less decorator for signals. The decorated property must have the [[Signal]] type but must not be
 * initialized. The decorator initializes the signal on-demand.
 */
export function signal(target: object, name: string): void;

/**
 * Parameterized decorator for signals. The decorated property must have the [[Signal]] type but must not be
 * initialized. The decorator initializes the signal on-demand.
 *
 * @param options - Optional signal options.
 */
export function signal(options: SignalOptions<any>): (target: object, name: string) => void;

export function signal(arg1?: object | SignalOptions, arg2?: string):
        ((target: object, name: string) => void) | void {
    const options = arg2 != null ? {} : arg1 as SignalOptions;
    function decorator(target: object, name: string): void {
        if (options.name === "") {
            options.name = `${target.constructor.name}.${name}`;
        }
        Object.defineProperty(target, name, {
            configurable: false,
            enumerable: true,
            get(this: object): Signal {
                const signal = createSignal(options, this);
                Object.defineProperty(this, name, {
                    configurable: false,
                    writable: false,
                    enumerable: true,
                    value: signal
                });
                return signal;
            }
        });
    }
    if (arg2 != null) {
        decorator(arg1 as object, arg2);
        return void undefined;
    } else {
        return decorator;
    }
}
