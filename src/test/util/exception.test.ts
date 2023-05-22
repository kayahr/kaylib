/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { getStackTrace, IllegalArgumentException, IllegalStateException } from "../../main/util/exception";

describe("exception", () => {
    describe("Exception", () => {
        it("sets correct exception name", () => {
            const e = new IllegalArgumentException("foo");
            expect(e.name).toBe("IllegalArgumentException");
        });
        it("sets correct exception message", () => {
            const e = new IllegalArgumentException("error message");
            expect(e.message).toBe("error message");
        });
        it("sets correct prototype", () => {
            const e = new IllegalArgumentException("foo");
            expect(e).toBeInstanceOf(IllegalArgumentException);
            expect(e).toBeInstanceOf(Error);
            expect(e).toBeInstanceOf(Object);
        });
        it("has cause set to null if not specified", () => {
            const e = new IllegalArgumentException("foo");
            expect(e.cause).toBeUndefined();
        });
        it("supports a root cause", () => {
            const cause = new IllegalStateException("illegal state");
            const e = new IllegalArgumentException("illegal arg", { cause });
            expect(e.cause).toBe(cause);
        });
        it("supports any value as root cause", () => {
            const e = new IllegalArgumentException("illegal arg", { cause: 23 });
            expect(e.cause).toBe(23);
        });
    });

    describe("getStackTrace", () => {
        it("returns stack trace for given exception", () => {
            const e = new IllegalArgumentException("foo");
            expect(getStackTrace(e)).toMatch(/^IllegalArgumentException: foo\n\s+at /);
        });
        it("returns stack trace for given exception with root causes", () => {
            const e = new IllegalArgumentException("foo", { cause: new IllegalStateException("bar", { cause: 23 }) });
            const stack = getStackTrace(e);
            expect(stack).toMatch(/^IllegalArgumentException: foo\n\s+at /);
            expect(stack).toMatch(/^Caused by: IllegalStateException: bar\n\s+at /m);
            expect(stack).toMatch(/^Caused by: 23$/m);
        });
        it("Uses error name and message if stack trace is missing in error", () => {
            const e = new Error("foo bar");
            e.stack = undefined;
            expect(getStackTrace(e)).toBe("Error: foo bar");
        });
    });
});
