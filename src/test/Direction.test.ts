/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import { Direction } from "../main/Direction";
import { IllegalArgumentException } from "../main/exception";

describe("Direction", () => {
    describe("NORTH_WEST", () => {
        it("is NORTH and WEST", () => {
            expect(Direction.NORTH_WEST).toBe(Direction.NORTH + Direction.WEST);
        });
    });

    describe("SOUTH_WEST", () => {
        it("is SOUTH and WEST", () => {
            expect(Direction.SOUTH_WEST).toBe(Direction.SOUTH + Direction.WEST);
        });
    });

    describe("NORTH_EAST", () => {
        it("is NORTH and EAST", () => {
            expect(Direction.NORTH_EAST).toBe(Direction.NORTH + Direction.EAST);
        });
    });

    describe("SOUTH_EAST", () => {
        it("is SOUTH and EAST", () => {
            expect(Direction.SOUTH_EAST).toBe(Direction.SOUTH + Direction.EAST);
        });
    });

    describe("isEdge", () => {
        it("returns true for edge directions", () => {
            expect(Direction.isEdge(Direction.EAST)).toBe(true);
            expect(Direction.isEdge(Direction.WEST)).toBe(true);
            expect(Direction.isEdge(Direction.NORTH)).toBe(true);
            expect(Direction.isEdge(Direction.SOUTH)).toBe(true);
        });
        it("returns false for non-edge directions", () => {
            expect(Direction.isEdge(Direction.CENTER)).toBe(false);
            expect(Direction.isEdge(Direction.NORTH_WEST)).toBe(false);
            expect(Direction.isEdge(Direction.NORTH_EAST)).toBe(false);
            expect(Direction.isEdge(Direction.SOUTH_WEST)).toBe(false);
            expect(Direction.isEdge(Direction.SOUTH_EAST)).toBe(false);
        });
    });

    describe("isCorner", () => {
        it("returns true for corner directions", () => {
            expect(Direction.isCorner(Direction.NORTH_WEST)).toBe(true);
            expect(Direction.isCorner(Direction.NORTH_EAST)).toBe(true);
            expect(Direction.isCorner(Direction.SOUTH_WEST)).toBe(true);
            expect(Direction.isCorner(Direction.SOUTH_EAST)).toBe(true);
        });
        it("returns false for non-corner directions", () => {
            expect(Direction.isCorner(Direction.CENTER)).toBe(false);
            expect(Direction.isCorner(Direction.EAST)).toBe(false);
            expect(Direction.isCorner(Direction.WEST)).toBe(false);
            expect(Direction.isCorner(Direction.NORTH)).toBe(false);
            expect(Direction.isCorner(Direction.SOUTH)).toBe(false);
        });
    });

    describe("fromJSON", () => {
        it("deserializes a direction", () => {
            expect(Direction.fromJSON("north")).toBe(Direction.NORTH);
            expect(Direction.fromJSON("south")).toBe(Direction.SOUTH);
            expect(Direction.fromJSON("west")).toBe(Direction.WEST);
            expect(Direction.fromJSON("east")).toBe(Direction.EAST);
            expect(Direction.fromJSON("center")).toBe(Direction.CENTER);
            expect(Direction.fromJSON("north-west")).toBe(Direction.NORTH_WEST);
            expect(Direction.fromJSON("north-east")).toBe(Direction.NORTH_EAST);
            expect(Direction.fromJSON("south-west")).toBe(Direction.SOUTH_WEST);
            expect(Direction.fromJSON("south-east")).toBe(Direction.SOUTH_EAST);
        });
        it("throws exception when direction can't be deserialized", () => {
            expect(() => Direction.fromJSON("???")).toThrowWithMessage(IllegalArgumentException,
                "Invalid direction JSON: ???");
        });
    });

    describe("toJSON", () => {
        it("serializes a direction", () => {
            expect(Direction.toJSON(Direction.NORTH)).toBe("north");
            expect(Direction.toJSON(Direction.SOUTH)).toBe("south");
            expect(Direction.toJSON(Direction.WEST)).toBe("west");
            expect(Direction.toJSON(Direction.EAST)).toBe("east");
            expect(Direction.toJSON(Direction.CENTER)).toBe("center");
            expect(Direction.toJSON(Direction.NORTH_WEST)).toBe("north-west");
            expect(Direction.toJSON(Direction.NORTH_EAST)).toBe("north-east");
            expect(Direction.toJSON(Direction.SOUTH_WEST)).toBe("south-west");
            expect(Direction.toJSON(Direction.SOUTH_EAST)).toBe("south-east");
        });
    });

    describe("toAngle", () => {
        it("converts direction to an angle", () => {
            expect(Direction.toAngle(Direction.NORTH)).toBe(0);
            expect(Direction.toAngle(Direction.NORTH_EAST)).toBe(1);
            expect(Direction.toAngle(Direction.EAST)).toBe(2);
            expect(Direction.toAngle(Direction.SOUTH_EAST)).toBe(3);
            expect(Direction.toAngle(Direction.SOUTH)).toBe(4);
            expect(Direction.toAngle(Direction.SOUTH_WEST)).toBe(5);
            expect(Direction.toAngle(Direction.WEST)).toBe(6);
            expect(Direction.toAngle(Direction.NORTH_WEST)).toBe(7);
        });
        it("multiplies angle with given unit", () => {
            expect(Direction.toAngle(Direction.NORTH, 45)).toBe(0);
            expect(Direction.toAngle(Direction.NORTH_EAST, 45)).toBe(45);
            expect(Direction.toAngle(Direction.EAST, 45)).toBe(90);
            expect(Direction.toAngle(Direction.SOUTH_EAST, 45)).toBe(135);
            expect(Direction.toAngle(Direction.SOUTH, 45)).toBe(180);
            expect(Direction.toAngle(Direction.SOUTH_WEST, 45)).toBe(225);
            expect(Direction.toAngle(Direction.WEST, 45)).toBe(270);
            expect(Direction.toAngle(Direction.NORTH_WEST, 45)).toBe(315);
        });
        it("throws error when direction has no angle", () => {
            expect(() => Direction.toAngle(Direction.CENTER)).toThrowWithMessage(IllegalArgumentException,
                "Direction has no angle: CENTER");
            expect(() => Direction.toAngle(123)).toThrowWithMessage(IllegalArgumentException,
                "Direction has no angle: 123");
        });
    });

    describe("fromAngle", () => {
        it("converts angle to direction", () => {
            expect(Direction.fromAngle(-1)).toBe(Direction.NORTH_WEST);
            expect(Direction.fromAngle(0)).toBe(Direction.NORTH);
            expect(Direction.fromAngle(1)).toBe(Direction.NORTH_EAST);
            expect(Direction.fromAngle(2)).toBe(Direction.EAST);
            expect(Direction.fromAngle(3)).toBe(Direction.SOUTH_EAST);
            expect(Direction.fromAngle(4)).toBe(Direction.SOUTH);
            expect(Direction.fromAngle(5)).toBe(Direction.SOUTH_WEST);
            expect(Direction.fromAngle(6)).toBe(Direction.WEST);
            expect(Direction.fromAngle(7)).toBe(Direction.NORTH_WEST);
            expect(Direction.fromAngle(8)).toBe(Direction.NORTH);
        });
        it("divides angle by given unit", () => {
            expect(Direction.fromAngle(-23, 45)).toBe(Direction.NORTH_WEST);
            expect(Direction.fromAngle(-22, 45)).toBe(Direction.NORTH);
            expect(Direction.fromAngle(-1, 45)).toBe(Direction.NORTH);
            expect(Direction.fromAngle(0, 45)).toBe(Direction.NORTH);
            expect(Direction.fromAngle(45, 45)).toBe(Direction.NORTH_EAST);
            expect(Direction.fromAngle(90, 45)).toBe(Direction.EAST);
            expect(Direction.fromAngle(135, 45)).toBe(Direction.SOUTH_EAST);
            expect(Direction.fromAngle(170, 45)).toBe(Direction.SOUTH);
            expect(Direction.fromAngle(225, 45)).toBe(Direction.SOUTH_WEST);
            expect(Direction.fromAngle(270, 45)).toBe(Direction.WEST);
            expect(Direction.fromAngle(315, 45)).toBe(Direction.NORTH_WEST);
            expect(Direction.fromAngle(361.41, 45)).toBe(Direction.NORTH);
        });
    });
});
