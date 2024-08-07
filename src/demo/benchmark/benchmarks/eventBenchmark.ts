/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Subject, Subscription } from "rxjs";

import { Signal, SlotFunction } from "../../../main/signal/Signal";
import { BenchmarkCandidate } from "../../../main/util/benchmark";

function withRxJS(): number {
    const subject = new Subject<number>();
    let sum1 = 0;
    sum1 += subject != null ? 0 : 1;
    const subscriptions: Subscription[] = [];
    for (let i = 0; i < 10; i++) {
        const subscription = subject.subscribe(a => { sum1 += a; });
        subscriptions.push(subscription);
    }
    for (let i = 0; i < 1000; i++) {
        subject.next(10);
    }
    for (const subscription of subscriptions) {
        subscription.unsubscribe();
    }
    return sum1;
}

function withSignal(): number {
    const signal = new Signal<number[]>();
    let sum2 = 0;
    sum2 += signal != null ? 0 : 1;
    const slots: Array<SlotFunction<any>> = [];
    for (let i = 0; i < 10; i++) {
        const slot = (a: number): void => { sum2 += a; };
        signal.connect(slot);
        slots.push(slot);
    }
    for (let i = 0; i < 1000; i++) {
        signal(10);
    }
    for (const slot of slots) {
        signal.disconnect(slot);
    }
    return sum2;
}

export const eventBenchmark: BenchmarkCandidate[] = [
    {
        name: "RxJS",
        func: (): number => withRxJS()
    },
    {
        name: "Signal",
        func: (): number => withSignal()
    }
];
