import "jest-extended";

import { injectable } from "../../main/di/Injectable";
import { InjectionException } from "../../main/di/InjectionException";
import { injector } from "../../main/di/Injector";

describe("Injector", () => {
    beforeEach(() => {
        injector.clear();
    });

    describe("fromValue", () => {
        it("creates an injectable value", () => {
            class Test {
                public constructor(public a: number) {}
            }
            injector.injectValue({ a: 1 }, "test1");
            injector.injectValue({ a: 2 }, "test2", "test3");
            injector.injectValue(new Test(3));
            injector.injectValue(42, "test4");
            expect(injector.getSync<{ a: number }>("test1").a).toBe(1);
            expect(injector.getSync<{ a: number }>("test2").a).toBe(2);
            expect(injector.getSync<{ a: number }>("test3").a).toBe(2);
            expect(injector.getSync<{ a: number }>(Test).a).toBe(3);
            expect(injector.getSync<number>("test4")).toBe(42);
        });
    });

    describe("get", () => {
        it("throws exception when no match found", () => {
            expect(() => injector.get("not-found")).toThrowWithMessage(InjectionException,
                "No dependency found for qualifier: 'not-found'");
        });
        it("throws exception when multiple matches found", () => {
            injector.injectValue(1, "test");
            injector.injectValue(2, "test");
            expect(() => injector.get("test")).toThrowWithMessage(InjectionException,
                "More than one dependency found for qualifier: 'test'");
        });
    });

    describe("getAsync", () => {
        it("returns async dependency", async () => {
            injector.injectValue(Promise.resolve(42), "test");
            const v = injector.getAsync<number>("test");
            expect(v).toBeInstanceOf(Promise);
            expect(await v).toBe(42);
        });
        it("returns async dependency even when its actually synchronous", async () => {
            injector.injectValue(23, "test");
            const v = injector.getAsync<number>("test");
            expect(v).toBeInstanceOf(Promise);
            expect(await v).toBe(23);
        });
    });

    describe("getSync", () => {
        it("returns synchronous dependency", () => {
            injector.injectValue(23, "test");
            const v = injector.getSync<number>("test");
            expect(v).toBe(23);
        });
        it("throws error when dependency is asynchronous", () => {
            injector.injectValue(Promise.resolve(42), "test");
            expect(() => injector.getSync<number>("test")).toThrowWithMessage(InjectionException,
                "Asynchronous dependency found during synchronous resolving for qualifier: 'test'");
        });
    });

    describe("getAll", () => {
        it("returns empty array when no candidate found", () => {
            injector.injectValue(1, "test1");
            injector.injectValue(2, "test2");
            expect(injector.getAll("test")).toEqual([]);
        });
        it("returns array with single entry when only one candidate found", () => {
            injector.injectValue(1, "test1", "test");
            injector.injectValue(2, "test2", "test");
            expect(injector.getAll("test1")).toEqual([ 1 ]);
            expect(injector.getAll("test2")).toEqual([ 2 ]);
        });
        it("returns array with multiply entries when multiple candidates found", () => {
            injector.injectValue(1, "test1", "test");
            injector.injectValue(2, "test2", "test");
            injector.injectValue(3, "test3");
            expect(injector.getAll("test")).toEqual([ 1, 2 ]);
        });
    });

    describe("getAllSync", () => {
        it("returns synchronous dependencies", () => {
            injector.injectValue(1, "test");
            injector.injectValue(2, "test");
            expect(injector.getAllSync("test")).toEqual([ 1, 2 ]);
        });
        it("throws error when a dependency is asynchronous", () => {
            injector.injectValue(1, "test");
            injector.injectValue(Promise.resolve(2), "test");
            expect(() => injector.getAllSync("test")).toThrowWithMessage(InjectionException,
                "Asynchronous dependencies found during synchronous resolving for qualifier: 'test'");
        });
    });

    describe("getAllSync", () => {
        it("returns asynchronous dependencies", async () => {
            injector.injectValue(3, "test");
            injector.injectValue(Promise.resolve(4), "test");
            const all = injector.getAllAsync("test");
            expect(all).toBeInstanceOf(Promise);
            expect(await all).toEqual([ 3, 4 ]);
        });
    });

    describe("createSync", () => {
        it("creates new synchronous instance of class", () => {
            injector.injectValue("foo", "name");
            @injectable()
            class Dep {
                public foo = "bar";
            }
            @injectable()
            class Test {
                public constructor(public dep: Dep, public name: string) {}
            }
            const test1 = injector.createSync(Test);
            expect(test1.dep.foo).toBe("bar");
            expect(test1.name).toBe("foo");
            const test2 = injector.createSync(Test);
            expect(test2.dep).toBe(test1.dep);
            expect(test2.name).toBe(test1.name);

            expect(test1).not.toBe(test2);
        });
        it("creates new synchronous instance of class via factory", () => {
            injector.injectValue("foo", "name");
            @injectable()
            class Dep {
                public foo = "bar";
            }
            class Test {
                private constructor(public v: string) {}

                @injectable()
                public static create(dep: Dep, name: string): Test {
                    return new Test(dep.foo + " " + name);
                }
            }
            const test1 = injector.createSync(Test, Test.create);
            expect(test1.v).toBe("bar foo");
            const test2 = injector.createSync(Test, Test.create);
            expect(test2.v).toBe(test1.v);

            expect(test1).not.toBe(test2);
        });
        it("throws error when type construction is asynchronous", () => {
            class Dep {
                public foo = "bar";

                @injectable()
                public static async create(): Promise<Dep> {
                    return Promise.resolve(new Dep());
                }
            }
            class Test {
                private constructor(public v: string) {}

                @injectable()
                public static create(dep: Dep): Test {
                    return new Test(dep.foo);
                }
            }
            expect(() => injector.createSync(Test, Test.create)).toThrowWithMessage(InjectionException,
                "Asynchronous dependencies found during synchronous resolving");
        });
    });

    describe("createAsync", () => {
        it("creates new asynchronous instance of class with asynchronous dependency", async () => {
            class Dep {
                public foo = "bar";

                @injectable()
                public static async create(): Promise<Dep> {
                    return Promise.resolve(new Dep());
                }
            }

            @injectable()
            class Test {
                public constructor(public dep: Dep) {}
            }
            const test1Promise = injector.createAsync(Test);
            expect(test1Promise).toBeInstanceOf(Promise);
            const test1 = await test1Promise;
            expect(test1.dep.foo).toBe("bar");
            const test2 = await injector.createAsync(Test);
            expect(test2.dep).toBe(test1.dep);

            expect(test1).not.toBe(test2);
        });
        it("creates new asynchronous instance of class via synchronous factory with async dependency", async () => {
            class Dep {
                public foo = "bar";
                @injectable()
                public static async create(): Promise<Dep> {
                    return Promise.resolve(new Dep());
                }
            }
            class Test {
                private constructor(public v: string) {}

                @injectable()
                public static create(dep: Dep): Test {
                    return new Test(dep.foo);
                }
            }
            const test1Promise = injector.createAsync(Test, Test.create);
            expect(test1Promise).toBeInstanceOf(Promise);
            const test1 = await test1Promise;
            expect(test1.v).toBe("bar");
            const test2 = await injector.createAsync(Test, Test.create);
            expect(test2.v).toBe(test1.v);

            expect(test1).not.toBe(test2);
        });
        it("creates new asynchronous instance of class via asynchronous factory", async () => {
            class Test {
                private constructor(public v: string) {}

                @injectable()
                public static async create(): Promise<Test> {
                    return Promise.resolve(new Test("bar"));
                }
            }
            const test1Promise = injector.createAsync(Test, Test.create);
            expect(test1Promise).toBeInstanceOf(Promise);
            const test1 = await test1Promise;
            expect(test1.v).toBe("bar");
            const test2 = await injector.createAsync(Test, Test.create);
            expect(test2.v).toBe(test1.v);

            expect(test1).not.toBe(test2);
        });
    });
});
