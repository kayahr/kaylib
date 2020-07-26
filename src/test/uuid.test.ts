/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import { IllegalArgumentException } from "../main/exception";
import { createRandomUUID, createTimeUUID } from "../main/uuid";

describe("uuid", () => {
    describe("createRandomUUID", () => {
        it("creates a random UUID", () => {
            const uuid = createRandomUUID();
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
        });
        it("does not produce the same UUID when called twice", () => {
            // ok, technically it can happen but this should be extremely unlikely
            const uuid1 = createRandomUUID();
            const uuid2 = createRandomUUID();
            expect(uuid1).not.toBe(uuid2);
        });
    });

    describe("createTimeUUID", () => {
        it("generates a time based UUID with random mac address", () => {
            const uuid = createTimeUUID();
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
        });
        it("generates a time based UUID with specific mac address", () => {
            const uuid = createTimeUUID(new Uint8Array([ 0x11, 0x22, 0x33, 0x44, 0x55, 0x66 ]));
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-112233445566$/);
        });
        it("throws exception when mac address has not exactly six bytes", () => {
            expect(() => createTimeUUID(new Uint8Array([ 1, 2, 3, 4, 5 ]))).toThrowWithMessage(
                IllegalArgumentException, "Mac address must contain six bytes");
        });
        it("does not produce the same UUID when called twice", () => {
            const mac = new Uint8Array([ 0, 0, 0, 0, 0, 0 ]);
            const uuid1 = createTimeUUID(mac);
            const uuid2 = createTimeUUID(mac);
            expect(uuid1).not.toBe(uuid2);
        });
    });
});
