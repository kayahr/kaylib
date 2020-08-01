/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Rect } from "../../main/geom/Rect";
import { isRectLike } from "../../main/geom/RectLike";

describe("RectLike", () => {
    describe("isRectLike", () => {
        it("returns true when object is a rect-like", () => {
            expect(isRectLike(new Rect(1, 2, 3, 4))).toBe(true);
            expect(isRectLike({
                getLeft() { return 0; },
                getTop() { return 0; },
                getWidth() { return 0; },
                getHeight() { return 0; }
            })).toBe(true);
        });
        it("returns false when object is not a rect-like", () => {
            expect(isRectLike([ 1, 2, 3, 4 ])).toBe(false);
            expect(isRectLike({})).toBe(false);
            expect(isRectLike(34)).toBe(false);
            expect(isRectLike("34")).toBe(false);
            expect(isRectLike(null)).toBe(false);
            expect(isRectLike(undefined)).toBe(false);
            expect(isRectLike(true)).toBe(false);
            expect(isRectLike({
                getTop() { return 0; },
                getWidth() { return 0; },
                getHeight() { return 0; }
            })).toBe(false);
            expect(isRectLike({
                getLeft() { return 0; },
                getWidth() { return 0; },
                getHeight() { return 0; }
            })).toBe(false);
            expect(isRectLike({
                getLeft() { return 0; },
                getTop() { return 0; },
                getHeight() { return 0; }
            })).toBe(false);
            expect(isRectLike({
                getLeft() { return 0; },
                getTop() { return 0; },
                getWidth() { return 0; }
            })).toBe(false);
        });
    });
});
