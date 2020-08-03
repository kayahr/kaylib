/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import { Color } from "../../main/color/Color";
import { RGBAColor } from "../../main/color/RGBAColor";
import { RGBColor } from "../../main/color/RGBColor";
import { IllegalArgumentException } from "../../main/util/exception";

describe("Color", () => {
    describe("fromJSON", () => {
        it("returns RGBColor for HTML RGB format", () => {
            expect(Color.fromJSON("#112233")).toEqual(new RGBColor(0x11 / 255, 0x22 / 255, 0x33 / 255));
        });
        it("returns RGBAColor for CSS RGBA format", () => {
            expect(Color.fromJSON("rgba(1,2,3,0.4)")).toEqual(new RGBAColor(1 / 255, 2 / 255, 3 / 255, 0.4));
        });
        it("returns named RGB color", () => {
            expect(Color.fromJSON(" BLACK ")).toEqual(new RGBColor(0, 0, 0));
            expect(Color.fromJSON("reD")).toEqual(new RGBColor(1, 0, 0));
            expect(Color.fromJSON("lIme ")).toEqual(new RGBColor(0, 1, 0));
            expect(Color.fromJSON(" blue")).toEqual(new RGBColor(0, 0, 1));
            expect(Color.fromJSON("White")).toEqual(new RGBColor(1, 1, 1));
        });
        it("throws exception when format in unknown", () => {
            expect(() => Color.fromJSON("cmyk(1,2,3,4)")).toThrowWithMessage(IllegalArgumentException,
                "Unknown color format: cmyk(1,2,3,4)");
        });
    });
});
