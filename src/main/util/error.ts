/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Converts to given parameter to an error. If parameter is already an error then it is returned as-is. Otherwise a new
 * error is created with the string representation of the parameter as message.
 *
 * @param errorOrMessage - Either an error or some value which is used as error message.
 * @return Either the given error or a newly created error with the parameter used as error message.
 */
export function toError(errorOrMessage: unknown): Error {
    if (errorOrMessage instanceof Error) {
        return errorOrMessage;
    } else {
        return new Error("" + errorOrMessage);
    }
}

/**
 * Function which simply throws the given error and never returns. This function is useful to throw exceptions in
 * expressions.
 *
 * @param error - The error to throw.
 */
export function throwError(error: unknown): never {
    throw error;
}
