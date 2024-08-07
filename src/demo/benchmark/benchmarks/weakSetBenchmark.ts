/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { FastWeakSet } from "../../../main/lang/FastWeakSet";
import { BenchmarkCandidate } from "../../../main/util/benchmark";

const set = new WeakSet();
const fastSet = new FastWeakSet();

function weakSet(value: object): void {
    const present = set.has(value);
    if (present) {
        set.delete(value);
    } else {
        set.add(value);
    }
}

function fastWeakSet(value: object): void {
    const present = fastSet.has(value);
    if (present) {
        fastSet.delete(value);
    } else {
        fastSet.add(value);
    }
}

function customNamedProperty(value: object): void {
    const present = (value as Record<string, unknown>).present != null;
    if (present) {
        delete (value as Record<string, unknown>).present;
    } else {
        (value as Record<string, unknown>).present = true;
    }
}

const symbol = Symbol("foo");

function customSymbolProperty(value: object): void {
    const present = (value as Record<symbol, unknown>)[symbol] != null;
    if (present) {
        delete (value as Record<symbol, unknown>)[symbol];
    } else {
        (value as Record<symbol, unknown>)[symbol] = true;
    }
}

export const weakSetBenchmark: BenchmarkCandidate[] = [
    {
        name: "weak set",
        func: (): void => weakSet({})
    },
    {
        name: "fast weak set",
        func: (): void => fastWeakSet({})
    },
    {
        name: "custom named property",
        func: (): void => customNamedProperty({})
    },
    {
        name: "custom symbol property",
        func: (): void => customSymbolProperty({})
    }
];
