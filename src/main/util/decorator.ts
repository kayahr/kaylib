/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Creates and returns a new method decorator which can optionally be configured with decorator options.
 *
 * @param T - The class type.
 * @param K - The method name/symbol.
 * @param D - The method descriptor.
 * @param O - The decorator options.
 * @return The created decorator.
 */
export function createMethodDecorator<
    T extends object = object,
    K extends string | symbol = string | symbol,
    D extends TypedPropertyDescriptor<any> = TypedPropertyDescriptor<any>,
    O extends object = never
>(
    callback: (target: T, key: K, descriptor: D, options: O) => D | void
): (...args: [ O ] | [ T, K, D]) => ((target: T, propertyKey: K, descriptor: D) => D | void) & (D | void) {
    return function(...args: [ O ] | [ T, K, D ]): ((target: T, propertyKey: K, descriptor: D) => D | void) & D {
        const options = <O>(args[1] != null ? {} : args[0]);
        function decorator(target: T, propertyKey: K, descriptor: D): D | void {
            return callback(target, propertyKey, descriptor, options);
        }
        if (args[1] != null) {
            return decorator(<T>args[0], args[1], <D>args[2]) as unknown as
                ((target: T, propertyKey: K, descriptor: D) => void | D) & D;
        } else {
            return decorator as unknown as ((target: T, propertyKey: K, descriptor: D) => void | D) & D;
        }
    };
}

/**
 * Creates and returns a new property decorator which can optionally be configured with decorator options.
 */
export function createPropertyDecorator<
    T extends object = object,
    K extends string | symbol = string | symbol,
    D extends any = any,
    O extends object = never
>(
    callback: (target: T, key: K, options: O) => void
): (...args: [ O ] | [ T, K, D ]) => ((target: T, propertyKey: K) => void) & (D | void) {
    return function(...args: [ O ] | [ T, K, any ]): ((target: T, propertyKey: K) => D | void) & D {
        const options = <O>(args[1] != null ? {} : args[0]);
        function decorator(target: T, propertyKey: K): void {
            callback(target, propertyKey, options);
        }
        if (args[1] != null) {
            return decorator(<T>args[0], args[1]) as unknown as ((target: T, propertyKey: K) => void | D) & D;
        } else {
            return decorator as unknown as ((target: T, propertyKey: K) => void | D) & D;
        }
    };
}
