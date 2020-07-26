/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { getClass, getClassName, getSuperClass } from "../main/class";
import { Class } from "../main/types";

describe("class", () => {
    describe("getClassName", () => {
        it("returns name of a class with public constructor", () => {
            class Test {}
            expect(getClassName(Test)).toBe("Test");
        });
        it("returns name of a class with private constructor", () => {
            class PrivateTest {
                public static foo = 23;
                private constructor() {}
            }
            expect(getClassName(PrivateTest)).toBe("PrivateTest");
        });
    });

    describe("getClass", () => {
        it("returns the class (with public constructor) of an instance", () => {
            class Test {
                public static foo = 23;
            }
            function test<T>(instance: T, cls: Class<T>): void {
                expect(instance).toBeInstanceOf(cls);
            }
            const instance = new Test();
            const cls = getClass(instance);
            expect(cls).toBe(Test);
            test(instance, cls);
        });
        it("returns the class (with private constructor) of an instance", () => {
            class Test {
                private constructor() {
                }
                public static create(): Test {
                    return new Test();
                }
            }
            function test<T>(instance: T, cls: Class<T>): void {
                expect(instance).toBeInstanceOf(cls);
            }
            const instance = Test.create();
            const cls = getClass(instance);
            expect(cls).toBe(Test);
            test(instance, cls);
        });
    });

    describe("getSuperClass", () => {
        it("returns null for Object", () => {
            expect(getSuperClass(Object)).toBeNull();
        });
        it("returns the super class of a class with public constructor", () => {
            class Base {}
            class Test extends Base {}
            const superClass = getSuperClass(Test);
            expect(superClass).toBe(Base);
            if (superClass != null) {
                expect(getSuperClass(superClass)).toBe(Object);
            }
        });
        it("returns the super class of a class with public constructor by forcing the class type", () => {
            class Base {}
            class Test extends Base {}
            const superClass = getSuperClass<Base>(Test);
            expect(superClass).toBe(Base);
            function test<T>(instance: T, cls: Class<T>): void {
                expect(instance).toBeInstanceOf(cls);
            }
            if (superClass != null) {
                const instance = new Base();
                test(instance, superClass);
            }
        });
        it("returns the super class of a class with private constructor", () => {
            class Base {
                protected constructor() {}
                public static create(): Base {
                    return new Base();
                }
            }
            class Test extends Base {
                private constructor() {
                    super();
                }
                public static create(): Test {
                    return new Test();
                }
            }
            const testInstance = Test.create();
            const cls = getClass(testInstance);
            const superClass = getSuperClass<Base>(cls);
            expect(superClass).toBe(Base);
            function test<T>(instance: T, cls: Class<T>): void {
                expect(instance).toBeInstanceOf(cls);
            }
            if (superClass != null) {
                const instance = Base.create();
                test(instance, superClass);
            }
        });
    });
});
