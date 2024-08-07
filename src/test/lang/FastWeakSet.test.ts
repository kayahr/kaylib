import { FastWeakSet } from "../../main/lang/FastWeakSet";
import { garbageCollect } from "../support/gc";

describe("FastWeakSet", () => {
    describe("constructor", () => {
        it("fills the set from given values", () => {
            const o1 = {};
            const o2 = {};
            const set = new FastWeakSet([ o1, o2 ]);
            expect(set.has(o1)).toBe(true);
            expect(set.has(o2)).toBe(true);
        });
    });

    describe("has", () => {
        it("returns true if weak set knows the value", () => {
            const o = {};
            const set = new FastWeakSet();
            set.add(o);
            expect(set.has(o)).toBe(true);
        });
        it("returns false if weak set doesn't know the key", () => {
            const set = new FastWeakSet();
            expect(set.has({})).toBe(false);
        });
    });

    describe("add", () => {
        it("adds value to the set", () => {
            const o = {};
            const set = new FastWeakSet();
            set.add(o);
            expect(set.has(o)).toBe(true);
            set.add(o);
            expect(set.has(o)).toBe(true);
        });
    });

    describe("delete", () => {
        it("deletes the value from the set", () => {
            const o = {};
            const set = new FastWeakSet();
            set.add(o);
            expect(set.has(o)).toBe(true);
            expect(set.delete(o)).toBe(true);
            expect(set.has(o)).toBe(false);
        });
        it("returns false when to value is present to delete", () => {
            const set = new FastWeakSet();
            expect(set.delete({})).toBe(false);
        });
    });

    it("doesn't prevent values from being garbage collected", async () => {
        let o: object | null = {};
        const set = new WeakSet();
        set.add(o);
        const ref = new WeakRef(o);
        o = null;
        await garbageCollect();
        expect(ref.deref()).toBeUndefined();
    });
});
