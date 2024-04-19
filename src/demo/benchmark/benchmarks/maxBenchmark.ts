/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

const runs = 1000000;

function withIf(a: number, b: number): number {
    let r = 0;
    for (let i = 0; i < runs; i++) {
        if (a > b) {
            r += a;
        } else {
            r += i;
        }
    }
    return r;
}

function withTernary(a: number, b: number): number {
    let r = 0;
    for (let i = 0; i < runs; i++) {
        r += a > b ? a : b;
    }
    return r;
}

function withMathMax(a: number, b: number): number {
    let r = 0;
    for (let i = 0; i < runs; i++) {
        r += Math.max(a, b);
    }
    return r;
}

export const maxBenchmark: BenchmarkCandidate[] = [
    {
        "name": "If",
        "func": (): number => withIf(Math.random(), Math.random())
    },
    {
        "name": "Ternary",
        "func": (): number => withTernary(Math.random(), Math.random())
    },
    {
        "name": "Math.max",
        "func": (): number => withMathMax(Math.random(), Math.random())
    }
];
