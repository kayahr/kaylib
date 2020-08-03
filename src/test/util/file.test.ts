import { dirSeparator, normalizePath, pathSeparator } from "../../main/util/file";
import { isNodeJS, isWindows } from "../../main/util/runtime";

describe("file", () => {
    describe("dirSeparator", () => {
        it("is backslash on Windows NodeJS, slash on other OS", () => {
            expect(dirSeparator).toBe(isNodeJS() && isWindows() ? "\\" : "/");
        });
    });

    describe("pathSeparator", () => {
        it("is semicolon on Windows NodeJS, colon on other OS", () => {
            expect(pathSeparator).toBe(isNodeJS() && isWindows() ? ";" : ":");
        });
    });

    describe("normalizePath", () => {
        it("normalizes a path", () => {
            expect(normalizePath("")).toBe(".");
            expect(normalizePath(".")).toBe(".");
            expect(normalizePath("/")).toBe("/");
            expect(normalizePath("./")).toBe("./");
            expect(normalizePath("///")).toBe("/");
            expect(normalizePath("///test///")).toBe("/test/");
            expect(normalizePath("//./test//./")).toBe("/test/");
            expect(normalizePath("/../../test")).toBe("/test");
            expect(normalizePath("/../../test/")).toBe("/test/");
            expect(normalizePath("../../test/")).toBe("../../test/");
            expect(normalizePath("../../test")).toBe("../../test");
            expect(normalizePath("a//b///c////d")).toBe("a/b/c/d");
            expect(normalizePath("a/../b/../c/..")).toBe(".");
            expect(normalizePath("a/../b/../c/../")).toBe("./");
            expect(normalizePath("/a/../b/../c/../")).toBe("/");
            expect(normalizePath("/a/b/c/../../d/e/../f/")).toBe("/a/d/f/");
        });
    });
});
