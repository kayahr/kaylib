/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Subject } from "rxjs";

import { Signal } from "../../../main/signal/Signal";
import { BenchmarkCandidate } from "../../../main/util/benchmark";

let sum1 = 0;
const subject = new Subject<number>();
for (let i = 0; i < 10; i++) {
    subject.subscribe(a => { sum1 += a; });
}

let sum2 = 0;
const signal = new Signal<number[]>();
for (let i = 0; i < 10; i++) {
    signal.connect(a => { sum2 += a; });
}

function withRxJS(): number {
    for (let i = 0; i < 100; i++) {
        subject.next(10);
    }
    return sum1;
}

function withSignal(): number {
    for (let i = 0; i < 100; i++) {
        signal(10);
    }
    return sum2;
}

export const eventBenchmark: BenchmarkCandidate[] = [
    {
        "name": "RxJS",
        "func": (): number => withRxJS()
    },
    {
        "name": "Signal",
        "func": (): number => withSignal()
    }
];
