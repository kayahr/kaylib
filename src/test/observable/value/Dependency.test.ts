import { Dependency } from "../../../main/observable/value/Dependency";
import { Value } from "../../../main/observable/value/Value";
import { WritableValue } from "../../../main/observable/value/WritableValue";
import { IllegalStateException } from "../../../main/util/exception";

class TestValue<T = unknown> extends Value<T> {
    public valid = true;
    public override isValid(): boolean {
        return this.valid;
    }
    public override validate(): void {
    }
    public override get(): T {
        throw new Error("Method not implemented.");
    }
    public override incrementVersion(): void {
        super.incrementVersion();
    }
}

describe("Dependency", () => {
    describe("isValid", () => {
        it("returns true when dependency has same version as value and value is valid", () => {
            const value = new TestValue();
            const dependency = new Dependency(value, value);
            expect(dependency.isValid()).toBe(true);
        });
        it("returns false when dependency has not the same version as value", () => {
            const value = new TestValue();
            const dependency = new Dependency(value, value);
            value.incrementVersion();
            expect(dependency.isValid()).toBe(false);
        });
        it("returns false when value is not valid", () => {
            const value = new TestValue();
            const dependency = new Dependency(value, value);
            value.valid = false;
            expect(dependency.isValid()).toBe(false);
        });
    });
    describe("validate", () => {
        it("calls validate on the value", () => {
            const value = new TestValue();
            const spy = jest.spyOn(value, "validate");
            const dependency = new Dependency(value, value);
            dependency.validate();
            expect(spy).toHaveBeenCalledOnce();
        });
        it("returns false and does not call update method when value version did not change", () => {
            const value = new TestValue();
            const dependency = new Dependency(value, value);
            const spy = jest.spyOn(dependency, "update");
            expect(dependency.validate()).toBe(false);
            expect(spy).not.toHaveBeenCalled();
        });
        it("returns true and calls update method when value version did change", () => {
            const value = new TestValue();
            const dependency = new Dependency(value, value);
            value.incrementVersion();
            const spy = jest.spyOn(dependency, "update");
            expect(dependency.validate()).toBe(true);
            expect(spy).toHaveBeenCalledOnce();
        });
        it("brings dependency in a valid state when called after value has changed", () => {
            const value = new TestValue();
            const dependency = new Dependency(value, value);
            value.incrementVersion();
            expect(dependency.isValid()).toBe(false);
            expect(dependency.validate()).toBe(true);
            expect(dependency.isValid()).toBe(true);
            expect(dependency.validate()).toBe(false);
        });
    });
    describe("watch", () => {
        it("starts monitoring the value and calls given callback on change", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value, value);
            const callback = jest.fn();
            dependency.watch(callback);
            value.set(1);
            expect(callback).toHaveBeenCalledTimes(1);
            value.set(2);
            value.set(2);
            expect(callback).toHaveBeenCalledTimes(2);
            value.set(1);
            expect(callback).toHaveBeenCalledTimes(3);
        });
        it("throws exception when already watching", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value, value);
            const callback = jest.fn();
            dependency.watch(callback);
            expect(() => dependency.watch(callback)).toThrowWithMessage(IllegalStateException, "Dependency is already watched");
        });
    });
    describe("unwatch", () => {
        it("stops a running value watcher", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value, value);
            const callback = jest.fn();
            dependency.watch(callback);
            dependency.unwatch();
            value.set(1);
            expect(callback).not.toHaveBeenCalled();
        });
        it("throws exception when not watching", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value, value);
            expect(() => dependency.unwatch()).toThrowWithMessage(IllegalStateException, "Dependency is not watched");
        });
    });
});
