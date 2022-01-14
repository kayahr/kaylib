/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Slot type which is simply a function.
 *
 * @param T - The slot argument types defined as an array. For example `[ string, number ]` defines a slot with
 *            two arguments, first is a `string` and second is a `number`. When not specified or an empty array is
 *            specified then the slot has no arguments.
 */
export type Slot<T extends unknown[] = []> = (...args: T) => void;
