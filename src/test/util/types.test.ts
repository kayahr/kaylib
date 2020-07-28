/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Class, Constructor, Immutable, Mutable, TypedArray, WritableArrayLike } from "../../main/util/types";

describe("types", () => {
    describe("Constructor", () => {
        it("can describe a public constructor without arguments", () => {
            class Test {}
            const constructor: Constructor = Test;
            const instance = new constructor();
            expect(instance instanceof Test);
            expect(instance instanceof Object);
        });
        it("can describe a public constructor with arguments with generic instance type", () => {
            class Test {
                public constructor(
                    public foo: string,
                    public bar: number
                ) {}
            }
            const constructor: Constructor = Test;
            const instance = new constructor("test", 45);
            expect(instance instanceof Test);
            expect(instance instanceof Object);
        });
        it("can describe a public constructor with arguments with specific instance type", () => {
            class Test {
                public constructor(
                    public foo: string,
                    public bar: number
                ) {}
            }
            const constructor: Constructor<Test> = Test;
            const instance = new constructor("test", 45);
            expect(instance instanceof Test);
            expect(instance instanceof Object);
            expect(instance.foo).toBe("test");
            expect(instance.bar).toBe(45);
        });
        it("can describe a public constructor with arguments with specific instance and parameter types", () => {
            class Test {
                public constructor(
                    public foo: string,
                    public bar: number
                ) {}
            }
            const cls: Constructor<Test> = Test;
            expect(cls).toBe(Test);
            const constructor: Constructor<Test, [ string, number ]> = Test;
            const instance = new constructor("test", 45);
            expect(instance instanceof Test);
            expect(instance instanceof Object);
            expect(instance.foo).toBe("test");
            expect(instance.bar).toBe(45);
        });
    });

    describe("Class", () => {
        it("can describe a class type even with a private constructor", () => {
            class Test {
                private constructor(
                    public foo: number
                ) {}

                public static create(foo: number): Test {
                    return new Test(foo);
                }
            }
            function test<T extends Test>(instance: T, cls: Class<T>): void {
                expect(instance).toBeInstanceOf(cls);
                expect(instance.foo).toBe(23);
            }
            const cls: Class<Test> = Test;
            expect(cls).toBe(Test);
            test(Test.create(23), Test);
        });
    });

    describe("Mutable", () => {
        it("converts an immutable type into a mutable type", () => {
            type Test = {
                readonly foo: number;
                readonly bar: {
                    readonly a: string;
                };
            };
            const test: Mutable<Test> = { foo: 23, bar: { a: "test" } };
            test.foo = 42;
            test.bar.a = "foo";
            expect(test.foo).toBe(42);
            expect(test.bar).toEqual({ a: "foo" });
        });
    });

    describe("Immutable", () => {
        it("converts an mutable type into an immutable type", () => {
            type TestMutable = {
                foo: number;
                bar: {
                    a: string;
                };
            };
            type RealImmutable = {
                readonly foo: number;
                readonly bar: {
                    readonly a: string;
                };
            };
            const test: RealImmutable = { foo: 23, bar: { a: "test" } };
            const test2: Immutable<TestMutable> = test;
            expect(test).toBe(test2);
        });
    });

    describe("TypedArray", () => {
        it("groups all typed array types into one type", () => {
            let a: TypedArray;
            a = new Uint8Array();
            expect(a).toBeInstanceOf(Uint8Array);
            a = new Uint16Array();
            expect(a).toBeInstanceOf(Uint16Array);
            a = new Uint32Array();
            expect(a).toBeInstanceOf(Uint32Array);
            a = new Int8Array();
            expect(a).toBeInstanceOf(Int8Array);
            a = new Int16Array();
            expect(a).toBeInstanceOf(Int16Array);
            a = new Int32Array();
            expect(a).toBeInstanceOf(Int32Array);
            a = new Uint8ClampedArray();
            expect(a).toBeInstanceOf(Uint8ClampedArray);
            a = new Float32Array();
            expect(a).toBeInstanceOf(Float32Array);
            a = new Float64Array();
            expect(a).toBeInstanceOf(Float64Array);
        });
    });

    describe("WritableArrayLike", () => {
        it("is an ArrayLike type with additional write access working with standard arrays", () => {
            const a = [ 1, 2, 3, 4 ];
            const b: WritableArrayLike<number> = a;
            b[0] = 23;
            expect(b.length).toBe(4);
            expect(b[0]).toBe(23);
        });
        it("is an ArrayLike type with additional write access working with typed arrays", () => {
            const a = new Uint8Array([ 1, 2, 3, 4 ]);
            const b: WritableArrayLike<number> = a;
            b[0] = 23;
            expect(b.length).toBe(4);
            expect(b[0]).toBe(23);
        });
    });
});
