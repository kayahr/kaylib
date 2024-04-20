/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Parameter, TypeOf } from "./types";

/**
 * Decorator which overrides the `design:paramtypes` metadata written by TypeScript when `emitDecoratorMetadata` feature is enabled. TypeScript unfortunately
 * does not support union types and always writes `Object` as type information when some unsupported type is found. With this decorator you can override this
 * metadata information by specifying a specific type or an array of types manually.
 *
 * Examples:
 *
 * - `[ String, Number ]` is the union type `string | number`.
 * - `[ String, null ]` represents a nullable string type.
 * - `[ String, undefined ]` represents an optional string type.
 *
 * Built-in support for this in TypeScript was unfortunately rejected as out-of-scope so this decorator is some kind of workaround until a better solution
 * pops up.
 *
 * @see https://github.com/microsoft/TypeScript/issues/9916
 */
export function paramType<
    O extends object,
    K extends keyof O & (string | symbol),
    I extends number,
    P extends O[K] extends (...args: any) => any ? TypeOf<Parameter<O[K], I>> : never
>(types: P[] | P): (target: O, propertyKey: K, parameterIndex: I) => void {
    return (target: O, propertyKey: K, parameterIndex: I): void => {
        const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey) as unknown[];
        paramTypes[parameterIndex] = types;
        Reflect.defineMetadata("design:paramtypes", paramTypes, target, propertyKey);
    };
}
