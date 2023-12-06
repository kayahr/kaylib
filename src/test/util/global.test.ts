/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalArgumentException } from "../../main/util/exception";
import { expose, global } from "../../main/util/global";

describe("global", () => {
    it("is the global context of the environment", () => {
        expect(global.Uint8Array).toBe(Uint8Array);
    });
    it("easily allows setting custom data by using Record typing", () => {
        global.customValue = 23;
        expect(global.customValue).toBe(23);
        delete global.customValue;
    });

    describe("expose", () => {
        it("registers a global value in root namespace", () => {
            expect(global.foobar).toBeUndefined();
            expose("foobar", 53);
            expect(global.foobar).toBe(53);
            delete global.foobar;
        });
        it("registers a global value in namespace", () => {
            expect((global.foo as Record<string, unknown>)?.bar).toBeUndefined();
            expose("foo.bar", 53);
            expect((global.foo as Record<string, unknown>).bar).toBe(53);
            delete global.foo;
        });
        it("registers a global value in nested namespace", () => {
            expect(((global.foo as Record<string, unknown>)?.bar as Record<string, unknown>)?.baz).toBeUndefined();
            expose("foo.bar.baz", 53);
            expect(((global.foo as Record<string, unknown>).bar as Record<string, unknown>).baz).toBe(53);
            delete global.foo;
        });
        it("registers a global value in existing namespace", () => {
            global.foo = { hey: 23 };
            expect((global.foo as Record<string, unknown>)?.bar).toBeUndefined();
            expose("foo.bar", 53);
            expect((global.foo as Record<string, unknown>).bar).toBe(53);
            expect((global.foo as Record<string, unknown>).hey).toBe(23);
            delete global.foo;
        });
        it("throws error when namespace or expose name is empty", () => {
            expect(() => expose("", 1)).toThrow(IllegalArgumentException);
            expect(() => expose(".foo", 1)).toThrow(IllegalArgumentException);
            expect(() => expose("foo.", 1)).toThrow(IllegalArgumentException);
            expect(() => expose("foo..bar", 1)).toThrow(IllegalArgumentException);
            delete global.foo;
        });
        it("registers a class in global namespace", () => {
            @expose("foo.Test")
            class Test {
                public test(): number {
                    return 23;
                }
            }
            expect((global.foo as Record<string, unknown>)?.Test).toBe(Test);
        });
    });
});
