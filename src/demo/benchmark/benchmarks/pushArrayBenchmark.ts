/*
 * Copyright (C) 2024 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

const size = 10000;

const source: number[] = [];
for (let i = 0; i < size; i++) {
    source[i] = i;
}

function pushSpread(): number {
    const a = [ 1 ];
    a.push(...source);
    return a.length;
}

function pushApply(): number {
    const a = [ 1 ];
    Array.prototype.push.apply(a, source);
    return a.length;
}

function pushForOf(): number {
    const a = [ 1 ];
    for (const v of source) {
        a.push(v);
    }
    return a.length;
}

export const pushArrayBenchmark: BenchmarkCandidate[] = [
    {
        name: "pushSpread",
        func: (): number => pushSpread()
    },
    {
        name: "pushApply",
        func: (): number => pushApply()
    },
    {
        name: "pushForOf",
        func: (): number => pushForOf()
    }
];
