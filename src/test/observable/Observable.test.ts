/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import { runTests as runObservableTests } from "es-observable-tests";
import { Subject } from "rxjs";

import { Observable } from "../../main/observable/Observable";
import { Observer } from "../../main/observable/Observer";
import { Subscribable } from "../../main/observable/Subscribable";
import { Unsubscribable } from "../../main/observable/Unsubscribable";

describe("Observable", () => {
    it("passes the official es-observable-tests test suite", async () => {
        let output = "";
        const origLog = console.log;
        console.log = (s: string) => { output += s + "\n"; };
        const result = await runObservableTests(Observable);
        console.log = origLog;
        if (result.logger.failed > 0 || result.logger.errored > 0) {
            throw new Error(`Test suite found ${result.logger.failed} failures and ${result.logger.errored} errors: `
                + output);
        }
    });
    describe("[Symbol.observable]", () => {
        it("returns same observable", () => {
            const observable = new Observable(() => {});
            expect(observable[Symbol.observable]()).toBe(observable);
        });
    });
    describe("from", () => {
        it("creates observable from a subscribable object", () => {
            class Test implements Subscribable<number> {
                public onNext: ((value: number) => void) | null | undefined = null;
                public subscribe(observer?: null | Observer<number> | ((value: number) => void)): Unsubscribable {
                    if (observer != null) {
                        this.onNext = (observer instanceof Function) ? observer : observer.next?.bind(observer);
                    }
                    return {
                        unsubscribe: () => {
                            this.onNext = null;
                        }
                    };
                }
            }
            const test = new Test();
            const observable = Observable.from(test);
            expect(observable).toBeInstanceOf(Observable);
            const observer = jest.fn();
            observable.subscribe(observer);
            expect(test.onNext).toBeDefined();
            if (test.onNext != null) {
                test.onNext(23);
            }
            expect(observer).toHaveBeenCalledOnce();
            expect(observer).toHaveBeenCalledWith(23);
        });
        it("creates observable from a RxJS observable", () => {
            const subject = new Subject();
            const observable = Observable.from(subject);
            expect(observable).toBeInstanceOf(Observable);
            const observer = jest.fn();
            observable.subscribe(observer);
            subject.next(42);
            expect(observer).toHaveBeenCalledOnce();
            expect(observer).toHaveBeenCalledWith(42);
        });
    });
});
