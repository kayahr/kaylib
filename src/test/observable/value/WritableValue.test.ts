import { Dependencies } from "../../../main/observable/value/Dependencies";
import { Dependency } from "../../../main/observable/value/Dependency";
import { Value } from "../../../main/observable/value/Value";
import { writable, WritableValue } from "../../../main/observable/value/WritableValue";

class RecorderValue<T = unknown> extends Value<T> {
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
            expect(Array.from(recorder.dependencies)).toEqual([ new Dependency(value) ]);
            value.set(40);
            expect(recorder.get()).toBe(80);
            expect(Array.from(recorder.dependencies)).toEqual([ new Dependency(value) ]);
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
});

describe("writable", () => {
    it("is a shortcut function to create a WriteableValue", () => {
        const value = writable(2);
        expect(value).toBeInstanceOf(WritableValue);
        expect(value.get()).toBe(2);
    });
});
