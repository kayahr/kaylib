/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { Insets } from "../main/Insets";

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

    describe("isEmpty", () => {
        it("checks if insets are empty", () => {
            expect(new Insets(0).isEmpty()).toBe(true);
            expect(new Insets(1, 0, 0, 0).isEmpty()).toBe(false);
            expect(new Insets(0, 1, 0, 0).isEmpty()).toBe(false);
            expect(new Insets(0, 0, 1, 0).isEmpty()).toBe(false);
            expect(new Insets(0, 0, 0, 1).isEmpty()).toBe(false);
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
