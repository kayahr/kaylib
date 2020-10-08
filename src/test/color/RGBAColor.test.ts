/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import { RGBAColor } from "../../main/color/RGBAColor";
import { RGBColor } from "../../main/color/RGBColor";
import { IllegalArgumentException } from "../../main/util/exception";
import { isLittleEndian } from "../../main/util/runtime";

describe("RGBAColor", () => {
    it("works with a precision up to 16 bit by default", () => {
        const max = 65535;
        for (const i of [ 1, 32769, 65534 ]) {
            const color = RGBAColor.fromJSON(new RGBAColor(i / max, i / max, i / max, i / max).toJSON());
            const red = color.getRed();
            expect(color.getGreen()).toBe(red);
            expect(color.getBlue()).toBe(red);
            expect(Math.round(color.getAlpha() * max)).toBe(i);
            expect(Math.round(red * max)).toBe(i);
        }
    });

    describe("constructor", () => {
        it("creates RGBA color with given values", () => {
            const color = new RGBAColor(0.1, 0.5, 0.9, 0.8);
            expect(color.getRed()).toBe(0.1);
            expect(color.getGreen()).toBe(0.5);
            expect(color.getBlue()).toBe(0.9);
            expect(color.getAlpha()).toBe(0.8);
        });
        it("creates RGBA color with given values and default alpha of 1", () => {
            const color = new RGBAColor(0.1, 0.5, 0.9);
            expect(color.getRed()).toBe(0.1);
            expect(color.getGreen()).toBe(0.5);
            expect(color.getBlue()).toBe(0.9);
            expect(color.getAlpha()).toBe(1);
        });
        it("clamps values to minimum 0", () => {
            const color = new RGBAColor(-0.1, -0.2, -0.3, -0.4);
            expect(color.getRed()).toBe(0);
            expect(color.getGreen()).toBe(0);
            expect(color.getBlue()).toBe(0);
            expect(color.getAlpha()).toBe(0);
        });
        it("clamps values to maximum 1", () => {
            const color = new RGBAColor(1.1, 1.2, 1.3, 1.4);
            expect(color.getRed()).toBe(1);
            expect(color.getGreen()).toBe(1);
            expect(color.getBlue()).toBe(1);
            expect(color.getAlpha()).toBe(1);
        });
    });

    describe("fromJSON", () => {
        it("deserializes color from ARGB HTML string", () => {
            expect(RGBAColor.fromJSON("#45112233")).toEqual(new RGBAColor(0x11 / 255, 0x22 / 255, 0x33 / 255,
                0x45 / 255));
            expect(RGBAColor.fromJSON(" #eDAACcfF ")).toEqual(new RGBAColor(0xaa / 255, 0xcc / 255, 0xff / 255,
                0xed / 255));
        });
        it("deserializes color from RGB CSS string", () => {
            expect(RGBAColor.fromJSON("rgba(123,213,99,0.1)")).toEqual(
                new RGBAColor(123 / 255, 213 / 255, 99 / 255, 0.1));
            expect(RGBAColor.fromJSON("rgba(10.9, -30, 9e+1, 1)")).toEqual(
                new RGBAColor(10.9 / 255, -30 / 255, 90 / 255, 1));
            expect(RGBAColor.fromJSON(" rgba ( 10% , -5% , 99.9% , 0 ) ")).toEqual(
                new RGBAColor(10 / 100, -5 / 100, 99.9 / 100, 0));
            expect(RGBAColor.fromJSON("rgba(1% 2% 3% 0.01)")).toEqual(new RGBAColor(1 / 100, 2 / 100, 3 / 100, 0.01));
        });
        it("throws exception when invalid format", () => {
            expect(() => RGBAColor.fromJSON("rgba(fail)")).toThrowWithMessage(IllegalArgumentException,
                "Invalid RGBA color format: rgba(fail)");
            expect(() => RGBAColor.fromJSON("rgba(10%/5/6/7)")).toThrowWithMessage(IllegalArgumentException,
                "Invalid RGBA color format: rgba(10%/5/6/7)");
        });
    });

    describe("toJSON", () => {
        it("serializes color to CSS string", () => {
            expect(new RGBAColor(0, 0, 0, 0).toJSON()).toBe("rgba(0%,0%,0%,0)");
        });
    });

    describe("toString", () => {
        it("serializes color to CSS string", () => {
            expect(new RGBAColor(1 / 100, 2 / 100, 3 / 100, 0.9).toString()).toBe("rgba(1%,2%,3%,0.9)");
        });
    });

    describe("toHTML", () => {
        it("serializes color to ARGB HTML string", () => {
            expect(new RGBAColor(0, 0.5, 1, 0.4).toHTML()).toBe("#66007fff");
        });
    });

    describe("toRGBA", () => {
        it("returns itself", () => {
            const color = new RGBAColor(0, 0.5, 1, 0.25);
            expect(color.toRGBA()).toBe(color);
        });
    });

    describe("toRGB", () => {
        it("returns RGB color with removed alpha", () => {
            const rgba = new RGBAColor(0, 0.5, 1, 0.25);
            const rgb = rgba.toRGB();
            expect(rgb).toBeInstanceOf(RGBColor);
            expect(rgb.getRed()).toBe(rgba.getRed());
            expect(rgb.getGreen()).toBe(rgba.getGreen());
            expect(rgb.getBlue()).toBe(rgba.getBlue());
        });
    });

    describe("fromUint32", () => {
        it("creates color from 32 bit integer in little-endian byte order", () => {
            expect(RGBAColor.fromUint32(0x87654321, true)).toEqual(
                new RGBAColor(0x21 / 255, 0x43 / 255, 0x65 / 255, 0x87 / 255));
        });
        it("creates color from 32 bit integer in big-endian byte order", () => {
            expect(RGBAColor.fromUint32(0x87654321, false)).toEqual(
                new RGBAColor(0x87 / 255, 0x65 / 255, 0x43 / 255, 0x21 / 255));
        });
        it("uses native byte order by default", () => {
            expect(RGBAColor.fromUint32(0x87654321)).toEqual(RGBAColor.fromUint32(0x87654321, isLittleEndian()));
        });
    });

    describe("toUint32", () => {
        it("returns color as 32 bit integer in little-endian byte order", () => {
            expect(new RGBAColor(0x12 / 255, 0x34 / 255, 0x56 / 255, 0x78 / 255).toUint32(true)).toBe(0x78563412);
        });
        it("returns color as 32 bit integer in big-endian byte order", () => {
            expect(new RGBAColor(0x12 / 255, 0x34 / 255, 0x56 / 255, 0x78 / 255).toUint32(false)).toBe(0x12345678);
        });
        it("uses native byte order by default", () => {
            expect(new RGBAColor(0x12 / 255, 0x34 / 255, 0x56 / 255, 0x78 / 255).toUint32()).toBe(
                new RGBAColor(0x12 / 255, 0x34 / 255, 0x56 / 255, 0x78 / 255).toUint32(isLittleEndian()));
        });
    });

    describe("fromUint8", () => {
        it("creates color from byte array", () => {
            expect(RGBAColor.fromUint8([ 0x12, 0x34, 0x56, 0x78 ])).toEqual(
                new RGBAColor(0x12 / 255, 0x34 / 255, 0x56 / 255, 0x78 / 255));
        });
        it("honors given offset address", () => {
            expect(RGBAColor.fromUint8([ 0, 0x12, 0x34, 0x56, 0x78 ], 1)).toEqual(
                new RGBAColor(0x12 / 255, 0x34 / 255, 0x56 / 255, 0x78 / 255));
        });
        it("creates color from Uint8Array", () => {
            expect(RGBAColor.fromUint8(new Uint8Array([ 0, 0x12, 0x34, 0x56, 0x78 ]), 1)).toEqual(
                new RGBAColor(0x12 / 255, 0x34 / 255, 0x56 / 255, 0x78 / 255));
        });
    });

    describe("toUint8", () => {
        it("creates new typed array if none specified", () => {
            expect(new RGBAColor(0x12 / 255, 0x34 / 255, 0x56 / 255, 0x78 / 255).toUint8()).toEqual(
                new Uint8Array([ 0x12, 0x34, 0x56, 0x78 ]));
        });
        it("writes bytes to given array at given offset", () => {
            const data = new Uint8Array([ 1, 2, 3, 4, 5 ]);
            const result = new RGBAColor(0x12 / 255, 0x34 / 255, 0x56 / 255, 0x78 / 255).toUint8(data, 1);
            expect(data).toEqual(new Uint8Array([ 1, 0x12, 0x34, 0x56, 0x78 ]));
            expect(result).toBe(data);
        });
    });
});
