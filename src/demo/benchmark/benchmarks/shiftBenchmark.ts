/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

const runs = 1000000;

function withMultiply(): number {
    let r = 1;
    for (let i = 0; i < runs; i++) {
        r *= 256;
        r /= 256;
    }
    return r;
}

function with32BitShift(): number {
    let r = 0;
    for (let i = 0; i < runs; i++) {
        r <<= 8;
        r >>>= 8;
    }
    return r;
}

function withBigIntShift(): bigint {
    let r = 0n;
    for (let i = 0; i < runs; i++) {
        r <<= 8n;
        r >>= 8n;
    }
    return r;
}

export const shiftBenchmark: BenchmarkCandidate[] = [
    {
        name: "Multiply",
        func: (): number => withMultiply()
    },
    {
        name: "32 bit shift",
        func: (): number => with32BitShift()
    },
    {
        name: "big int shift",
        func: (): bigint => withBigIntShift()
    }
];
