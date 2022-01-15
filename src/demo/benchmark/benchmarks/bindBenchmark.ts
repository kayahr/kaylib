/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

type SumFunc = (a: number, b: number) => number;

interface Scope {
    test: number;
}

const scope: Scope = {
    test: 53
};

function bindMethod(func: SumFunc, scope: Scope): SumFunc {
    return func.bind(scope);
}

function functionWithDynamicParamsAndApply(func: SumFunc, scope: Scope): SumFunc {
    return (...args: [ number, number ]): number => func.apply(scope, args);
}

function functionWithDynamicParamsAndCall(func: SumFunc, scope: Scope): SumFunc {
    return (...args: [ number, number ]): number => func.call(scope, ...args);
}

function functionWithFixedParamsAndApply(func: SumFunc, scope: Scope): SumFunc {
    return (a: number, b: number): number => func.apply(scope, [ a, b ]);
}

function functionWithFixedParamsAndCall(func: SumFunc, scope: Scope): SumFunc {
    return (a: number, b: number): number => func.call(scope, a, b);
}

function sum(this: Scope, a: number, b: number): number {
    const sum = this.test + a + b;
    if (sum !== 56) {
        throw new Error(`Checksum mismatch (${sum} != 56)`);
    }
    return sum;
}

export const bindBenchmark: BenchmarkCandidate[] = [
    {
        "name": "bind",
        "func": (): number => bindMethod(sum, scope)(1, 2)
    },
    {
        "name": "dynamic apply",
        "func": (): number => functionWithDynamicParamsAndApply(sum, scope)(1, 2)
    },
    {
        "name": "dynamic call",
        "func": (): number => functionWithDynamicParamsAndCall(sum, scope)(1, 2)
    },
    {
        "name": "fixed apply",
        "func": (): number => functionWithFixedParamsAndApply(sum, scope)(1, 2)
    },
    {
        "name": "fixed call",
        "func": (): number => functionWithFixedParamsAndCall(sum, scope)(1, 2)
    }
];
