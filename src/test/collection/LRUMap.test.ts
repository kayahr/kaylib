import { LRUMap } from "../../main/collection/LRUMap";

describe("LRUMap", () => {
    it("is iterable", () => {
        const entries = [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ] as const;
        const map = new LRUMap(10, entries);
        let index = 0;
        for (const entry of map) {
            expect(entry).toEqual(entries[index]);
            index++;
        }
    });

    describe("constructor", () => {
        it("creates LRUMap with given maximum size", () => {
            const map = new LRUMap(10);
            expect(map.getMaxSize()).toBe(10);
            expect(map.size).toBe(0);
        });
        it("creates LRUMap with given maximum size and initial entries", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ] ]);
            expect(map.getMaxSize()).toBe(10);
            expect(map.size).toBe(2);
            expect(map.get("a")).toBe(1);
            expect(map.get("b")).toBe(2);
        });
    });

    describe("toString", () => {
        it("returns the correct class name", () => {
            expect(new LRUMap(10).toString()).toBe("[object LRUMap]");
        });
    });

    describe("clear", () => {
        it("clears the map", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ] ]);
            expect(map.size).toBe(2);
            map.clear();
            expect(map.size).toBe(0);
        });
    });

    describe("delete", () => {
        it("deletes the given entry", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ], [ "d", 4 ] ]);
            map.delete("b");
            expect(map.get("a")).toBe(1);
            expect(map.get("b")).toBeUndefined();
            expect(map.get("c")).toBe(3);
            expect(map.get("d")).toBe(4);
            map.delete("d");
            expect(map.get("a")).toBe(1);
            expect(map.get("c")).toBe(3);
            expect(map.get("d")).toBeUndefined();
            map.delete("a");
            expect(map.get("a")).toBeUndefined();
            expect(map.get("c")).toBe(3);
            map.delete("c");
            expect(map.get("c")).toBeUndefined();
        });
    });

    describe("forEach", () => {
        it("iterates over entries in initial order when not touched", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ], [ "d", 4 ] ]);
            const values: number[] = [];
            map.forEach(value => values.push(value));
            expect(values).toEqual([ 1, 2, 3, 4 ]);
        });
        it("iterates over entries in touched order", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ], [ "d", 4 ] ]);
            map.get("a");
            map.get("c");
            const values: number[] = [];
            map.forEach(value => values.push(value));
            expect(values).toEqual([ 2, 4, 1, 3 ]);
        });
    });

    describe("has", () => {
        it("checks if map has given key", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]);
            expect(map.has("a")).toBe(true);
            expect(map.has("b")).toBe(true);
            expect(map.has("c")).toBe(true);
            expect(map.has("d")).toBe(false);
        });
        it("touches the checked entry", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]);
            map.has("b");
            const values: number[] = [];
            map.forEach(value => values.push(value));
            expect(values).toEqual([ 1, 3, 2 ]);
        });
    });

    describe("get", () => {
        it("returns value or undefined if key not found", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]);
            expect(map.get("a")).toBe(1);
            expect(map.get("b")).toBe(2);
            expect(map.get("c")).toBe(3);
            expect(map.get("d")).toBeUndefined();
        });
        it("touches the entry", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]);
            map.get("b");
            const values: number[] = [];
            map.forEach(value => values.push(value));
            expect(values).toEqual([ 1, 3, 2 ]);
        });
    });

    describe("set", () => {
        it("adds a new entry", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ] ]);
            map.set("d", 4);
            expect(map.size).toBe(3);
            expect(map.get("d")).toBe(4);
        });
        it("replaces and touches an existing entry", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]);
            map.set("b", 22);
            expect(map.size).toBe(3);
            expect(map.get("b")).toBe(22);
            const values: number[] = [];
            map.forEach(value => values.push(value));
            expect(values).toEqual([ 1, 3, 22 ]);
        });
        it("removes least-used entries when max size is exceeded", () => {
            const map = new LRUMap(3, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]);
            map.get("a");
            map.set("d", 4);
            expect(map.has("a")).toBe(true);
            expect(map.has("b")).toBe(false);
            expect(map.has("c")).toBe(true);
            expect(map.has("d")).toBe(true);
        });
    });

    describe("entries", () => {
        it("returns an iterator over the map entries", () => {
            const entries = [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ] as const;
            const map = new LRUMap(10, entries);
            let index = 0;
            for (const entry of map.entries()) {
                expect(entry).toEqual(entries[index]);
                index++;
            }
        });
        it("iterates over entries in touched order", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ], [ "d", 4 ] ]);
            map.get("a");
            map.get("c");
            const values: number[] = [];
            for (const entry of map.entries()) {
                values.push(entry[1]);
            }
            expect(values).toEqual([ 2, 4, 1, 3 ]);
        });
    });

    describe("values", () => {
        it("returns an iterator over the map values", () => {
            const entries = [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ] as const;
            const map = new LRUMap(10, entries);
            let index = 0;
            for (const value of map.values()) {
                expect(value).toEqual(entries[index][1]);
                index++;
            }
        });
        it("iterates over values in touched order", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ], [ "d", 4 ] ]);
            map.get("a");
            map.get("c");
            const values: number[] = [];
            for (const value of map.values()) {
                values.push(value);
            }
            expect(values).toEqual([ 2, 4, 1, 3 ]);
        });
    });

    describe("keys", () => {
        it("returns an iterator over the map keys", () => {
            const entries = [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ] as const;
            const map = new LRUMap(10, entries);
            let index = 0;
            for (const key of map.keys()) {
                expect(key).toEqual(entries[index][0]);
                index++;
            }
        });
        it("iterates over keys in touched order", () => {
            const map = new LRUMap(10, [ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ], [ "d", 4 ] ]);
            map.get("a");
            map.get("c");
            const keys: string[] = [];
            for (const key of map.keys()) {
                keys.push(key);
            }
            expect(keys).toEqual([ "b", "d", "a", "c" ]);
        });
    });
});
