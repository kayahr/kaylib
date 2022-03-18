import { Value } from "../../main/observable/Value";

describe("Value", () => {
    describe("set", () => {
        it("sets new value and informs subscribers", () => {
            const value = new Value(23);
            const fn1 = jest.fn();
            value.subscribe(fn1);
            const fn2 = jest.fn();
            value.subscribe(fn2);
            value.set(34);
            expect(value.get()).toBe(34);
            expect(fn1).toHaveBeenCalledOnce();
            expect(fn1).toHaveBeenCalledWith(34);
            expect(fn2).toHaveBeenCalledOnce();
            expect(fn2).toHaveBeenCalledWith(34);
        });
        it("does not inform subscribers when value did not change", () => {
            const value = new Value(23);
            const fn = jest.fn();
            value.subscribe(fn);
            value.set(23);
            expect(value.get()).toBe(23);
            expect(fn).not.toHaveBeenCalled();
        });
        it("just sets value when last subscriber has been unsubscribed", () => {
            const value = new Value(23);
            const fn = jest.fn();
            const sub = value.subscribe(fn);
            sub.unsubscribe();
            value.set(23);
            expect(value.get()).toBe(23);
            expect(fn).not.toHaveBeenCalled();
        });
    });
});
