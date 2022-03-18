import { bind, pipe, pipeWith, weakBind, weakFunctionDestroyedException } from "../../main/util/function";
import { garbageCollect } from "../support/gc";

describe("function", () => {
    describe("bind", () => {
        it("binds a function to a scope", () => {
            function func(this: object): object {
                return this;
            }
            const scope = {};
            const bound = bind(func, scope);
            expect(bound()).toBe(scope);
        });
        it("supports parameters", () => {
            function func(a: number, b: number): number {
                return a + b;
            }
            const scope = {};
            const bound = bind(func, scope);
            expect(bound(2, 3)).toBe(5);
        });
        it("returns different bound functions for different combinations of function and scope", () => {
            function func1(): void {}
            function func2(): void {}
            const scope1 = {};
            const scope2 = {};
            const bound1 = bind(func1, scope1);
            const bound2 = bind(func2, scope1);
            const bound3 = bind(func1, scope2);
            const bound4 = bind(func2, scope2);
            expect(bound1).not.toBe(bound2);
            expect(bound2).not.toBe(bound3);
            expect(bound3).not.toBe(bound4);
            expect(bound4).not.toBe(bound1);
        });
        it("returns same bound function for same combinations of function and scope", () => {
            function func(): void {}
            const scope = {};
            const bound1 = bind(func, scope);
            const bound2 = bind(func, scope);
            expect(bound1).toBe(bound2);
        });
        it("returns unbound function if no scope is specified", () => {
            function func(): void {}
            const bound = bind(func);
            expect(bound).toBe(func);
        });
    });

    describe("weakBind", () => {
        it("binds a function to a scope", () => {
            function func(this: object): object {
                return this;
            }
            const scope = {};
            const bound = weakBind(func, scope);
            expect(bound()).toBe(scope);
        });
        it("supports parameters", () => {
            function func(a: number, b: number): number {
                return a + b;
            }
            const scope = {};
            const bound = weakBind(func, scope);
            expect(bound(2, 3)).toBe(5);
        });
        it("returns different bound functions for different combinations of function and scope", () => {
            function func1(): void {}
            function func2(): void {}
            const scope1 = {};
            const scope2 = {};
            const bound1 = weakBind(func1, scope1);
            const bound2 = weakBind(func2, scope1);
            const bound3 = weakBind(func1, scope2);
            const bound4 = weakBind(func2, scope2);
            expect(bound1).not.toBe(bound2);
            expect(bound2).not.toBe(bound3);
            expect(bound3).not.toBe(bound4);
            expect(bound4).not.toBe(bound1);
        });
        it("returns same bound function for same combinations of function and scope", () => {
            function func(): void {}
            const scope = {};
            const bound1 = weakBind(func, scope);
            const bound2 = weakBind(func, scope);
            expect(bound1).toBe(bound2);
        });
        it("returns new weakly bound function if no scope is specified", () => {
            function func(): void {}
            const bound = weakBind(func);
            expect(bound).not.toBe(func);
        });
        it("returns same weakly bound function for same function if no scope is specified", () => {
            function func(): void {}
            const bound1 = weakBind(func);
            const bound2 = weakBind(func);
            expect(bound1).toBe(bound2);
        });
        it("returns weakly bound function which is destroyed when function without scope is garbage collected",
                async () => {
            let func: null | (() => void) = () => 23;
            const bound = weakBind(func);
            expect(bound()).toBe(23);
            func = null;
            await garbageCollect();
            expect(() => bound()).toThrowError(weakFunctionDestroyedException);
        });
        it("returns weakly bound function which is not destroyed when function is garbage collected but scope is not",
                async () => {
            let func: null | (() => number) = () => 23;
            const scope = {};
            const bound = weakBind(func, scope);
            expect(bound()).toBe(23);
            func = null;
            await garbageCollect();
            expect(bound()).toBe(23);
        });
        it("returns weakly bound function which is destroyed when scope is garbage collected",
                async () => {
            const func = (): number => 23;
            let scope: object | null = {};
            const bound = weakBind(func, scope);
            expect(bound()).toBe(23);
            scope = null;
            await garbageCollect();
            expect(() => bound()).toThrowError(weakFunctionDestroyedException);
        });
    });
    describe("pipe", () => {
        it("creates a composite function executing the given functions from left to right", () => {
            const toNumber = (a: string): number => +a;
            const double = (a: number): number => a * 2;
            const toString = (a: number): string => "" + a;
            expect(pipe(toNumber, double, toString)("3")).toBe("6");
        });
        it("allows multiple arguments to first function", () => {
            const toNumber = (a: string, radix: number): number => Number.parseInt(a, radix);
            const double = (a: number): number => a * 2;
            const toString = (a: number): string => "" + a;
            expect(pipe(toNumber, double, toString)("F", 16)).toBe("30");
        });
    });
    describe("pipeWith", () => {
        it("pipes a value through the given functions from left to right", () => {
            const toNumber = (a: string): number => +a;
            const double = (a: number): number => a * 2;
            const toString = (a: number): string => "" + a;
            expect(pipeWith("3", toNumber, double, toString)).toBe("6");
        });
        it("works without function arguments", () => {
            expect(pipeWith("3")).toBe("3");
        });
    });
});
