/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Point } from "../../main/geom/Point";
import { isPointLike } from "../../main/geom/PointLike";

describe("PointLike", () => {
    describe("isPointLike", () => {
        it("returns true when object is a point-like", () => {
            expect(isPointLike(new Point(1, 2))).toBe(true);
            expect(isPointLike({
                getX() { return 0; },
                getY() { return 0; }
            })).toBe(true);
        });
        it("returns false when object is not an Point-like", () => {
            expect(isPointLike([ 1, 2 ])).toBe(false);
            expect(isPointLike({})).toBe(false);
            expect(isPointLike(34)).toBe(false);
            expect(isPointLike("34")).toBe(false);
            expect(isPointLike(null)).toBe(false);
            expect(isPointLike(undefined)).toBe(false);
            expect(isPointLike(true)).toBe(false);
            expect(isPointLike({
                getX() { return 0; }
            })).toBe(false);
            expect(isPointLike({
                getY() { return 0; }
            })).toBe(false);
        });
    });
});
