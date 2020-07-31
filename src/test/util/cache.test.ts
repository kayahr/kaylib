import { cacheResult, createCacheKey, createJoinedCacheKey } from "../../main/util/cache";

describe("cache", () => {
    describe("createCacheKey", () => {
        it("returns JSON representation with prefix 'p' for primitive values", () => {
            expect(createCacheKey("123")).toBe('p"123"');
            expect(createCacheKey(123)).toBe("p123");
            expect(createCacheKey(true)).toBe("ptrue");
            expect(createCacheKey(false)).toBe("pfalse");
        });
        it("returns 'n' for null", () => {
            expect(createCacheKey(null)).toBe("n");
        });
        it("returns 'u' for undefined", () => {
            expect(createCacheKey(undefined)).toBe("u");
        });
        it("returns object id with prefix 'o' for objects", () => {
            expect(createCacheKey({})).toMatch(/^o-?[0-9a-z]+$/);
            expect(createCacheKey([])).toMatch(/^o-?[0-9a-z]+$/);
        });
    });

    describe("createJoinedCacheKey", () => {
        it("return joined cache key for given values", () => {
            expect(createJoinedCacheKey([ null, undefined, {}, [], "foo", 123, true, false ])).toMatch(
                /^n:u:o-?[0-9a-z]+:o-?[0-9a-z]+:p"foo":p123:ptrue:pfalse$/);
        });
    });

    describe("cacheResult decorator", () => {
        it("caches the result of a method until cache is cleared", () => {
            class Test {
                @cacheResult
                public getFoo(): number[] {
                    return [ 1, 2, 3 ];
                }

                @cacheResult
                public getBar(): { a: number } {
                    return { a: 23 };
                }
            }

            const test = new Test();
            const foo = test.getFoo();
            const bar = test.getBar();
            expect(foo).toEqual([ 1, 2, 3 ]);
            expect(bar).toEqual({ a: 23 });
            expect(test.getFoo()).toBe(foo);
            expect(test.getBar()).toBe(bar);
            delete test.getFoo;
            const foo2 = test.getFoo();
            expect(foo2).toEqual(foo);
            expect(foo2).not.toBe(foo);
        });
    });
});
