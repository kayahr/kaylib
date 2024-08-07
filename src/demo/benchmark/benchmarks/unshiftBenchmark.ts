/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

const runs = 1000;

function withUnshift(): number {
    const values: number[] = [];
    for (let i = 0; i < runs; i++) {
        values.unshift(i);
    }
    return values[0];
}

function withReversePush(): number {
    const values: number[] = [];
    for (let i = 0; i < runs; i++) {
        values.push(i);
    }
    return values.reverse()[0];
}

export const unshiftBenchmark: BenchmarkCandidate[] = [
    {
        name: "unshift",
        func: (): number => withUnshift()
    },
    {
        name: "push+reverse",
        func: (): number => withReversePush()
    }
];
