/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { range } from "../../../main/util/array";
import { BenchmarkCandidate } from "../../../main/util/benchmark";

const size = 100;

function fromKeys(): number[] {
    return Array.from(Array(size).keys());
}

function mappedFrom(): number[] {
    return Array.from(Array(size)).map((v, i) => i);
}

function directMappedFrom(): number[] {
    return Array.from(Array(size), (v, i) => i);
}

function spreadKeys(): number[] {
    return [ ...Array(size).keys() ];
}

function mappedSpread(): number[] {
    return [ ...Array(size).map((v, i) => i) ];
}

function classic(): number[] {
    const result = new Array<number>(size);
    for (let i = 0; i < size; ++i) {
        result[i] = i;
    }
    return result;
}

export const sequenceBenchmark: BenchmarkCandidate[] = [
    {
        "name": "A.from(A(s).keys())",
        "func": (): number[] => fromKeys()
    },
    {
        "name": "A.from(A(size)).map()",
        "func": (): number[] => mappedFrom()
    },
    {
        "name": "A.from(A(s),map)",
        "func": (): number[] => directMappedFrom()
    },
    {
        "name": "[...A(s).keys()]",
        "func": (): number[] => spreadKeys()
    },
    {
        "name": "[...A(s).map()]",
        "func": (): number[] => mappedSpread()
    },
    {
        "name": "classic",
        "func": (): number[] => classic()
    },
    {
        "name": "range()",
        "func": (): number[] => range(size)
    }
];
