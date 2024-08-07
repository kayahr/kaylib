/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

function sum(a: number, b: number): number {
    return a + b;
}

function notNested(a: number, b: number): number {
    return sum(a, b);
}

function nested(a: number, b: number): number {
    function sum(a: number, b: number): number {
        return a + b;
    }
    return sum(a, b);
}

function nestedArrow(a: number, b: number): number {
    const sum = (a: number, b: number): number => a + b;
    return sum(a, b);
}

class Test {
    public static sum(a: number, b: number): number {
        return a + b;
    }

    public staticMethod(a: number, b: number): number {
        return Test.sum(a, b);
    }
}

const test = new Test();

export const functionsBenchmark: BenchmarkCandidate[] = [
    {
        name: "nested function",
        func: (): number => nested(1, 2)
    },
    {
        name: "nested arrow function",
        func: (): number => nestedArrow(1, 2)
    },
    {
        name: "not nested function",
        func: (): number => notNested(1, 2)
    },
    {
        name: "static method",
        func: (): number => test.staticMethod(1, 2)
    }
];
