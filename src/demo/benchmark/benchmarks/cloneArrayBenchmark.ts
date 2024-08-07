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

function slice(): number[] {
    return source.slice();
}

function spread(): number[] {
    return [ ...source ];
}

function arrayFrom(): number[] {
    return Array.from(source);
    }

export const cloneArrayBenchmark: BenchmarkCandidate[] = [
    {
        name: "slice",
        func: (): number[] => slice()
    },
    {
        name: "spread",
        func: (): number[] => spread()
    },
    {
        name: "arrayFrom",
        func: (): number[] => arrayFrom()
    }
];
