/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

const size = 100;

const source: number[] = [];
for (let i = 0; i < size; i++) {
    source[i] = i;
}

function createNewArray(): number[] {
    let a = source.slice();
    const value = a[50];
    a = [];
    a.push(value);
    return a;
}

function resetLength(): number[] {
    const a = source.slice();
    const value = a[50];
    a.length = 0;
    a.push(value);
    return a;
}

function splice(): number[] {
    const a = source.slice();
    const value = a[50];
    a.splice(0, a.length);
    a.push(value);
    return a;
}

export const clearArrayBenchmark: BenchmarkCandidate[] = [
    {
        "name": "createNewArray",
        "func": (): number[] => createNewArray()
    },
    {
        "name": "resetLength",
        "func": (): number[] => resetLength()
    },
    {
        "name": "splice",
        "func": (): number[] => splice()
    }
];
