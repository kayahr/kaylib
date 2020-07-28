/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Size } from "../../main/geom/Size";
import { isSizeLike } from "../../main/geom/SizeLike";

describe("SizeLike", () => {
    describe("isSizeLike", () => {
        it("returns true when object is a size-like", () => {
            expect(isSizeLike(new Size(1, 2))).toBe(true);
            expect(isSizeLike({
                getWidth() { return 0; },
                getHeight() { return 0; }
            })).toBe(true);
        });
        it("returns false when object is not a size-like", () => {
            expect(isSizeLike([ 1, 2 ])).toBe(false);
            expect(isSizeLike({})).toBe(false);
            expect(isSizeLike(34)).toBe(false);
            expect(isSizeLike("34")).toBe(false);
            expect(isSizeLike(null)).toBe(false);
            expect(isSizeLike(undefined)).toBe(false);
            expect(isSizeLike(true)).toBe(false);
            expect(isSizeLike({
                getWidth() { return 0; }
            })).toBe(false);
            expect(isSizeLike({
                getHeight() { return 0; }
            })).toBe(false);
        });
    });
});
