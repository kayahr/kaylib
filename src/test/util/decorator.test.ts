import { createMethodDecorator, createPropertyDecorator } from "../../main/util/decorator";

describe("decorator", () => {
    describe("createMethodDecorator", () => {
        it("can create a simple parameterless method decorator", () => {
            const testDecorator = createMethodDecorator((target, propertyKey, descriptor) => {
                descriptor.value = () => 2;
            });
            class Test {
                @testDecorator
                public foo(): number {
                    return 1;
                }
            }
            const test = new Test();
            expect(test.foo()).toBe(2);
        });
        it("can limit the method signature", () => {
            const testDecorator = createMethodDecorator((target, propertyKey,
                    descriptor: TypedPropertyDescriptor<(a: number) => number>) => {
                descriptor.value = a => a * 2;
            });
            class Test {
                @testDecorator
                public foo(a: number): number {
                    return a;
                }
            }
            const test = new Test();
            expect(test.foo(2)).toBe(4);
        });
        it("can specify the target type", () => {
            const testDecorator = createMethodDecorator((target: Test, propertyKey, descriptor) => {
                descriptor.value = function(a: number) {
                    return this.bar();
                };
            });
            class Test {
                @testDecorator
                public foo(): number {
                    return 2;
                }

                public bar(): number {
                    return 53;
                }
            }
            const test = new Test();
            expect(test.foo()).toBe(53);
        });
        it("does know the type of the decorated method", () => {
            const testDecorator = createMethodDecorator((target, propertyKey,
                    descriptor: TypedPropertyDescriptor<() => number>) => {
                const origMethod = target[propertyKey];
                descriptor.value = function() {
                    return origMethod.call(this) * 2;
                };
            });
            class Test {
                @testDecorator
                public foo(): number {
                    return 2;
                }
            }
            const test = new Test();
            expect(test.foo()).toBe(4);
        });
        it("supports optional decorator parameter", () => {
            const testDecorator = createMethodDecorator((target, propertyKey, descriptor, param?: string) => {
                descriptor.value = function() {
                    if (param == null) {
                        return "no param";
                    } else {
                        return param;
                    }
                };
            });
            class Test {
                @testDecorator
                public foo(): string {
                    return "foo";
                }
                @testDecorator("baz")
                public bar(): string {
                    return "bar";
                }
            }
            const test = new Test();
            expect(test.foo()).toBe("no param");
            expect(test.bar()).toBe("baz");
        });
    });

    describe("createPropertyDecorator", () => {
        it("can create a simple parameterless property decorator", () => {
            const testDecorator = createPropertyDecorator((target, propertyKey) => {
                Object.defineProperty(target, propertyKey, {
                    value: 4
                });
            });
            class Test {
                @testDecorator
                public foo!: number;
            }
            const test = new Test();
            expect(test.foo).toBe(4);
        });
        it("can specify the target type", () => {
            const testDecorator = createPropertyDecorator((target, propertyKey) => {
                Object.defineProperty(target, propertyKey, {
                    get(this: Test) {
                        return this.bar;
                    }
                });
            });
            class Test {
                @testDecorator
                public foo!: number;

                public constructor(public readonly bar: number) {}
            }
            const test = new Test(3);
            expect(test.foo).toBe(3);
        });
        it("supports optional decorator parameter", () => {
            const testDecorator = createPropertyDecorator((target, propertyKey, param?: number) => {
                Object.defineProperty(target, propertyKey, {
                    get() {
                        return param == null ? 0 : param;
                    }
                });
            });
            class Test {
                @testDecorator
                public foo!: number;

                @testDecorator(1)
                public bar!: number;
            }
            const test = new Test();
            expect(test.foo).toBe(0);
            expect(test.bar).toBe(1);
        });
    });
});
