/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Exception } from "../util/exception";

/**
 * Thrown when some dependency injection related operation fails.
 */
export class InjectionException extends Exception {}
