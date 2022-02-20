import { FastWeakMap } from "../../main/lang/FastWeakMap";
import { garbageCollect } from "../support/gc";

describe("FastWeakMap", () => {
    describe("constructor", () => {
        it("fills the map from give key/value pairs", () => {
            const o1 = {};
            const o2 = {};
            const map = new FastWeakMap([ [ o1, 1 ], [ o2, 2 ] ]);
            expect(map.get(o1)).toBe(1);
            expect(map.get(o2)).toBe(2);
        });
    });

    describe("has", () => {
        it("returns true if weak map knows the key", () => {
            const o = {};
            const map = new FastWeakMap();
            map.set(o, 1);
            expect(map.has(o)).toBe(true);
        });
        it("returns false if weak map doesn't know the key", () => {
            const map = new FastWeakMap();
            expect(map.has({})).toBe(false);
        });
    });

    describe("get", () => {
        it("returns the value associated with given key", () => {
            const o = {};
            const map = new FastWeakMap();
            map.set(o, 1);
            expect(map.get(o)).toBe(1);
        });
        it("returns undefined if weak map doesn't know the key", () => {
            const map = new FastWeakMap();
            expect(map.get({})).toBeUndefined();
        });
    });

    describe("set", () => {
        it("associates key with given value", () => {
            const o = {};
            const map = new FastWeakMap();
            map.set(o, 1);
            expect(map.get(o)).toBe(1);
            map.set(o, 2);
            expect(map.get(o)).toBe(2);
        });
    });

    describe("delete", () => {
        it("deletes the value for the given key", () => {
            const o = {};
            const map = new FastWeakMap();
            map.set(o, 1);
            expect(map.get(o)).toBe(1);
            expect(map.delete(o)).toBe(true);
            expect(map.has(o)).toBe(false);
            expect(map.get(o)).toBeUndefined();
        });
        it("returns false when to value is present to delete", () => {
            const map = new FastWeakMap();
            expect(map.delete({})).toBe(false);
        });
    });

    it("doesn't prevent keys from being garbage collected", async () => {
        let o: Object | null = {};
        const map = new WeakMap<Object, number>();
        map.set(o, 2);
        const ref = new WeakRef(o);
        o = null;
        await garbageCollect();
        expect(ref.deref()).toBeUndefined();
    });
});
