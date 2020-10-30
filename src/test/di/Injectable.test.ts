import { Injectable, injectable } from "../../main/di/Injectable";
import { injector } from "../../main/di/Injector";

describe("injectable", () => {
    beforeEach(() => {
        injector.clear();
    });

    it("creates a synchronous injectable", () => {
        @injectable()
        class Test {
            public a = 53;
        }

        const test = injector.get(Test) as Test;
        expect(test).toBeInstanceOf(Test);
        expect(test.a).toBe(53);
    });
    it("creates a synchronous injectable when only depending on synchronous dependencies", () => {
        @injectable()
        class Dependency {
            public a = 12;
        }

        @injectable()
        class Test {
            public constructor(private readonly dep: Dependency) {}

            public get a(): number {
                return this.dep.a;
            }
        }

        const test = injector.get(Test) as Test;
        expect(test).toBeInstanceOf(Test);
        expect(test.a).toBe(12);
    });
    it("creates a synchronous injectable when decorating a synchronous factory method", () => {
        class Test {
            public a = 42;

            @injectable()
            public static create(): Test {
                return new Test();
            }
        }

        const test = injector.get(Test) as Test;
        expect(test).toBeInstanceOf(Test);
        expect(test.a).toBe(42);
    });
    it("creates a asynchronous injectable when depending on asynchronous dependencies", async () => {
        @injectable()
        class Dependency1 {
            public a = 12;
        }

        class Dependency2 {
            public a = 2;

            @injectable()
            public static async create(): Promise<Dependency2> {
                return Promise.resolve(new Dependency2());
            }
        }

        @injectable()
        class Test {
            public constructor(private readonly dep1: Dependency1, private readonly dep2: Dependency2) {}

            public get a(): number {
                return this.dep1.a * this.dep2.a;
            }
        }

        const testPromise = injector.get(Test) as Promise<Test>;
        expect(testPromise).toBeInstanceOf(Promise);
        const test = await testPromise;
        expect(test).toBeInstanceOf(Test);
        expect(test.a).toBe(24);
    });
    it("creates an asynchronous injectable when decorating an asynchronous factory method", async () => {
        class Test {
            public a = 42;

            @injectable()
            public static async create(): Promise<Test> {
                return Promise.resolve(new Test());
            }
        }

        const testPromise = injector.get(Test) as Promise<Test>;
        expect(testPromise).toBeInstanceOf(Promise);
        const test = await testPromise;
        expect(test).toBeInstanceOf(Test);
        expect(test.a).toBe(42);
    });
    it("creates a synchronous injectable when decorating a synchronous factory method with synchronous dependency",
            () => {
        @injectable()
        class Dependency {
            public a = 4;
        }

        class Test {
            public constructor(public a: number) {}

            @injectable()
            public static create(dep: Dependency): Test {
                return new Test(dep.a);
            }
        }

        const test = injector.get(Test) as Test;
        expect(test).toBeInstanceOf(Test);
        expect(test.a).toBe(4);
    });
    it("creates an asynchronous injectable when decorating a synchronous factory method with asynchronous dependency",
            async () => {
        class Dependency {
            public a = 4;

            @injectable()
            public static async create(): Promise<Dependency> {
                return Promise.resolve(new Dependency());
            }
        }

        class Test {
            public constructor(public a: number) {}

            @injectable()
            public static create(dep: Dependency): Test {
                return new Test(dep.a);
            }
        }

        const testPromise = injector.get(Test) as Promise<Test>;
        expect(testPromise).toBeInstanceOf(Promise);
        const test = await testPromise;
        expect(test).toBeInstanceOf(Test);
        expect(test.a).toBe(4);
    });
    it("optionally registers dependency with a qualifier", () => {
        class Test {
            public a = 0;
        }
        @injectable("test1")
        class Test1 extends Test {
            public b = 1;
        }
        @injectable("test2", "test3")
        class Test2 extends Test {
            public b = 2;
        }
        const test1 = injector.getSync<Test1>("test1");
        expect(test1.b).toBe(1);
        const test2 = injector.getSync<Test2>("test2");
        expect(test2.b).toBe(2);
        const test3 = injector.getSync<Test2>("test3");
        expect(test3.b).toBe(2);
    });
});

describe("Injectable", () => {
    beforeEach(() => {
        injector.clear();
    });

    describe("fromValue", () => {
        it("creates Injectable from a value without names", () => {
            const injectable = Injectable.fromValue(123);
            expect(injectable).toBeInstanceOf(Injectable);
            expect(injectable.getInstance()).toBe(123);
        });
    });
});
