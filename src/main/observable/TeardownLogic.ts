/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Unsubscribable } from "./Unsubscribable";

/**
 * The return type of a subscriber function.
 */
export type TeardownLogic = Unsubscribable | (() => void) | void;
