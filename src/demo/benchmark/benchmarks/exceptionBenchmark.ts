/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

function returnFalseWhenValueIs0(value: number): number | false {
    if (value === 0) {
        return false;
    } else {
        return value;
    }
}

function throwExceptionWhenValueIs0(value: number): number {
    if (value === 0) {
        throw new Error("Value is 0");
    } else {
        return value;
    }
}

const fixedException = new Error("Value is 0");
function throwFixedExceptionWhenValueIs0(value: number): number {
    if (value === 0) {
        throw fixedException;
    } else {
        return value;
    }
}

function withReturnFalse(value: number): number {
    const v = returnFalseWhenValueIs0(value);
    if (v === false) {
        return 0;
    } else {
        return v;
    }
}

function withException(value: number): number {
    try {
        return throwExceptionWhenValueIs0(value);
    } catch (e) {
        return 0;
    }
}

function withFixedException(value: number): number {
    try {
        return throwFixedExceptionWhenValueIs0(value);
    } catch (e) {
        return 0;
    }
}

export const exceptionBenchmark: BenchmarkCandidate[] = [
    {
        "name": "return false",
        "func": (): number => withReturnFalse(Math.round(Math.random() * 100000))
    },
        {
        "name": "throw exception",
        "func": (): number => withException(Math.round(Math.random() * 100000))
    },
        {
        "name": "throw fixed exception",
        "func": (): number => withFixedException(Math.round(Math.random() * 100000))
    }
];
