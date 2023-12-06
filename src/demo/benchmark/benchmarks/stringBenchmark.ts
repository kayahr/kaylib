/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

function createNumber(): number {
    return Math.round(Math.random() * 256);
}

function toString(): string {
    return createNumber().toString();
}

function concat(): string {
    return "" + createNumber();
}

function cast(): string {
    return String(createNumber());
}

function template(): string {
    return `${createNumber()}`;
}

export const stringBenchmark: BenchmarkCandidate[] = [
    {
        "name": "toString()",
        "func": (): string => toString()
    },
    {
        "name": "\"\"+s",
        "func": (): string => concat()
    },
    {
        "name": "String()",
        "func": (): string => cast()
    },
    {
        "name": "Template",
        "func": (): string => template()
    }
];
