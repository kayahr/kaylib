import { SharedObservable } from "../../main/observable/SharedObservable";
import { SubscriptionObserver } from "../../main/observable/SubscriptionObserver";

describe("SharedObservable", () => {
    it("runs subscriber function only on first subscribe", () => {
        const fn = jest.fn();
        const o = new SharedObservable(fn);
        expect(fn).not.toHaveBeenCalled();
        o.subscribe(() => {});
        expect(fn).toHaveBeenCalledOnce();
        fn.mockReset();
        o.subscribe(() => {});
        expect(fn).not.toHaveBeenCalled();
    });
    it("runs teardown function only on last unsubscribe", () => {
        const fn = jest.fn();
        const o = new SharedObservable(() => fn);
        const sub1 = o.subscribe(() => {});
        const sub2 = o.subscribe(() => {});
        sub1.unsubscribe();
        expect(fn).not.toHaveBeenCalled();
        sub2.unsubscribe();
        expect(fn).toHaveBeenCalledOnce();
    });
    it("runs teardown unsubscribable only on last unsubscribe", () => {
        const fn = jest.fn();
        const o = new SharedObservable(() => ({ unsubscribe: fn }));
        const sub1 = o.subscribe(() => {});
        const sub2 = o.subscribe(() => {});
        sub1.unsubscribe();
        expect(fn).not.toHaveBeenCalled();
        sub2.unsubscribe();
        expect(fn).toHaveBeenCalledOnce();
    });
    it("emits values to multiple subscribers", () => {
        let producer: SubscriptionObserver<number> | undefined;
        const o = new SharedObservable<number>(subscriber => {
            producer = subscriber;
        });
        const fn1 = jest.fn();
        o.subscribe(fn1);
        const fn2 = jest.fn();
        o.subscribe(fn2);
        expect(producer).not.toBeNull();
        if (producer != null) {
            producer.next(23);
            expect(fn1).toHaveBeenCalledOnce();
            expect(fn1).toHaveBeenCalledWith(23);
            expect(fn2).toHaveBeenCalledOnce();
            expect(fn2).toHaveBeenCalledWith(23);
            expect(producer.closed).toBe(false);
        }
    });
    it("completes multiple subscribers", () => {
        let producer: SubscriptionObserver<number> | undefined;
        const o = new SharedObservable<number>(subscriber => {
            producer = subscriber;
        });
        const fn1 = jest.fn();
        o.subscribe({ complete: fn1 });
        const fn2 = jest.fn();
        o.subscribe({ complete: fn2 });
        expect(producer).not.toBeNull();
        if (producer != null) {
            producer.complete();
            expect(fn1).toHaveBeenCalledOnce();
            expect(fn2).toHaveBeenCalledOnce();
            expect(producer.closed).toBe(true);
        }
    });
    it("emits error to multiple subscribers", () => {
        let producer: SubscriptionObserver<number> | undefined;
        const o = new SharedObservable<number>(subscriber => {
            producer = subscriber;
        });
        const fn1 = jest.fn();
        o.subscribe({ error: fn1 });
        const fn2 = jest.fn();
        o.subscribe({ error: fn2 });
        expect(producer).not.toBeNull();
        if (producer != null) {
            const e = new Error("Foo!");
            producer.error(e);
            expect(fn1).toHaveBeenCalledOnce();
            expect(fn1).toHaveBeenCalledWith(e);
            expect(fn2).toHaveBeenCalledOnce();
            expect(fn2).toHaveBeenCalledWith(e);
            expect(producer.closed).toBe(true);
        }
    });
    it("is restarted on next subscription after error", () => {
        let producer: SubscriptionObserver<number> | undefined;
        const startup = jest.fn();
        const teardown = jest.fn();
        const o = new SharedObservable<number>(subscriber => {
            startup();
            producer = subscriber;
            return teardown;
        });
        o.subscribe({ error: () => {} });
        startup.mockReset();
        if (producer != null) {
            producer.error(new Error("Foo!"));
            expect(teardown).toHaveBeenCalledOnce();
            teardown.mockReset();
            o.subscribe(() => {});
            expect(startup).toHaveBeenCalledOnce();
        }
    });
    it("is restarted on next subscription after completion", () => {
        let producer: SubscriptionObserver<number> | undefined;
        const startup = jest.fn();
        const teardown = jest.fn();
        const o = new SharedObservable<number>(subscriber => {
            startup();
            producer = subscriber;
            return teardown;
        });
        o.subscribe(() => {});
        startup.mockReset();
        if (producer != null) {
            producer.complete();
            expect(teardown).toHaveBeenCalledOnce();
            teardown.mockReset();
            o.subscribe(() => {});
            expect(startup).toHaveBeenCalledOnce();
        }
    });
});
