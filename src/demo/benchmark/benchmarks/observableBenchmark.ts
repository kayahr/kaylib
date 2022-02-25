/*
 * Copyright (C) 2022 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Observable as RxjsObservable, Subscriber as RxjsSubscriber, Subscription as RxjsSubscription } from "rxjs";

import { Observable } from "../../../main/observable/Observable";
import { Subscription } from "../../../main/observable/Subscription";
import { SubscriptionObserver } from "../../../main/observable/SubscriptionObserver";
import { BenchmarkCandidate } from "../../../main/util/benchmark";

function withRxJS(): number {
    let rxjsSubscriber: RxjsSubscriber<number> | undefined;
    const rxjsObservable = new RxjsObservable<number>(subscriber2 => {
        rxjsSubscriber = subscriber2;
    });
    let sum1 = 0;
    sum1 += rxjsSubscriber != null ? 0 : 1;
    const rxjsSubscriptions: RxjsSubscription[] = [];
    for (let i = 0; i < 10; i++) {
        const subscription = rxjsObservable.subscribe(a => { sum1 += a; });
        rxjsSubscriptions.push(subscription);
    }
    for (let i = 0; i < 10000; i++) {
        rxjsSubscriber?.next(10);
    }
    for (const rxjsSubscription of rxjsSubscriptions) {
        rxjsSubscription.unsubscribe();
    }
    return sum1;
}

function withKaylib(): number {
    let kaylibSubscriber: SubscriptionObserver<number> | undefined;
    const kaylibObservable = new Observable<number>(subscriber2 => {
        kaylibSubscriber = subscriber2;
    });
    let sum2 = 0;
    sum2 += kaylibSubscriber != null ? 0 : 1;
    const kaylibSubscriptions: Subscription[] = [];
    for (let i = 0; i < 10; i++) {
        const subscription = kaylibObservable.subscribe(a => { sum2 += a; });
        kaylibSubscriptions.push(subscription);
    }
    for (let i = 0; i < 10000; i++) {
        kaylibSubscriber?.next(10);
    }
    for (const kaylibSubscription of kaylibSubscriptions) {
        kaylibSubscription.unsubscribe();
    }
    return sum2;
}

export const observableBenchmark: BenchmarkCandidate[] = [
    {
        "name": "RxJS",
        "func": (): number => withRxJS()
    },
    {
        "name": "Kaylib",
        "func": (): number => withKaylib()
    }
];
