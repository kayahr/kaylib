import { Observable } from "../../../main/observable/Observable";
import { share } from "../../../main/observable/operators/share";
import { SharedObservable } from "../../../main/observable/SharedObservable";
import { pipeWith } from "../../../main/util/function";

describe("share", () => {
    it("returns a SharedObservable", () => {
        const source = pipeWith(new Observable(() => {}), share());
        expect(source).toBeInstanceOf(SharedObservable);
    });
    it("distributes next value to all subscribers", () => {
        let next: (v: number) => void = () => {};
        const source = pipeWith(new Observable<number>(observer => { next = v => observer.next(v); }), share());
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        source.subscribe(fn1);
        source.subscribe(fn2);
        next(53);
        expect(fn1).toHaveBeenCalledExactlyOnceWith(53);
        expect(fn2).toHaveBeenCalledExactlyOnceWith(53);
    });
    it("distributes error to all subscribers", () => {
        let error: (e: Error) => void = () => {};
        const source = pipeWith(new Observable<number>(observer => { error = e => observer.error(e); }), share());
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        source.subscribe({ error: fn1 });
        source.subscribe({ error: fn2 });
        const e = new Error();
        error(e);
        expect(fn1).toHaveBeenCalledExactlyOnceWith(e);
        expect(fn2).toHaveBeenCalledExactlyOnceWith(e);
    });
    it("distributes complete to all subscribers", () => {
        let complete: () => void = () => {};
        const source = pipeWith(new Observable<number>(observer => { complete = () => observer.complete(); }), share());
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        source.subscribe({ complete: fn1 });
        source.subscribe({ complete: fn2 });
        complete();
        expect(fn1).toHaveBeenCalledOnce();
        expect(fn2).toHaveBeenCalledOnce();
    });
    it("calls init only on first subscribe", () => {
        const init = jest.fn();
        const source = pipeWith(new Observable<number>(() => { init(); }), share());
        source.subscribe(() => {});
        expect(init).toHaveBeenCalledOnce();
        init.mockClear();
        source.subscribe(() => {});
        expect(init).not.toHaveBeenCalled();
    });
    it("calls teardown only on last unsubscribe", () => {
        const tearDown = jest.fn();
        const source = pipeWith(new Observable<number>(() => tearDown), share());
        const sub1 = source.subscribe(() => {});
        const sub2 = source.subscribe(() => {});
        sub1.unsubscribe();
        expect(tearDown).not.toHaveBeenCalled();
        sub2.unsubscribe();
        expect(tearDown).toHaveBeenCalledOnce();
    });
});
