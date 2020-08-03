/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import { RGBAColor } from "../../main/color/RGBAColor";
import { RGBColor } from "../../main/color/RGBColor";
import { IllegalArgumentException } from "../../main/util/exception";
import { isLittleEndian } from "../../main/util/runtime";

describe("RGBColor", () => {
    it("works with a precision up to 16 bit by default", () => {
        const max = 65535;
        for (const i of [ 1, 32769, 65534 ]) {
            const color = RGBColor.fromJSON(new RGBColor(i / max, i / max, i / max).toJSON());
            const red = color.getRed();
            expect(color.getGreen()).toBe(red);
            expect(color.getBlue()).toBe(red);
            expect(Math.round(red * max)).toBe(i);
        }
    });

    describe("constructor", () => {
        it("creates RGB color with given values", () => {
            const color = new RGBColor(0.1, 0.5, 0.9);
            expect(color.getRed()).toBe(0.1);
            expect(color.getGreen()).toBe(0.5);
            expect(color.getBlue()).toBe(0.9);
        });
        it("clamps values to minimum 0", () => {
            const color = new RGBColor(-0.1, -0.2, -0.3);
            expect(color.getRed()).toBe(0);
            expect(color.getGreen()).toBe(0);
            expect(color.getBlue()).toBe(0);
        });
        it("clamps values to maximum 1", () => {
            const color = new RGBColor(1.1, 1.2, 1.3);
            expect(color.getRed()).toBe(1);
            expect(color.getGreen()).toBe(1);
            expect(color.getBlue()).toBe(1);
        });
    });

    describe("fromJSON", () => {
        it("deserializes color from HTML string", () => {
            expect(RGBColor.fromJSON("#112233")).toEqual(new RGBColor(0x11 / 255, 0x22 / 255, 0x33 / 255));
            expect(RGBColor.fromJSON(" #AACcfF ")).toEqual(new RGBColor(0xaa / 255, 0xcc / 255, 0xff / 255));
        });
        it("deserializes color from CSS string", () => {
            expect(RGBColor.fromJSON("rgb(123,213,99)")).toEqual(new RGBColor(123 / 255, 213 / 255, 99 / 255));
            expect(RGBColor.fromJSON("rgb(10.9, -30, 9e+1)")).toEqual(new RGBColor(10.9 / 255, -30 / 255, 90 / 255));
            expect(RGBColor.fromJSON(" rgb ( 10% , -5% , 99.9% ) ")).toEqual(
                new RGBColor(10 / 100, -5 / 100, 99.9 / 100));
            expect(RGBColor.fromJSON("rgb(1% 2% 3%)")).toEqual(new RGBColor(1 / 100, 2 / 100, 3 / 100));
        });
        it("throws exception when invalid format", () => {
            expect(() => RGBColor.fromJSON("rgb(fail)")).toThrowWithMessage(IllegalArgumentException,
                "Invalid RGB color format: rgb(fail)");
            expect(() => RGBColor.fromJSON("rgb(10%/5/6)")).toThrowWithMessage(IllegalArgumentException,
                "Invalid RGB color format: rgb(10%/5/6)");
        });
    });

    describe("toJSON", () => {
        it("serialized color to CSS string", () => {
            expect(new RGBColor(0, 0, 0).toJSON()).toBe("rgb(0%,0%,0%)");
        });
    });

    describe("toString", () => {
        it("serialized color to CSS string", () => {
            expect(new RGBColor(1 / 100, 2 / 100, 3 / 100).toString()).toBe("rgb(1%,2%,3%)");
        });
    });

    describe("toHTML", () => {
        it("serialized color to HTML string", () => {
            expect(new RGBColor(0, 0.5, 1).toHTML()).toBe("#007fff");
        });
    });

    describe("toRGB", () => {
        it("returns itself", () => {
            const color = new RGBColor(0, 0.5, 1);
            expect(color.toRGB()).toBe(color);
        });
    });

    describe("toRGBA", () => {
        it("returns RGBA color with alpha 1.0", () => {
            const rgb = new RGBColor(0, 0.5, 1);
            const rgba = rgb.toRGBA();
            expect(rgba).toBeInstanceOf(RGBAColor);
            expect(rgba.getRed()).toBe(rgb.getRed());
            expect(rgba.getGreen()).toBe(rgb.getGreen());
            expect(rgba.getBlue()).toBe(rgb.getBlue());
            expect(rgba.getAlpha()).toBe(1);
        });
    });

    describe("fromUint32", () => {
        it("creates color from 32 bit integer in little-endian byte order", () => {
            expect(RGBColor.fromUint32(0xff123456, true)).toEqual(new RGBColor(0x56 / 255, 0x34 / 255, 0x12 / 255));
            expect(RGBColor.fromUint32(0x123456, true)).toEqual(new RGBColor(0x56 / 255, 0x34 / 255, 0x12 / 255));
        });
        it("creates color from 32 bit integer in big-endian byte order", () => {
            expect(RGBColor.fromUint32(0x123456ff, false)).toEqual(new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255));
        });
        it("uses native byte order by default", () => {
            expect(RGBColor.fromUint32(0x123456ff)).toEqual(RGBColor.fromUint32(0x123456ff, isLittleEndian()));
        });
    });

    describe("toUint32", () => {
        it("returns color as 32 bit integer in little-endian byte order", () => {
            expect(new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255).toUint32(true)).toBe(0xff563412);
        });
        it("returns color as 32 bit integer in big-endian byte order", () => {
            expect(new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255).toUint32(false)).toBe(0x123456ff);
        });
        it("uses native byte order by default", () => {
            expect(new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255).toUint32()).toBe(
                new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255).toUint32(isLittleEndian()));
        });
    });

    describe("fromUint8", () => {
        it("creates color from byte array", () => {
            expect(RGBColor.fromUint8([ 0x12, 0x34, 0x56 ])).toEqual(new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255));
        });
        it("honors given offset address", () => {
            expect(RGBColor.fromUint8([ 0, 0x12, 0x34, 0x56 ], 1)).toEqual(
                new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255));
        });
        it("creates color from Uint8Array", () => {
            expect(RGBColor.fromUint8(new Uint8Array([ 0, 0x12, 0x34, 0x56 ]), 1)).toEqual(
                new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255));
        });
    });

    describe("toUint8", () => {
        it("creates new typed array if none specified", () => {
            expect(new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255).toUint8()).toEqual(
                new Uint8Array([ 0x12, 0x34, 0x56 ]));
        });
        it("writes bytes to given array at given offset", () => {
            const data = new Uint8Array([ 1, 2, 3, 4 ]);
            const result = new RGBColor(0x12 / 255, 0x34 / 255, 0x56 / 255).toUint8(data, 1);
            expect(data).toEqual(new Uint8Array([ 1, 0x12, 0x34, 0x56 ]));
            expect(result).toBe(data);
        });
    });
});
