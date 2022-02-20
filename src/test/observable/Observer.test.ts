import { createObserver } from "../../main/observable/Observer";

describe("createObserver", () => {
    it("throws exception when not called with object or function", () =>  {
        expect(() => createObserver(3 as unknown as ((value: unknown) => void))).toThrowWithMessage(TypeError,
            "Parameter must be an observer object or function");
    });
});
