/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Insets } from "../../main/geom/Insets";
import { isInsetsLike } from "../../main/geom/InsetsLike";

describe("InsetsLike", () => {
    describe("isInsetsLike", () => {
        it("returns true when object is an insets-like", () => {
            expect(isInsetsLike(new Insets(2))).toBe(true);
            expect(isInsetsLike({
                getTop() { return 0; },
                getLeft() { return 0; },
                getRight() { return 0; },
                getBottom() { return 0; }
            })).toBe(true);
        });
        it("returns false when object is not an insets-like", () => {
            expect(isInsetsLike([ 1, 2, 3 ])).toBe(false);
            expect(isInsetsLike({})).toBe(false);
            expect(isInsetsLike(34)).toBe(false);
            expect(isInsetsLike("34")).toBe(false);
            expect(isInsetsLike(null)).toBe(false);
            expect(isInsetsLike(undefined)).toBe(false);
            expect(isInsetsLike(true)).toBe(false);
            expect(isInsetsLike({
                getLeft() { return 0; },
                getRight() { return 0; },
                getBottom() { return 0; }
            })).toBe(false);
            expect(isInsetsLike({
                getTop() { return 0; },
                getRight() { return 0; },
                getBottom() { return 0; }
            })).toBe(false);
            expect(isInsetsLike({
                getTop() { return 0; },
                getLeft() { return 0; },
                getBottom() { return 0; }
            })).toBe(false);
            expect(isInsetsLike({
                getTop() { return 0; },
                getLeft() { return 0; },
                getRight() { return 0; }
            })).toBe(false);
        });
    });
});
