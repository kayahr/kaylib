/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";
import "@kayahr/jest-matchers";

import { Point } from "../../main/geom/Point";
import { IllegalArgumentException } from "../../main/util/exception";

describe("Point", () => {
    describe("constructor", () => {
        it("creates a new point with given X and Y coordinates", () => {
            const point = new Point(1, 2);
            expect(point.getX()).toBe(1);
            expect(point.getY()).toBe(2);
        });
    });

    describe("fromPoint", () => {
        it("creates point from a point-like object", () => {
            expect(Point.fromPoint({ getX: () => 2, getY: () => 3 })).toEqual(new Point(2, 3));
        });
    });

    describe("toJSON", () => {
        it("returns JSON representation of the point", () => {
            expect(new Point(1, 2).toJSON()).toEqual({
                x: 1,
                y: 2
            });
        });
    });

    describe("toString", () => {
        it("returns string representation of the point", () => {
            expect(new Point(1024, 768).toString()).toBe("1024,768");
            expect(new Point(1.2, -3.4).toString()).toBe("1.2,-3.4");
            expect(new Point(1e21, 1e-6).toString()).toBe("1000000000000000000000,0.000001");
        });
    });

    describe("fromString", () => {
        it("creates point from a string", () => {
            expect(Point.fromString("-103.1 x -9")).toEqual(new Point(-103.1, -9));
            expect(Point.fromString(" 1024 768")).toEqual(new Point(1024, 768));
            expect(Point.fromString("1  /  2")).toEqual(new Point(1, 2));
            expect(Point.fromString("44*-49")).toEqual(new Point(44, -49));
        });
        it("throws error when point string is invalid", () => {
            expect(() => Point.fromString("+++")).toThrowWithMessage(IllegalArgumentException,
                "Invalid point string: +++");
        });
    });

    describe("fromJSON", () => {
        it("deserializes point from JSON", () => {
            expect(Point.fromJSON({ x: 1, y: 2 })).toEqual(new Point(1, 2));
        });
    });

    describe("isNull", () => {
        it("checks if all point components are 0", () => {
            expect(new Point(0, 0).isNull()).toBe(true);
            expect(new Point(1, 0).isNull()).toBe(false);
            expect(new Point(0, 1).isNull()).toBe(false);
            expect(new Point(0, -1).isNull()).toBe(false);
            expect(new Point(-1, -1).isNull()).toBe(false);
            expect(new Point(-1, 0).isNull()).toBe(false);
        });
    });

    describe("transpose", () => {
        it("swaps X and Y coordinates", () => {
            const point = new Point(1, 2);
            const transposed = point.transpose();
            expect(transposed).toEqual(new Point(2, 1));
            expect(transposed).not.toBe(point);
        });
    });

    describe("add", () => {
        it("adds coordinates", () => {
            const point = new Point(1, 2);
            const result = point.add(10, 20);
            expect(result).toEqual(new Point(11, 22));
            expect(result).not.toBe(point);
        });
    });

    describe("addPoint", () => {
        it("adds point object", () => {
            const point = new Point(1, 2);
            const result = point.addPoint(new Point(10, 20));
            expect(result).toEqual(new Point(11, 22));
            expect(result).not.toBe(point);
        });
    });

    describe("sub", () => {
        it("subtracts coordinates", () => {
            const point = new Point(11, 22);
            const result = point.sub(10, 20);
            expect(result).toEqual(new Point(1, 2));
            expect(result).not.toBe(Point);
        });
    });

    describe("subPoint", () => {
        it("subtracts point object", () => {
            const point = new Point(11, 22);
            const result = point.subPoint(new Point(10, 20));
            expect(result).toEqual(new Point(1, 2));
            expect(result).not.toBe(point);
        });
    });

    describe("mul", () => {
        it("multiplies the point with individual factors", () => {
            const point = new Point(1, 2);
            const result = point.mul(10, 100);
            expect(result).toEqual(new Point(10, 200));
            expect(result).not.toBe(point);
        });
        it("multiplies the point with single factor", () => {
            const point = new Point(1, 2);
            const result = point.mul(10);
            expect(result).toEqual(new Point(10, 20));
            expect(result).not.toBe(point);
        });
    });

    describe("div", () => {
        it("divides the point by individual factors", () => {
            const point = new Point(10, 200);
            const result = point.div(10, 100);
            expect(result).toEqual(new Point(1, 2));
            expect(result).not.toBe(point);
        });
        it("divides the point by single factor", () => {
            const point = new Point(10, 20);
            const result = point.div(10);
            expect(result).toEqual(new Point(1, 2));
            expect(result).not.toBe(point);
        });
    });

    describe("equals", () => {
        it("checks if points are equal", () => {
            expect(new Point(1, 2)).toBeEquatable([ new Point(1, 2) ], [ new Point(9, 1), new Point(1, 9) ]);
        });
    });

    describe("getSquareDistance", () => {
        it("returns square distance to point 0,0", () => {
            expect(new Point(3, -4).getSquareDistance()).toBe(25);
            expect(new Point(0, 0).getSquareDistance()).toBe(0);
        });
        it("returns square distance to given point", () => {
            expect(new Point(3, -4).getSquareDistance(new Point(-2, 10))).toBe(221);
        });
    });

    describe("getDistance", () => {
        it("returns distance to point 0,0", () => {
            expect(new Point(3, -4).getDistance()).toBe(5);
            expect(new Point(0, 0).getDistance()).toBe(0);
        });
        it("returns square distance to given point", () => {
            expect(new Point(3, -4).getDistance(new Point(-2, 10))).toBeCloseTo(14.8661);
        });
    });
});
