/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";
import "@kayahr/jest-matchers";

import { Insets } from "../../main/geom/Insets";
import { IllegalArgumentException } from "../../main/util/exception";

describe("Insets", () => {
    describe("constructor", () => {
        it("uses one-and-only inset for all sides", () => {
            const insets = new Insets(5);
            expect(insets.getTop()).toBe(5);
            expect(insets.getRight()).toBe(5);
            expect(insets.getBottom()).toBe(5);
            expect(insets.getLeft()).toBe(5);
        });
        it("uses top and right argument for bottom and left", () => {
            const insets = new Insets(5, 3);
            expect(insets.getTop()).toBe(5);
            expect(insets.getRight()).toBe(3);
            expect(insets.getBottom()).toBe(5);
            expect(insets.getLeft()).toBe(3);
        });
        it("uses given individual arguments for insets", () => {
            const insets = new Insets(1, 2, 3, 4);
            expect(insets.getTop()).toBe(1);
            expect(insets.getRight()).toBe(2);
            expect(insets.getBottom()).toBe(3);
            expect(insets.getLeft()).toBe(4);
        });
    });

    describe("toJSON", () => {
        it("returns JSON representation of the insets", () => {
            expect(new Insets(1, 2, 3, 4).toJSON()).toEqual({
                top: 1,
                right: 2,
                bottom: 3,
                left: 4
            });
        });
    });

    describe("fromJSON", () => {
        it("deserializes insets from JSON", () => {
            expect(Insets.fromJSON({ top: 1, right: 2, bottom: 3, left: 4 })).toEqual(new Insets(1, 2, 3, 4));
        });
    });

    describe("fromInsets", () => {
        it("creates insets from insets-like object", () => {
            expect(Insets.fromInsets(new Insets(1, 2, 3, 4))).toEqual(new Insets(1, 2, 3, 4));
        });
    });

    describe("fromString", () => {
        it("parses insets from a string", () => {
            expect(Insets.fromString(" 9px")).toEqual(new Insets(9, 9, 9, 9));
            expect(Insets.fromString(" 1    4 ")).toEqual(new Insets(1, 4, 1, 4));
            expect(Insets.fromString("1,2,3")).toEqual(new Insets(1, 2, 3, 2));
            expect(Insets.fromString("+10.4% 9.8px -1.9em 0")).toEqual(new Insets(10.4, 9.8, -1.9, 0));
        });
        it("throws error when insets string is invalid", () => {
            expect(() => Insets.fromString("+++")).toThrowWithMessage(IllegalArgumentException,
                "Invalid insets string: +++");
        });
    });

    describe("toString", () => {
        it("returns string representation of the insets", () => {
            expect(new Insets(1, 2, 3, 4).toString()).toBe("1 2 3 4");
            expect(new Insets(1, 2, 1, 4).toString()).toBe("1 2 1 4");
            expect(new Insets(1.2, -3.4, -50, 100.123).toString()).toBe("1.2 -3.4 -50 100.123");
            expect(new Insets(1e21, 1e-6, 0, 0).toString()).toBe("1000000000000000000000 0.000001 0 0");
        });
        it("returns two component string representation of the insets", () => {
            expect(new Insets(1, 2).toString()).toBe("1 2");
        });
        it("returns one component string representation of the insets", () => {
            expect(new Insets(0).toString()).toBe("0");
        });
        it("includes given unit", () => {
            expect(new Insets(1, 2, 3, 4).toString("px")).toBe("1px 2px 3px 4px");
        });
        it("allows configuring maximum fraction digits", () => {
            expect(new Insets(1.23456789, 2.3456789, 3.456789, 4.56789).toString("%", 2))
                .toBe("1.23% 2.35% 3.46% 4.57%");
        });
    });

    describe("getVertical", () => {
        it("returns the vertical insets", () => {
            expect(new Insets(2, 3, 4, 5).getVertical()).toBe(6);
        });
    });

    describe("getHorizontal", () => {
        it("returns the horizontal insets", () => {
            expect(new Insets(2, 3, 4, 5).getHorizontal()).toBe(8);
        });
    });

    describe("isNull", () => {
        it("checks if all insets are 0", () => {
            expect(new Insets(0).isNull()).toBe(true);
            expect(new Insets(1, 0, 0, 0).isNull()).toBe(false);
            expect(new Insets(0, 1, 0, 0).isNull()).toBe(false);
            expect(new Insets(0, 0, 1, 0).isNull()).toBe(false);
            expect(new Insets(0, 0, 0, 1).isNull()).toBe(false);
        });
    });

    describe("add", () => {
        it("adds individual inset values", () => {
            const insets = new Insets(1, 2, 3, 4);
            const result = insets.add(10, 20, 30, 40);
            expect(result).toEqual(new Insets(11, 22, 33, 44));
            expect(result).not.toBe(insets);
        });
        it("adds insets with single inset value", () => {
            const insets = new Insets(1, 2, 3, 4);
            const result = insets.add(10);
            expect(result).toEqual(new Insets(11, 12, 13, 14));
            expect(result).not.toBe(insets);
        });
        it("adds insets with vertical and horizontal inset value", () => {
            const insets = new Insets(1, 2, 3, 4);
            const result = insets.add(10, 20);
            expect(result).toEqual(new Insets(11, 22, 13, 24));
            expect(result).not.toBe(insets);
        });
    });

    describe("addInsets", () => {
        it("adds insets object", () => {
            const insets = new Insets(1, 2, 3, 4);
            const result = insets.addInsets(new Insets(10, 20, 30, 40));
            expect(result).toEqual(new Insets(11, 22, 33, 44));
            expect(result).not.toBe(insets);
        });
    });

    describe("sub", () => {
        it("subtracts individual inset values", () => {
            const insets = new Insets(11, 22, 33, 44);
            const result = insets.sub(10, 20, 30, 40);
            expect(result).toEqual(new Insets(1, 2, 3, 4));
            expect(result).not.toBe(insets);
        });
        it("subtracts insets with single inset value", () => {
            const insets = new Insets(11, 12, 13, 14);
            const result = insets.sub(10);
            expect(result).toEqual(new Insets(1, 2, 3, 4));
            expect(result).not.toBe(insets);
        });
        it("subtracts insets with vertical and horizontal inset value", () => {
            const insets = new Insets(11, 22, 13, 24);
            const result = insets.sub(10, 20);
            expect(result).toEqual(new Insets(1, 2, 3, 4));
            expect(result).not.toBe(insets);
        });
    });

    describe("subInsets", () => {
        it("subtracts insets object", () => {
            const insets = new Insets(11, 22, 33, 44);
            const result = insets.subInsets(new Insets(10, 20, 30, 40));
            expect(result).toEqual(new Insets(1, 2, 3, 4));
            expect(result).not.toBe(insets);
        });
    });

    describe("mul", () => {
        it("multiplies with individual inset factors", () => {
            const insets = new Insets(1, 2, 3, 4);
            const result = insets.mul(10, 100, 1000, 10000);
            expect(result).toEqual(new Insets(10, 200, 3000, 40000));
            expect(result).not.toBe(insets);
        });
        it("multiplies insets with single inset factor", () => {
            const insets = new Insets(1, 2, 3, 4);
            const result = insets.mul(10);
            expect(result).toEqual(new Insets(10, 20, 30, 40));
            expect(result).not.toBe(insets);
        });
        it("multiplies insets with vertical and horizontal inset factors", () => {
            const insets = new Insets(1, 2, 3, 4);
            const result = insets.mul(10, 100);
            expect(result).toEqual(new Insets(10, 200, 30, 400));
            expect(result).not.toBe(insets);
        });
    });

    describe("div", () => {
        it("divides insets by individual inset factors", () => {
            const insets = new Insets(10, 200, 3000, 40000);
            const result = insets.div(10, 100, 1000, 10000);
            expect(result).toEqual(new Insets(1, 2, 3, 4));
            expect(result).not.toBe(insets);
        });
        it("divides insets by single inset factor", () => {
            const insets = new Insets(10, 20, 30, 40);
            const result = insets.div(10);
            expect(result).toEqual(new Insets(1, 2, 3, 4));
            expect(result).not.toBe(insets);
        });
        it("divides insets by vertical and horizontal inset factors", () => {
            const insets = new Insets(10, 200, 30, 400);
            const result = insets.div(10, 100);
            expect(result).toEqual(new Insets(1, 2, 3, 4));
            expect(result).not.toBe(insets);
        });
    });

    describe("equals", () => {
        it("checks if insets are equal", () => {
            expect(new Insets(1, 2, 3, 4)).toBeEquatable([ new Insets(1, 2, 3, 4) ],
                [ new Insets(9, 2, 3, 4), new Insets(1, 9, 3, 4), new Insets(1, 2, 9, 4), new Insets(1, 2, 3, 9) ]);
        });
    });
});
