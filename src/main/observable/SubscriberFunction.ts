/*
 * Copyright (C) 2018 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { SubscriptionObserver } from "./SubscriptionObserver";
import { TeardownLogic } from "./TeardownLogic";

/**
 * The type of the subscriber function passed to the observable constructor.
 */
export type SubscriberFunction<T> = (observer: SubscriptionObserver<T>) => TeardownLogic;
