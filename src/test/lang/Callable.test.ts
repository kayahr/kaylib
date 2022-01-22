import { Callable } from "../../main/lang/Callable";

describe("Callable", () => {
    it("can be called", () => {
        const fn = jest.fn((a: number, b: number): number => a + b);
        const callable = new Callable(fn);
        expect(callable(2, 3)).toBe(5);
        expect(fn).toHaveBeenCalledWith(2, 3);
    });
    it("can be extended", () => {
        class Test extends Callable<[ number, number ], number> {
            public constructor() {
                super((a, b) => (a + b) * this.getMultiplier());
            }

            public getMultiplier(): number {
                return 2;
            }
        }
        const test = new Test();
        expect(test.getMultiplier()).toBe(2);
        expect(test(2, 3)).toBe(10);
    });
    it("can be checked with instanceof", () => {
        class Test extends Callable<[ number, number ], number> {
            public constructor() {
                super((a, b) => a + b);
            }
        }
        const test = new Test();
        expect(test instanceof Test).toBe(true);
        expect(test instanceof Callable).toBe(true);
        expect(test instanceof Function).toBe(true);
    });
});
