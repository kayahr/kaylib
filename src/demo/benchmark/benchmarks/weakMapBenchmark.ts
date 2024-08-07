/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { FastWeakMap } from "../../../main/lang/FastWeakMap";
import { BenchmarkCandidate } from "../../../main/util/benchmark";

const map = new WeakMap<object, number>();
const fastMap = new FastWeakMap<object, number>();

function weakMap(value: object): number {
    let counter = map.get(value);
    if (counter == null) {
        counter = 0;
    } else {
        counter++;
    }
    map.set(value, counter);
    return counter;
}

function fastWeakMap(value: object): number {
    let counter = fastMap.get(value);
    if (counter == null) {
        counter = 0;
    } else {
        counter++;
    }
    fastMap.set(value, counter);
    return counter;
}

function customNamedProperty(value: object): number {
    let counter = (value as Record<string, number>).counter;
    if (counter == null) {
        counter = 0;
    } else {
        counter++;
    }
    (value as Record<string, number>).counter = counter;
    return counter;
}

const symbol = Symbol("foo");

function customSymbolProperty(value: object): number {
    let counter = (value as Record<symbol, number>)[symbol];
    if (counter == null) {
        counter = 0;
    } else {
        counter++;
    }
    (value as Record<symbol, number>)[symbol] = counter;
    return counter;
}

export const weakMapBenchmark: BenchmarkCandidate[] = [
    {
        name: "weak map",
        func: (): number => weakMap({})
    },
    {
        name: "fast weak map",
        func: (): number => fastWeakMap({})
    },
    {
        name: "custom named property",
        func: (): number => customNamedProperty({})
    },
    {
        name: "custom symbol property",
        func: (): number => customSymbolProperty({})
    }
];
