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
            let decoratedTarget: unknown;
            let decoratedPropertyKey: unknown;
            const testDecorator = createPropertyDecorator((target, propertyKey) => {
                decoratedTarget = target;
                decoratedPropertyKey = propertyKey;
            });
            class Test {
                @testDecorator
                public foo: number = 20;
            }
            expect(decoratedTarget).toBe(Test.prototype);
            expect(decoratedPropertyKey).toBe("foo");
        });
        it("supports optional decorator parameter", () => {
            const decoratedTargets: unknown[] = [];
            const decoratedPropertyKeys: unknown[] = [];
            const decoratorParams: unknown[] = [];
            const testDecorator = createPropertyDecorator((target, propertyKey, param?: number) => {
                decoratedTargets.push(target);
                decoratedPropertyKeys.push(propertyKey);
                decoratorParams.push(param);
            });
            class Test {
                @testDecorator
                public foo!: number;

                @testDecorator(1)
                public bar!: number;
            }
            expect(decoratedTargets.length).toBe(2);
            expect(decoratedTargets[0]).toBe(Test.prototype);
            expect(decoratedTargets[1]).toBe(Test.prototype);
            expect(decoratedPropertyKeys.length).toBe(2);
            expect(decoratedPropertyKeys[0]).toBe("foo");
            expect(decoratedPropertyKeys[1]).toBe("bar");
            expect(decoratorParams.length).toBe(2);
            expect(decoratorParams[0]).toBe(undefined);
            expect(decoratorParams[1]).toBe(1);
        });
    });
});
