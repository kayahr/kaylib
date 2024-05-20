import { ComputedValue } from "../../../main/observable/value/ComputedValue";
import { Dependencies, untracked } from "../../../main/observable/value/Dependencies";
import { WritableValue } from "../../../main/observable/value/WritableValue";

describe("Dependencies", () => {
    it("starts with empty dependency list", () => {
        expect(Array.from(new Dependencies(new WritableValue(0)))).toEqual([]);
    });
    describe("isValid", () => {
        it("returns true when there are no dependencies", () => {
            expect(new Dependencies(new WritableValue(0)).isValid()).toBe(true);
        });
        it("returns true when all dependency are valid", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => a() + b());
            expect(dependencies.isValid()).toBe(true);
        });
        it("returns false when at least one dependency is invalid and true again after validation", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => a() + b());
            a.set(3);
            expect(dependencies.isValid()).toBe(false);
            dependencies.validate();
            expect(dependencies.isValid()).toBe(true);
        });
    });
    describe("validate", () => {
        it("returns false when there are no dependencies", () => {
            expect(new Dependencies(new WritableValue(0)).validate()).toBe(false);
        });
        it("returns false when no dependency was updated", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => a() + b());
            a.set(1); // Same value as before so no update
            expect(dependencies.validate()).toBe(false);
        });
        it("returns true when at least one dependency was updated and false again on next validation", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => a() + b());
            b.set(5);
            expect(dependencies.validate()).toBe(true);
            expect(dependencies.validate()).toBe(false);
        });
    });
    describe("watch", () => {
        it("calls the owners getter", () => {
            const owner = new WritableValue(0);
            const dependencies = new Dependencies(owner);
            const spy = jest.spyOn(owner, "get");
            dependencies.watch();
            expect(spy).toHaveBeenCalledOnce();
        });
        it("starts watching the current dependencies to call the owners getter when changed", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => b() + a());
            dependencies.watch();
            expect(owner.isWatched()).toBe(false);
            expect(a.isWatched()).toBe(true);
            expect(b.isWatched()).toBe(true);
            const spy = jest.spyOn(owner, "get");
            a.set(3);
            expect(spy).toHaveBeenCalledOnce();
            spy.mockClear();
            b.set(4);
            expect(spy).toHaveBeenCalledOnce();
        });
    });
    describe("unwatch", () => {
        it("stops watching the current dependencies", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => b() + a());
            dependencies.watch();
            dependencies.unwatch();
            expect(a.isWatched()).toBe(false);
            expect(b.isWatched()).toBe(false);
            const spy = jest.spyOn(owner, "get");
            a.set(3);
            b.set(4);
            expect(spy).not.toHaveBeenCalled();
        });
    });
    describe("record", () => {
        it("records dependencies", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => b() + a());
            expect(Array.from(dependencies).map(d => d.getValue())).toEqual([ b, a ]);
        });
        it("records late dependencies", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => a());
            expect(Array.from(dependencies).map(d => d.getValue())).toEqual([ a ]);
            dependencies.record(() => a() + b());
            expect(Array.from(dependencies).map(d => d.getValue())).toEqual([ a, b ]);
        });
        it("removes no-longer-used dependencies", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => a() + b());
            expect(Array.from(dependencies).map(d => d.getValue())).toEqual([ a, b ]);
            dependencies.record(() => b());
            expect(Array.from(dependencies).map(d => d.getValue())).toEqual([ b ]);
            dependencies.record(() => 23);
            expect(Array.from(dependencies).map(d => d.getValue())).toEqual([]);
        });
        it("watches late dependencies when owner is watched", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => a());
            owner.subscribe(() => {});
            dependencies.watch();
            expect(a.isWatched()).toBe(true);
            expect(b.isWatched()).toBe(false);
            dependencies.record(() => a() + b());
            expect(a.isWatched()).toBe(true);
            expect(b.isWatched()).toBe(true);
            const spy = jest.spyOn(owner, "get");
            b.set(4);
            expect(spy).toHaveBeenCalledOnce();
        });
        it("un-watches no-longer-used dependencies", () => {
            const owner = new WritableValue(0);
            const a = new WritableValue(1);
            const b = new WritableValue(2);
            const dependencies = new Dependencies(owner);
            dependencies.record(() => a() + b());
            owner.subscribe(() => {});
            dependencies.watch();
            expect(a.isWatched()).toBe(true);
            expect(b.isWatched()).toBe(true);
            dependencies.record(() => a());
            expect(a.isWatched()).toBe(true);
            expect(b.isWatched()).toBe(false);
            const spy = jest.spyOn(owner, "get");
            b.set(4);
            expect(spy).not.toHaveBeenCalled();
            a.set(4);
            expect(spy).toHaveBeenCalledOnce();
        });
    });
});

describe("untracked", () => {
    it("prevents tracking a value as dependency", () => {
        const a = new WritableValue(1);
        const b = new WritableValue(2);
        const c = new ComputedValue(() => untracked(a) + b());
        expect(c.get()).toBe(3);
        a.set(10);
        expect(c.get()).toBe(3);
        b.set(100);
        expect(c.get()).toBe(110);
    });
    it("prevents tracking the values in a function as dependency", () => {
        const a = new WritableValue(1);
        const b = new WritableValue(2);
        const c = new ComputedValue(() => untracked(() => a()) + b());
        expect(c.get()).toBe(3);
        a.set(10);
        expect(c.get()).toBe(3);
        b.set(100);
        expect(c.get()).toBe(110);
    });
});
