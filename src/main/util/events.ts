/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Observable } from "../observable/Observable";
import { SubscriberFunction } from "../observable/SubscriberFunction";
import { IllegalStateException } from "./exception";

/** Map with registered event controllers. */
const eventControllers = new WeakMap<object, WeakMap<Observable<any>, EventController<any>>>();

/** This type describes a factory function which returns the event controller for the given observable. */
export type EventControllers = <T>(observable: Observable<T>) => EventController<T>;

/** Event controller interface. */
export interface EventController<T> {
    /**
     * Emits event without argument.
     */
    emit(this: EventController<void>): void;

    /**
     * Emits event with the given argument.
     *
     * @param value - The event argument.
     */
    emit(value: T): void;

    /**
     * Completes the event. This should be called when the event is no longer needed because component has been
     * disposed for example.
     */
    complete(): void;
}

/**
 * Creates an event controllers factory function and returns it.
 */
export function createEventControllers(): EventControllers {
    return function<T>(this: object, observable: Observable<T>): EventController<any> {
        const controllers = eventControllers.get(this);
        if (controllers != null) {
            const controller = controllers.get(observable);
            if (controller != null) {
                return controller;
            }
        }
        throw new IllegalStateException("Event controller not found");
    };
}

/**
 * Interface for objects providing an event target.
 *
 * @return The event target.
 */
export interface EventTargetProvider {
    getEventTarget(): EventTarget;
}

/**
 * Checks if given object is an event target provider.
 *
 * @param object - The object to check.
 * @return True if object is event target provider, false if not.
 */
export function isEventTargetProvider(object: unknown): object is EventTargetProvider {
    return object != null && typeof (object as EventTargetProvider).getEventTarget === "function";
}

/**
 * Checks if given object is an event target.
 *
 * @param object - The object to check.
 * @return True if object is event target, false if not.
 */
export function isEventTarget(object: unknown): object is EventTarget {
    return object != null && typeof (object as EventTarget).addEventListener === "function"
        && typeof (object as EventTarget).removeEventListener === "function"
        && typeof (object as EventTarget).dispatchEvent === "function";
}

/**
 * Interface for the constructor of [[DOMEventWrapper]] implementations.
 */
export type DOMEventWrapperConstructor<E extends Event = Event, T extends object = object, R extends DOMEventWrapper<E>
    = DOMEventWrapper<E>> = new(originalEvent: E, target: T, eventTarget: EventTarget) => R;

/**
 * Interface for event types which wrap a DOM event.
 */
export interface DOMEventWrapper<E extends Event = Event> {
    getDOMEvent(): E;
}

/**
 * The optional event decorator arguments
 */
export type EventDecoratorArgs = {
    /**
     * Optional name of a DOM event the event should be connected to. When set then the target type of the
     * decorated property must be an event target or must implement the [[EventTargetProvider]] interface.
     */
    domEvent?: string;

    /**
     * Optional wrapper type. Only makes sense when [[domEvent]] is specified, too. When set then the DOM event is
     * wrapped by this wrapper type before emitting.
     */
    wrapper?: DOMEventWrapperConstructor<any, any>;

    /**
     * Optional event initializer function called when first subscriber is called. Cannot be used together with
     * [[domEvent]] property. You can also define a method here by referencing the function on the prototype. This
     * function is automatically called within the current class instance context.
     */
    init?: SubscriberFunction<any>;
};
