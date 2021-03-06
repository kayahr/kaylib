import { injectable } from "../../main/di/Injectable";
import { injector } from "../../main/di/Injector";
import { createQualifier, qualifier } from "../../main/di/Qualifier";

describe("qualifier", () => {
    beforeEach(() => {
        injector.clear();
    });

    it("qualifies constructor parameters", () => {
        injector.injectValue(1, "number", "one");
        injector.injectValue(2, "number", "two");
        injector.injectValue(3, "number", "three");
        injector.injectValue("foo", "string");

        @injectable()
        class Test {
            public constructor(
                @qualifier("one")
                public a: number,
                @qualifier("number").and("two")
                public b: number,
                @qualifier("number").andNot("two")
                public c: number[],
                @qualifier("number").and(createQualifier("two").or("three"))
                public d: number[],
                @qualifier("none").orNot("three").and("number")
                public e: number[]
            ) {}
        }
        const test = injector.createSync(Test);
        expect(test.a).toBe(1);
        expect(test.b).toBe(2);
        expect(test.c).toEqual([ 1, 3 ]);
        expect(test.d).toEqual([ 2, 3 ]);
        expect(test.e).toEqual([ 1, 2 ]);
    });
});
