import "reflect-metadata";

import { paramType } from "../../main/util/reflection";

describe("reflection", () => {
    describe("paramType", () => {
        it("can emit reflection metadata for union types", () => {
            class Test {
                public test(
                    a: string,
                    @paramType([ String, Number ]) b: string | number,
                    c: number
                ): void {}
            }
            expect(Reflect.getMetadata("design:paramtypes", Test.prototype, "test")).toEqual([ String, [ String, Number ], Number ]);
        });
        it("can emit reflection metadata for nullable types", () => {
            class Test {
                public test(
                    a: string,
                    @paramType([ Boolean, null ]) b: boolean | null,
                    c: number
                ): void {}
            }
            expect(Reflect.getMetadata("design:paramtypes", Test.prototype, "test")).toEqual([ String, [ Boolean, null ], Number ]);
        });
        it("can emit reflection metadata for optional types", () => {
            class Test {
                public test(
                    a: string,
                    @paramType([ Date, undefined ]) b?: Date
                ): void {}
            }
            expect(Reflect.getMetadata("design:paramtypes", Test.prototype, "test")).toEqual([ String, [ Date, undefined ] ]);
        });
        it("can emit reflection metadata for custom types", () => {
            class Test {
                public test(
                    a: string,
                    @paramType([ Test, null ]) b: Test | null,
                    c: number
                ): void {}
            }
            expect(Reflect.getMetadata("design:paramtypes", Test.prototype, "test")).toEqual([ String, [ Test, null ], Number ]);
        });
        it("can emit reflection metadata for single types", () => {
            class Test {
                public test(
                    @paramType(String) a: string,
                    @paramType(Number) b: number,
                    @paramType(Boolean) c: boolean,
                    @paramType(Date) d: Date,
                    @paramType(Test) e: Test,
                    @paramType(null) f: null,
                    @paramType(undefined) g: undefined
                ): void {}
            }
            expect(Reflect.getMetadata("design:paramtypes", Test.prototype, "test")).toEqual([ String, Number, Boolean, Date, Test, null, undefined ]);
        });
    });
});
