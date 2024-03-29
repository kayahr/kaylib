import { throwError, toError } from "../../main/util/error";

describe("error", () => {
    describe("toError", () => {
        it("returns error as-is", () => {
            const e = new Error("test");
            expect(toError(e)).toBe(e);
        });
        it("returns new error with given value as message", () => {
            expect(toError("Test")).toEqual(new Error("Test"));
            expect(toError(2)).toEqual(new Error("2"));
            expect(toError(null)).toEqual(new Error("null"));
        });
    });
    describe("throwError", () => {
        it("throws the given error", () => {
            const error = new Error("Bam!");
            expect(() => throwError(error)).toThrow(error);
        });
    });
});
