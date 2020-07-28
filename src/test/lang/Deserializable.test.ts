/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Deserializable, isDeserializable } from "../../main/lang/Deserializable";
import { Serializable } from "../../main/lang/Serializable";

interface TestJSON {
    value: number;
}

class Test implements Serializable<TestJSON> {
    public constructor(public readonly value: number) {}
    public toJSON(): TestJSON {
        return { value: this.value };
    }
    public static fromJSON(json: TestJSON): Test {
        return new Test(json.value);
    }
}

describe("Deserializable", () => {
    it("can be assigned by deserializable type with specific JSON type", () => {
        const foo: Deserializable<TestJSON> = Test;
        expect(foo).toBe(Test);
    });
    it("can be assigned by deserializable type without specific JSON type", () => {
        const foo: Deserializable = Test;
        expect(foo).toBe(Test);
    });
    describe("isDeserializable", () => {
        it("returns true for deserializable class", () => {
            expect(isDeserializable(Test)).toBe(true);
        });
        it("returns false for non-deserializable classes", () => {
            expect(isDeserializable(Number)).toBe(false);
            expect(isDeserializable(Object)).toBe(false);
            expect(isDeserializable(Array)).toBe(false);
            expect(isDeserializable(String)).toBe(false);
            expect(isDeserializable(Boolean)).toBe(false);
            expect(isDeserializable(Date)).toBe(false);
        });
    });
});
