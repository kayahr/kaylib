import { computed,ComputedValue } from "../../../main/observable/value/ComputedValue";
import { WritableValue } from "../../../main/observable/value/WritableValue";

describe("ComputedValue", () => {
    describe("constructor", () => {
        it("does not call the compute function itself", () => {
            const compute = jest.fn();
            const value = new ComputedValue(compute);
            expect(value).toBeInstanceOf(ComputedValue);
            expect(compute).not.toHaveBeenCalled();
        });
    });
    describe("isValid", () => {
        it("returns true initially", () => {
            const a = new WritableValue(1);
            const b = new ComputedValue(() => a() * 2);
            expect(b.isValid()).toBe(true);
        });
        it("returns still true after first read", () => {
            const a = new WritableValue(3);
            const b = new ComputedValue(() => a() * 2);
            expect(b()).toBe(6);
            expect(b.isValid()).toBe(true);
        });
        it("returns false when input changes and true again after reading changed value", () => {
            const a = new WritableValue(3);
            const b = new ComputedValue(() => a() * 2);
            expect(b()).toBe(6);
            a.set(4);
            expect(b.isValid()).toBe(false);
            expect(b()).toBe(8);
            expect(b.isValid()).toBe(true);
        });
        it("returns false when input changes even when output would not change and true again after reading the value", () => {
            const a = new WritableValue(3);
            const b = new ComputedValue(() => a() < 10);
            expect(b()).toBe(true);
            a.set(4);
            expect(b.isValid()).toBe(false);
            expect(b()).toBe(true);
            expect(b.isValid()).toBe(true);
        });
    });
    describe("get", () => {
        it("calls the compute function initially without incrementing the version", () => {
            const compute = jest.fn(() => 53);
            const value = new ComputedValue(compute);
            expect(value.get()).toBe(53);
            expect(value.getVersion()).toBe(0);
            expect(compute).toHaveBeenCalledOnce();
        });
        it("calls the compute function again after a dependency has changed but does not update the version when value is the same", () => {
            const input = new WritableValue(1);
            const compute = jest.fn(() => input() < 10);
            const output = new ComputedValue(compute);
            expect(output.get()).toBe(true);
            expect(compute).toHaveBeenCalledOnce();
            input.set(2);
            expect(output.get()).toBe(true);
            expect(compute).toHaveBeenCalledTimes(2);
            expect(output.getVersion()).toBe(0);
        });
        it("calls the compute function again after a dependency has changed and increases the version when value has changed", () => {
            const input = new WritableValue(1);
            const compute = jest.fn(() => input() < 10);
            const output = new ComputedValue(compute);
            expect(output.get()).toBe(true);
            expect(compute).toHaveBeenCalledOnce();
            input.set(12);
            expect(output.get()).toBe(false);
            expect(compute).toHaveBeenCalledTimes(2);
            expect(output.getVersion()).toBe(1);
        });
        it("late-registers conditional dependencies", () => {
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const condition = new WritableValue(false);
            const output = new ComputedValue(() => (condition() ? a() : b()));
            expect(output.get()).toBe(2);
            b.set(3);
            expect(output.get()).toBe(3);
            condition.set(true);
            expect(output.get()).toBe(1);
            a.set(4);
            expect(output.get()).toBe(4);
        });
    });
    describe("subscribe", () => {
        it("computes value on subscription (required to build dependency tree)", () => {
            const compute = jest.fn();
            const value = new ComputedValue(compute);
            value.subscribe(() => {});
            expect(compute).toHaveBeenCalledOnce();
        });
    });
    it("informs subscribers when value changes because a dependency changed", () => {
        const input = new WritableValue(1);
        const output = new ComputedValue(() => input() * 2);
        const fn = jest.fn();
        output.subscribe(fn);
        fn.mockClear();
        input.set(2);
        expect(fn).toHaveBeenCalledExactlyOnceWith(4);
        fn.mockClear();
        input.set(3);
        expect(fn).toHaveBeenCalledExactlyOnceWith(6);
    });
    it("informs subscribers when a value changes which is registered late because of conditional dependencies", () => {
        const a = new WritableValue(1);
        const b = new WritableValue(2);
        const condition = new WritableValue(false);
        const output = new ComputedValue(() => (condition() ? a() : b()));
        const fn = jest.fn();
        output.subscribe(fn);
        fn.mockClear();
        b.set(3);
        expect(fn).toHaveBeenCalledExactlyOnceWith(3);
        fn.mockClear();
        condition.set(true);
        expect(fn).toHaveBeenCalledExactlyOnceWith(1);
        fn.mockClear();
        a.set(4);
        expect(fn).toHaveBeenCalledExactlyOnceWith(4);
    });
});

describe("computed", () => {
    it("is a shortcut function to create a ComputedValue", () => {
        const value = computed(() => 3);
        expect(value).toBeInstanceOf(ComputedValue);
        expect(value.get()).toBe(3);
    });
});
