import { from } from "rxjs";

import { ReadonlyValue } from "../../../main/observable/value/ReadonlyValue";
import { WritableValue } from "../../../main/observable/value/WritableValue";

describe("ReadonlyValue", () => {
    it("can be called as a getter function", () => {
        const value = new ReadonlyValue(new WritableValue(20));
        expect(value()).toBe(20);
    });
    it("can be observed via RxJS for changes on the wrapped value", () => {
        const a = new WritableValue(10);
        const b = new ReadonlyValue(a);
        const fn = jest.fn();
        from(b).subscribe(fn);
        expect(fn).toHaveBeenCalledExactlyOnceWith(10);
        fn.mockClear();
        a.set(20);
        expect(fn).toHaveBeenCalledExactlyOnceWith(20);
    });
    it("can be observed for changes on the wrapped value", () => {
        const a = new WritableValue(10);
        const b = new ReadonlyValue(a);
        const fn = jest.fn();
        b.subscribe(fn);
        expect(fn).toHaveBeenCalledExactlyOnceWith(10);
        fn.mockClear();
        a.set(20);
        expect(fn).toHaveBeenCalledExactlyOnceWith(20);
    });
    describe("[Symbol.observable]", () => {
        it("forwards to wrapped value", () => {
            const a = new WritableValue(10);
            const b = new ReadonlyValue(a);
            expect(b[Symbol.observable]()).toBe(a[Symbol.observable]());
        });
    });
    describe("@@observable", () => {
        it("forwards to wrapped value", () => {
            const a = new WritableValue(10);
            const b = new ReadonlyValue(a);
            expect(b["@@observable"]()).toBe(a["@@observable"]());
        });
    });
    describe("getVersion", () => {
        it("forwards to wrapped value", () => {
            const a = new WritableValue(1);
            const b = new ReadonlyValue(a);
            expect(b.getVersion()).toBe(0);
            a.set(2);
            expect(b.getVersion()).toBe(1);
        });
    });
    describe("isWatched", () => {
        it("forwards to wrapped value", () => {
            const a = new WritableValue(1);
            const b = new ReadonlyValue(a);
            expect(b.isWatched()).toBe(false);
            a.subscribe(() => {});
            expect(b.isWatched()).toBe(true);
        });
    });
    describe("get", () => {
        it("forwards to wrapped value", () => {
            const a = new WritableValue(1);
            const b = new ReadonlyValue(a);
            expect(b.get()).toBe(1);
            a.set(2);
            expect(b.get()).toBe(2);
        });
    });
    describe("isValid", () => {
        it("forwards to wrapped value", () => {
            const a = new WritableValue(1);
            const b = new ReadonlyValue(a);
            const spy = jest.spyOn(a, "isValid");
            expect(b.isValid()).toBe(true);
            expect(spy).toHaveBeenCalledOnce();
        });
    });
    describe("validate", () => {
        it("forwards to wrapped value", () => {
            const a = new WritableValue(1);
            const b = new ReadonlyValue(a);
            const spy = jest.spyOn(a, "validate");
            b.validate();
            expect(spy).toHaveBeenCalledOnce();
        });
    });
});
