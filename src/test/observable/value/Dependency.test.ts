import { AbstractValue } from "../../../main/observable/value/AbstractValue";
import { Dependency } from "../../../main/observable/value/Dependency";
import { WritableValue } from "../../../main/observable/value/WritableValue";
import { IllegalStateException } from "../../../main/util/exception";

class TestValue<T = unknown> extends AbstractValue<T> {
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
    describe("getValue", () => {
        it("returns the dependency value", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value);
            expect(dependency.getValue()).toBe(value);
        });
    });
    describe("getRecordVersion", () => {
        it("initially returns 0", () => {
            expect(new Dependency(new WritableValue(0)).getRecordVersion()).toBe(0);
        });
    });
    describe("updateRecordVersion", () => {
        it("updates the record version", () => {
            const dependency = new Dependency(new WritableValue(0));
            dependency.updateRecordVersion(2);
            expect(dependency.getRecordVersion()).toBe(2);
        });
    });
    describe("isValid", () => {
        it("returns true when dependency has same version as value and value is valid", () => {
            const value = new TestValue();
            const dependency = new Dependency(value);
            expect(dependency.isValid()).toBe(true);
        });
        it("returns false when dependency has not the same version as value", () => {
            const value = new TestValue();
            const dependency = new Dependency(value);
            value.incrementVersion();
            expect(dependency.isValid()).toBe(false);
        });
        it("returns false when value is not valid", () => {
            const value = new TestValue();
            const dependency = new Dependency(value);
            value.valid = false;
            expect(dependency.isValid()).toBe(false);
        });
    });
    describe("validate", () => {
        it("calls validate on the value", () => {
            const value = new TestValue();
            const spy = jest.spyOn(value, "validate");
            const dependency = new Dependency(value);
            dependency.validate();
            expect(spy).toHaveBeenCalledOnce();
        });
        it("returns false and does not call update method when value version did not change", () => {
            const value = new TestValue();
            const dependency = new Dependency(value);
            const spy = jest.spyOn(dependency, "update");
            expect(dependency.validate()).toBe(false);
            expect(spy).not.toHaveBeenCalled();
        });
        it("returns true and calls update method when value version did change", () => {
            const value = new TestValue();
            const dependency = new Dependency(value);
            value.incrementVersion();
            const spy = jest.spyOn(dependency, "update");
            expect(dependency.validate()).toBe(true);
            expect(spy).toHaveBeenCalledOnce();
        });
        it("brings dependency in a valid state when called after value has changed", () => {
            const value = new TestValue();
            const dependency = new Dependency(value);
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
            const dependency = new Dependency(value);
            const callback = jest.fn();
            dependency.watch(callback);
            expect(callback).toHaveBeenCalledOnce();
            callback.mockClear();
            value.set(1);
            expect(callback).toHaveBeenCalledOnce();
            callback.mockClear();
            value.set(2);
            value.set(2);
            expect(callback).toHaveBeenCalledOnce();
            callback.mockClear();
            value.set(1);
            expect(callback).toHaveBeenCalledOnce();
        });
        it("throws exception when already watching", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value);
            const callback = jest.fn();
            dependency.watch(callback);
            expect(() => dependency.watch(callback)).toThrowWithMessage(IllegalStateException, "Dependency is already watched");
        });
    });
    describe("unwatch", () => {
        it("stops a running value watcher", () => {
            const value = new WritableValue(2);
            const dependency = new Dependency(value);
            const callback = jest.fn();
            dependency.watch(callback);
            expect(callback).toHaveBeenCalledOnce();
            callback.mockClear();
            dependency.unwatch();
            value.set(1);
            expect(callback).not.toHaveBeenCalled();
        });
        it("throws exception when not watching", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value);
            expect(() => dependency.unwatch()).toThrowWithMessage(IllegalStateException, "Dependency is not watched");
        });
    });
    describe("isWatched", () => {
        it("returns false when dependency is not watched", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value);
            expect(dependency.isWatched()).toBe(false);
        });
        it("returns true when dependency is watched", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value);
            dependency.watch(() => {});
            expect(dependency.isWatched()).toBe(true);
        });
        it("returns false when dependency is no longer watched", () => {
            const value = new WritableValue(0);
            const dependency = new Dependency(value);
            dependency.watch(() => {});
            dependency.unwatch();
            expect(dependency.isWatched()).toBe(false);
        });
    });
});
