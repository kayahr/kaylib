/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Class } from "./types";

/**
 * Returns the class of the give object.
 *
 * @param T      - The instance type.
 * @param object - The object for which to return the class.
 * @return The objects class.
 */
export function getClass<T extends object>(object: T): Class<T> {
    return (Object.getPrototypeOf(object) as object).constructor;
}

/**
 * Returns the super class of the given class. TypeScript can't determine the super class type automatically so
 * you have to provide it yourself.
 *
 * @param T   - Optional super class type to cast to.
 * @param cls - The class for which to return the super class.
 * @return The super class of the given class. Null when class is the Object class which has no super class.
 */
export function getSuperClass<T = unknown>(cls: Class): Class<T> | null {
    const prototype = Object.getPrototypeOf(cls.prototype) as Record<string, unknown>;
    return prototype != null ? prototype.constructor as Class<T> : null;
}

/**
 * Returns the class name of the given class.
 *
 * @param cls - The class for which to return the class name.
 * @return The class name.
 */
export function getClassName(cls: Class): string {
    return cls.name;
}
