/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

const string = "This is a test text. This is a test text. This is a test text. This is a test text. This is a test text. This is a test text. ";
const numStrings = 16384 * 100;

function append(): string {
    let s = "";
    for (let i = 0; i < numStrings; i++) {
        s += string;
    }
    return s;
}

function join(): string {
    const s: string[] = [];
    for (let i = 0; i < numStrings; i++) {
        s.push(string);
    }
    return s.join("");
}

function concat(): string {
    let s = "";
    for (let i = 0; i < numStrings; i++) {
        s = s.concat(string);
    }
    return s;
}

export const stringCreateBenchmark: BenchmarkCandidate[] = [
    {
        name: "append()",
        func: (): string => append()
    },
    {
        name: "join",
        func: (): string => join()
    },
    {
        name: "concat",
        func: (): string => concat()
    }
];
