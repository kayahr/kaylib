import "@kayahr/jest-matchers";

import { from } from "rxjs";

import { AbstractValue } from "../../../main/observable/value/AbstractValue";
import { Dependencies } from "../../../main/observable/value/Dependencies";
import { ReadonlyValue } from "../../../main/observable/value/ReadonlyValue";
import { writable, WritableValue } from "../../../main/observable/value/WritableValue";

class RecorderValue<T = unknown> extends AbstractValue<T> {
    public dependencies = new Dependencies(this);
    public constructor(public readonly func: () => T) {
        super();
    }
    public override isValid(): boolean {
        throw new Error("Method not implemented.");
    }
    public override validate(): void {
        throw new Error("Method not implemented.");
    }
    public override get(): T {
        return this.dependencies.record(this.func);
    }
}
describe("WritableValue", () => {
    it("can be called as a getter function", () => {
        const value = new WritableValue(20);
        expect(value()).toBe(20);
    });
    it("can be observed via RxJS for changes on the wrapped value", () => {
        const a = new WritableValue(10);
        const fn = jest.fn();
        from(a).subscribe(fn);
        expect(fn).toHaveBeenCalledExactlyOnceWith(10);
        fn.mockClear();
        a.set(20);
        expect(fn).toHaveBeenCalledExactlyOnceWith(20);
    });
    describe("get", () => {
        it("returns the initial value passed to constructor", () => {
            expect(new WritableValue(53).get()).toBe(53);
        });
        it("returns the last value set via setter", () => {
            const value = new WritableValue(53);
            value.set(2);
            expect(value.get()).toBe(2);
            value.set(3);
            expect(value.get()).toBe(3);
        });
        it("registers and updates the value as dependency", () => {
            const value = new WritableValue(10);
            value.set(30);
            const recorder = new RecorderValue(() => value() * 2);
            expect(recorder.get()).toBe(60);
            expect(Array.from(recorder.dependencies).map(d => d.getValue())).toEqual([ value ]);
            value.set(40);
            expect(recorder.get()).toBe(80);
            expect(Array.from(recorder.dependencies).map(d => d.getValue())).toEqual([ value ]);
        });
    });
    describe("isValid", () => {
        it("always returns true", () => {
            const value = new WritableValue(53);
            expect(value.isValid()).toBe(true);
            value.set(2);
            expect(value.isValid()).toBe(true);
        });
    });
    describe("validate", () => {
        it("does nothing", () => {
            expect(() => new WritableValue(53).validate()).not.toThrow();
        });
    });
    describe("isWatched", () => {
        it("returns false when there is none subscriber", () => {
            const value = new WritableValue(0);
            expect(value.isWatched()).toBe(false);
        });
        it("returns true when there is at least one subscriber", () => {
            const value = new WritableValue(1);
            value.subscribe(() => {});
            expect(value.isWatched()).toBe(true);
        });
        it("returns false after last subscriber unsubscribes", () => {
            const value = new WritableValue(2);
            const sub1 = value.subscribe(() => {});
            const sub2 = value.subscribe(() => {});
            sub1.unsubscribe();
            expect(value.isWatched()).toBe(true);
            sub2.unsubscribe();
            expect(value.isWatched()).toBe(false);
        });
    });
    it("is garbage collected correctly when no longer referenced", async () => {
        let a: WritableValue | null = new WritableValue(1);
        expect(a()).toBe(1);
        await expect(new WeakRef(a)).toBeGarbageCollected(() => { a = null; });
    });
    it("is garbage collected correctly after last observer is unsubscribed", async () => {
        let a: WritableValue | null = new WritableValue(1);
        expect(a()).toBe(1);
        a.subscribe(() => {}).unsubscribe();
        await expect(new WeakRef(a)).toBeGarbageCollected(() => { a = null; });
    });
    describe("set", () => {
        it("sets a new value", () => {
            const value = new WritableValue(1);
            value.set(2);
            expect(value.get()).toBe(2);
        });
        it("increases the version when setting a new value", () => {
            const value = new WritableValue(1);
            expect(value.getVersion()).toBe(0);
            value.set(2);
            expect(value.getVersion()).toBe(1);
        });
        it("notifies subscribers when setting a new value", () => {
            const value = new WritableValue(1);
            const fn = jest.fn();
            value.subscribe(fn);
            expect(fn).toHaveBeenCalledExactlyOnceWith(1);
            fn.mockClear();
            value.set(2);
            expect(fn).toHaveBeenCalledExactlyOnceWith(2);
        });
        it("does not increase the version when setting the same value", () => {
            const value = new WritableValue(1);
            expect(value.getVersion()).toBe(0);
            value.set(1);
            expect(value.getVersion()).toBe(0);
        });
        it("does not notify subscribers when setting the same value", () => {
            const value = new WritableValue(1);
            const fn = jest.fn();
            value.subscribe(fn);
            expect(fn).toHaveBeenCalledExactlyOnceWith(1);
            fn.mockClear();
            value.set(1);
            expect(fn).not.toHaveBeenCalled();
        });
    });
    describe("update", () => {
        it("updates the value", () => {
            const value = new WritableValue(1);
            value.update(v => v + 2);
            expect(value.get()).toBe(3);
        });
        it("increases the version when value was updated", () => {
            const value = new WritableValue(1);
            expect(value.getVersion()).toBe(0);
            value.update(v => v - 10);
            expect(value.getVersion()).toBe(1);
        });
        it("notifies subscribers when value was updated", () => {
            const value = new WritableValue(1);
            const fn = jest.fn();
            value.subscribe(fn);
            expect(fn).toHaveBeenCalledExactlyOnceWith(1);
            fn.mockClear();
            value.update(() => 2);
            expect(fn).toHaveBeenCalledExactlyOnceWith(2);
        });
        it("does not increase the version when value was not updated", () => {
            const value = new WritableValue(1);
            expect(value.getVersion()).toBe(0);
            value.update(() => 1);
            expect(value.getVersion()).toBe(0);
        });
        it("does not notify subscribers when value was not updated", () => {
            const value = new WritableValue(1);
            const fn = jest.fn();
            value.subscribe(fn);
            expect(fn).toHaveBeenCalledExactlyOnceWith(1);
            fn.mockClear();
            value.update(v => v * 1);
            expect(fn).not.toHaveBeenCalled();
        });
    });
    describe("asReadonly", () => {
        it("returns readonly wrapper", () => {
            const value = new WritableValue(2);
            const ro = value.asReadonly();
            expect(ro).toBeInstanceOf(ReadonlyValue);
            expect(ro.get()).toBe(2);
        });
    });
});

describe("writable", () => {
    it("is a shortcut function to create a WriteableValue", () => {
        const value = writable(2);
        expect(value).toBeInstanceOf(WritableValue);
        expect(value.get()).toBe(2);
    });
});
