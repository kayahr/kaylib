/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * A shortcut for the property descriptor type in method decorators. Describes a method with any kind of arguments
 * and any return value.
 */
type Method<T> = (this: T, ...args: any[]) => any;


/** The two types of allowed method decorator arguments for call without and with decorator parameter. */
type MethodDecoratorArgs<T, K, V, P> = [ T, K, TypedPropertyDescriptor<V> ] | [ P ];

/**
 * Type guard to check if given method decorator args are parameterized arguments.
 *
 * @param args - The method decorator arguments to check
 * @return True when parameterized arguments, false if not.
 */
function isParameterizedMethodDecoratorArgs<T, K, V, O>(args: MethodDecoratorArgs<T, K, V, O>): args is [ O ] {
    return args.length < 2;
}

/**
 * Type of a parameterless method decorator. This is pretty much the same as the standard method decorator type
 * but with more strict typings.
 */
type ParameterlessMethodDecorator<T, V extends Method<T>> = <T extends Record<K, V>, K extends string>
    (target: T, propertyKey: K, descriptor: TypedPropertyDescriptor<V>) => void;

/**
 * Type of a parameterized method decorator which is a function receiving the decorator parameter and returning
 * the real (parameterless) method decorator.
 */
type ParameterizedMethodDecorator<T, V extends Method<T>, P> = (params: P) => ParameterlessMethodDecorator<T, V>;

/** Union type grouping the parameterless and parameterized method decorator type into one. */
type MethodDecorator<T, V extends Method<T>, P> = ParameterlessMethodDecorator<T, V>
    & ParameterizedMethodDecorator<T, V, P>;

/**
 * Utility function to create a method decorator more easily. It also supports an optional decorator parameter. The
 * returned method decorator can be used with and without parentheses. When used with parentheses then a parameter
 * is required.
 *
 * @param func - The decorator function with the target type, the property key, the property descriptor and the
 *               optional parameter as arguments. It has to return nothing. To change the method simply
 *               modify the descriptor object.
 * @return The created decorator.
 */
export function createMethodDecorator<
    K extends string,
    V extends Method<T>,
    T extends object = Record<K, V>,
    P extends unknown = never
>(func: (target: T, key: K, descriptor: TypedPropertyDescriptor<V>, params?: P) => void): MethodDecorator<T, V, P> {
    return ((...args: MethodDecoratorArgs<T, K, V, P>) => {
        if (isParameterizedMethodDecoratorArgs(args)) {
            return (target: T, key: K, descriptor: TypedPropertyDescriptor<V>) =>
                func(target, key, descriptor, args[0]);
        } else {
            return func(args[0], args[1], args[2]);
        }
    }) as unknown as MethodDecorator<T, V, P>;
}

/** The two types of allowed method decorator arguments for call without and with decorator parameter. */
type PropertyDecoratorArgs<T, K, P> = [ T, K ] | [ P ];

/**
 * Type guard to check if given method decorator args are parameterized arguments.
 *
 * @param args - The method decorator arguments to check
 * @return True when parameterized arguments, false if not.
 */
function isParameterizedPropertyDecoratorArgs<T, K, O>(args: PropertyDecoratorArgs<T, K, O>): args is [ O ] {
    return args.length < 2;
}


/**
 * Type of a parameterless method decorator. This is pretty much the same as the standard method decorator type
 * but with more strict typings.
 */
type ParameterlessPropertyDecorator<T, K extends string> = <T extends object, K extends string>(
    target: T, propertyKey: K) => void;

/**
 * Type of a parameterized method decorator which is a function receiving the decorator parameter and returning
 * the real (parameterless) method decorator.
 */
type ParameterizedPropertyDecorator<T, K extends string, P> = (params: P) => ParameterlessPropertyDecorator<T, K>;

/** Union type grouping the parameterless and parameterized method decorator type into one. */
type PropertyDecorator<T, K extends string, P> = ParameterlessPropertyDecorator<T, K>
    & ParameterizedPropertyDecorator<T, K, P>;

/**
 * Creates and returns a new property decorator which can optionally be configured with decorator options.
 */
export function createPropertyDecorator<
    K extends string,
    T extends object,
    P extends unknown = never
>(func: (target: T, key: K, params?: P) => void): PropertyDecorator<T, K, P> {
    return ((...args: PropertyDecoratorArgs<T, K, P>) => {
        if (isParameterizedPropertyDecoratorArgs(args)) {
            return (target: T, key: K) => func(target, key, args[0]);
        } else {
            return func(args[0], args[1]);
        }
    }) as unknown as PropertyDecorator<T, K, P>;
}
