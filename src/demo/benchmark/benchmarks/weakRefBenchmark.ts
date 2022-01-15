/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

class DirectRef<T> {
    public constructor(
        private readonly value: T
    ) {}

    public deref(): T {
        return this.value;
    }
}

function directRef(value: object): number {
    return new DirectRef(value).deref() === value ? 1 : 0;
}

function weakRef(value: object): number {
    return new WeakRef(value).deref() === value ? 1 : 0;
}

export const weakRefBenchmark: BenchmarkCandidate[] = [
    {
        "name": "weak ref",
        "func": (): number => weakRef({})
    },
    {
        "name": "direct ref",
        "func": (): number => directRef({})
    }
];
