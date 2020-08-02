/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";
import "@kayahr/jest-matchers";

import { Insets } from "../../main/geom/Insets";
import { Size } from "../../main/geom/Size";
import { compare } from "../../main/lang/Comparable";
import { IllegalArgumentException } from "../../main/util/exception";

describe("Size", () => {
    describe("constructor", () => {
        it("creates a new size with given width and height", () => {
            const size = new Size(1, 2);
            expect(size.getWidth()).toBe(1);
            expect(size.getHeight()).toBe(2);
        });
    });

    describe("fromSize", () => {
        it("creates size from a size-like object", () => {
            expect(Size.fromSize({ getWidth: () => 2, getHeight: () => 3 })).toEqual(new Size(2, 3));
        });
    });

    describe("toJSON", () => {
        it("returns JSON representation of the size", () => {
            expect(new Size(1, 2).toJSON()).toEqual({
                width: 1,
                height: 2
            });
        });
    });

    describe("toString", () => {
        it("returns string representation of the size", () => {
            expect(new Size(1024, 768).toString()).toBe("1024x768");
            expect(new Size(1.2, -3.4).toString()).toBe("1.2x-3.4");
            expect(new Size(1e21, 1e-6).toString()).toBe("1000000000000000000000x0.000001");
        });
        it("supports setting maximum fraction digits", () => {
            expect(new Size(1.234567890, 2.34567890).toString(3)).toBe("1.235x2.346");
        });
    });

    describe("fromString", () => {
        it("creates size from a string", () => {
            expect(Size.fromString("-103.1 x -9")).toEqual(new Size(-103.1, -9));
            expect(Size.fromString(" 1024 768")).toEqual(new Size(1024, 768));
            expect(Size.fromString("1  /  2")).toEqual(new Size(1, 2));
            expect(Size.fromString("44*-49")).toEqual(new Size(44, -49));
        });
        it("throws error when size string is invalid", () => {
            expect(() => Size.fromString("+++")).toThrowWithMessage(IllegalArgumentException,
                "Invalid size string: +++");
        });
    });

    describe("fromJSON", () => {
        it("deserializes size from JSON", () => {
            expect(Size.fromJSON({ width: 1, height: 2 })).toEqual(new Size(1, 2));
        });
    });

    describe("isNull", () => {
        it("checks if all size components are 0", () => {
            expect(new Size(0, 0).isNull()).toBe(true);
            expect(new Size(1, 0).isNull()).toBe(false);
            expect(new Size(0, 1).isNull()).toBe(false);
            expect(new Size(0, -1).isNull()).toBe(false);
            expect(new Size(-1, -1).isNull()).toBe(false);
            expect(new Size(-1, 0).isNull()).toBe(false);
        });
    });

    describe("isEmpty", () => {
        it("checks if one size component is 0 or negative", () => {
            expect(new Size(0, 0).isEmpty()).toBe(true);
            expect(new Size(1, 0).isEmpty()).toBe(true);
            expect(new Size(0, 1).isEmpty()).toBe(true);
            expect(new Size(-1, 1).isEmpty()).toBe(true);
            expect(new Size(1, -1).isEmpty()).toBe(true);
            expect(new Size(1, 1).isEmpty()).toBe(false);
        });
    });

    describe("isValid", () => {
        it("checks if size has non-negative width/height", () => {
            expect(new Size(0, 0).isValid()).toBe(true);
            expect(new Size(1, 1).isValid()).toBe(true);
            expect(new Size(-1, 1).isValid()).toBe(false);
            expect(new Size(1, -1).isValid()).toBe(false);
        });
    });

    describe("transpose", () => {
        it("swaps width and height", () => {
            const size = new Size(1, 2);
            const transposed = size.transpose();
            expect(transposed).toEqual(new Size(2, 1));
            expect(transposed).not.toBe(size);
        });
        it("returns same size when not changed", () => {
            const size = new Size(10, 10);
            expect(size.transpose()).toBe(size);
        });
    });

    describe("add", () => {
        it("adds width and height", () => {
            const size = new Size(1, 2);
            const result = size.add(10, 20);
            expect(result).toEqual(new Size(11, 22));
            expect(result).not.toBe(size);
        });
        it("returns same size when not changed", () => {
            const size = new Size(10, 20);
            expect(size.add(0, 0)).toBe(size);
        });
    });

    describe("addSize", () => {
        it("adds size object", () => {
            const size = new Size(1, 2);
            const result = size.addSize(new Size(10, 20));
            expect(result).toEqual(new Size(11, 22));
            expect(result).not.toBe(size);
        });
        it("returns same size when not changed", () => {
            const size = new Size(10, 20);
            expect(size.addSize(new Size(0, 0))).toBe(size);
        });
    });

    describe("addInsets", () => {
        it("adds insets", () => {
            const size = new Size(1, 2);
            const result = size.addInsets(new Insets(1, 2, 3, 4));
            expect(result).toEqual(new Size(1 + 2 + 4, 2 + 1 + 3));
            expect(result).not.toBe(size);
        });
        it("returns same size when not changed", () => {
            const size = new Size(10, 20);
            expect(size.addInsets(new Insets(0))).toBe(size);
        });
    });

    describe("sub", () => {
        it("subtracts width and height", () => {
            const size = new Size(11, 22);
            const result = size.sub(10, 20);
            expect(result).toEqual(new Size(1, 2));
            expect(result).not.toBe(Size);
        });
        it("returns same size when not changed", () => {
            const size = new Size(10, 20);
            expect(size.sub(0, 0)).toBe(size);
        });
    });

    describe("subSize", () => {
        it("subtracts size object", () => {
            const size = new Size(11, 22);
            const result = size.subSize(new Size(10, 20));
            expect(result).toEqual(new Size(1, 2));
            expect(result).not.toBe(size);
        });
        it("returns same size when not changed", () => {
            const size = new Size(10, 20);
            expect(size.subSize(new Size(0, 0))).toBe(size);
        });
    });

    describe("subInsets", () => {
        it("subtracts insets", () => {
            const size = new Size(11, 22);
            const result = size.subInsets(new Insets(1, 2, 3, 4));
            expect(result).toEqual(new Size(11 - 2 - 4, 22 - 1 - 3));
            expect(result).not.toBe(size);
        });
        it("returns same size when not changed", () => {
            const size = new Size(10, 20);
            expect(size.subInsets(new Insets(0))).toBe(size);
        });
    });

    describe("mul", () => {
        it("multiplies the size with individual factors", () => {
            const size = new Size(1, 2);
            const result = size.mul(10, 100);
            expect(result).toEqual(new Size(10, 200));
            expect(result).not.toBe(size);
        });
        it("multiplies the size with single factor", () => {
            const size = new Size(1, 2);
            const result = size.mul(10);
            expect(result).toEqual(new Size(10, 20));
            expect(result).not.toBe(size);
        });
        it("returns same size when not changed", () => {
            const size = new Size(10, 20);
            expect(size.mul(1)).toBe(size);
        });
    });

    describe("div", () => {
        it("divides the size by individual factors", () => {
            const size = new Size(10, 200);
            const result = size.div(10, 100);
            expect(result).toEqual(new Size(1, 2));
            expect(result).not.toBe(size);
        });
        it("divides the size by single factor", () => {
            const size = new Size(10, 20);
            const result = size.div(10);
            expect(result).toEqual(new Size(1, 2));
            expect(result).not.toBe(size);
        });
        it("returns same size when not changed", () => {
            const size = new Size(10, 20);
            expect(size.div(1)).toBe(size);
        });
    });

    describe("equals", () => {
        it("checks if sizes are equal", () => {
            expect(new Size(1, 2)).toBeEquatable([ new Size(1, 2) ], [ new Size(9, 1), new Size(1, 9) ]);
        });
    });

    describe("getAspectRatio", () => {
        it("returns the aspect ratio of the size", () => {
            expect(new Size(1024, 768).getAspectRatio()).toBe(1024 / 768);
        });
    });

    describe("getArea", () => {
        it("returns the area of the size", () => {
            expect(new Size(1024, 768).getArea()).toBe(1024 * 768);
        });
    });

    describe("compareTo", () => {
        it("compares sizes by their area", () => {
            const size1 = new Size(10, 10);
            const size2 = new Size(1, 1);
            const size3 = new Size(100, 100);
            const sizes = [ size1, size2, size3 ];
            sizes.sort(compare);
            expect(sizes).toEqual([ size2, size1, size3 ]);
        });
    });
});
