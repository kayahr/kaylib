/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

const numElements = 100;

const array: number[] = [];
const set = new Set<number>();

for (let i = 0; i < numElements; i++) {
    array.push(i);
    set.add(i);
}

function iterateForOfArray(): number {
    let sum = 0;
    for (const value of array) {
        sum += value;
    }
    return sum;
}

function iterateForOfSet(): number {
    let sum = 0;
    for (const value of set) {
        sum += value;
    }
    return sum;
}

function iterateFor(): number {
    let sum = 0;
    for (let i = 0, max = array.length; i < max; ++i) {
        sum += array[i];
    }
    return sum;
}

function iterateForEach(): number {
    let sum = 0;
    array.forEach(v => { sum += v; });
    return sum;
}

export const iterateBenchmark: BenchmarkCandidate[] = [
    {
        name: "for of (Array)",
        func: (): number => iterateForOfArray()
    },
    {
        name: "for of (Set)",
        func: (): number => iterateForOfSet()
    },
    {
        name: "for",
        func: (): number => iterateFor()
    },
    {
        name: "forEach",
        func: (): number => iterateForEach()
    }
];
