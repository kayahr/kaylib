import "jest-extended";

import { injectable } from "../../main/di/Injectable";
import { InjectionException } from "../../main/di/InjectionException";
import { injector } from "../../main/di/Injector";
import { qualifier } from "../../main/di/Qualifier";

describe("Parameter", () => {
    beforeEach(() => {
        injector.clear();
    });

    it("must be qualified when type is an array", () => {
        injector.injectValue(1, "number", "one");
        injector.injectValue(2, "number", "two");
        injector.injectValue(3, "number", "three");

        expect(() => {
            @injectable()
            class Test {
                public constructor(
                    public n: number[]
                ) {}
            }
            return injector.createSync(Test);
        }).toThrowWithMessage(InjectionException,
            "Array parameters must be qualified by using the @qualify decorator");
    });

    describe("resolve", () => {
        it("can resolve array asynchronously", async () => {
            @injectable()
            class Test {
                public constructor(
                    @qualifier("number")
                    public n: number[]
                ) {}
            }

            injector.injectValue(Promise.resolve(1), "number", "one");
            injector.injectValue(2, "number", "two");
            const test = await injector.createAsync(Test);
            expect(test.n).toEqual([ 1, 2 ]);
        });
    });
});
