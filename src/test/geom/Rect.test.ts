/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";
import "@kayahr/jest-matchers";

import { Direction } from "../../main/geom/Direction";
import { Insets } from "../../main/geom/Insets";
import { Point } from "../../main/geom/Point";
import { PointLike } from "../../main/geom/PointLike";
import { Rect } from "../../main/geom/Rect";
import { RectLike } from "../../main/geom/RectLike";
import { Size } from "../../main/geom/Size";
import { SizeLike } from "../../main/geom/SizeLike";
import { IllegalArgumentException } from "../../main/util/exception";

describe("Rect", () => {
    describe("constructor", () => {
        it("be default sets a rectangle with north-west anchor", () => {
            const rect = new Rect(20, 10, 100, 50);
            expect(rect.getLeft()).toBe(20);
            expect(rect.getTop()).toBe(10);
            expect(rect.getWidth()).toBe(100);
            expect(rect.getHeight()).toBe(50);
        });
        it("correctly initializes rectangle with south-east anchor", () => {
            const rect = new Rect(20, 10, 100, 50, Direction.SOUTH_EAST);
            expect(rect.getLeft()).toBe(-80);
            expect(rect.getTop()).toBe(-40);
            expect(rect.getWidth()).toBe(100);
            expect(rect.getHeight()).toBe(50);
        });
        it("correctly initializes rectangle with center anchor", () => {
            const rect = new Rect(20, 10, 100, 50, Direction.CENTER);
            expect(rect.getLeft()).toBe(-30);
            expect(rect.getTop()).toBe(-15);
            expect(rect.getWidth()).toBe(100);
            expect(rect.getHeight()).toBe(50);
        });
        it("corrects negative width height with north-west anchor", () => {
            const rect = new Rect(20, 10, -100, -50, Direction.NORTH_WEST);
            expect(rect.getLeft()).toBe(-80);
            expect(rect.getTop()).toBe(-40);
            expect(rect.getWidth()).toBe(100);
            expect(rect.getHeight()).toBe(50);
        });
        it("corrects negative width height with south-east anchor", () => {
            const rect = new Rect(20, 10, -100, -50, Direction.SOUTH_EAST);
            expect(rect.getLeft()).toBe(20);
            expect(rect.getTop()).toBe(10);
            expect(rect.getWidth()).toBe(100);
            expect(rect.getHeight()).toBe(50);
        });
        it("corrects negative width height with center anchor", () => {
            const rect = new Rect(20, 10, -100, -50, Direction.CENTER);
            expect(rect.getLeft()).toBe(-30);
            expect(rect.getTop()).toBe(-15);
            expect(rect.getWidth()).toBe(100);
            expect(rect.getHeight()).toBe(50);
        });
        it("Allows 0 size", () => {
            const rect = new Rect(20, 10, 0, 0);
            expect(rect.getLeft()).toBe(20);
            expect(rect.getTop()).toBe(10);
            expect(rect.getWidth()).toBe(0);
            expect(rect.getHeight()).toBe(0);
        });
    });

    describe("fromRect", () => {
        it("creates rectangle from rectangle like object", () => {
            const rect = Rect.fromRect({
                getLeft: () => 1,
                getTop: () => 2,
                getWidth: () => 3,
                getHeight: () => 4
            } as RectLike);
            expect(rect).toEqual(new Rect(1, 2, 3, 4));
        });
    });

    describe("fromPoints", () => {
        it("creates rectangle from two points in top-left to bottom-right order", () => {
            const rect = Rect.fromPoints(
                { getX: () => 10, getY: () => 20 } as PointLike,
                { getX: () => 110, getY: () => 70 } as PointLike
            );
            expect(rect).toEqual(new Rect(10, 20, 100, 50));
        });
        it("creates rectangle from two points in bottom-right to top-left order", () => {
            const rect = Rect.fromPoints(
                { getX: () => 110, getY: () => 70 } as PointLike,
                { getX: () => 10, getY: () => 20 } as PointLike
            );
            expect(rect).toEqual(new Rect(10, 20, 100, 50));
        });
    });

    describe("fromSize", () => {
        it("creates rectangle from size with default position 0,0", () => {
            const rect = Rect.fromSize(
                { getWidth: () => 100, getHeight: () => 50 } as SizeLike
            );
            expect(rect).toEqual(new Rect(0, 0, 100, 50));
        });
        it("creates rectangle from negative size", () => {
            const rect = Rect.fromSize(
                { getWidth: () => -100, getHeight: () => -50 } as SizeLike
            );
            expect(rect).toEqual(new Rect(-100, -50, 100, 50));
        });
        it("creates rectangle from size and position with default north-west anchor", () => {
            const rect = Rect.fromSize(
                { getWidth: () => 100, getHeight: () => 50 } as SizeLike,
                { getX: () => 10, getY: () => 20 } as PointLike
            );
            expect(rect).toEqual(new Rect(10, 20, 100, 50));
        });
        it("creates rectangle from size and position with custom anchor", () => {
            const rect = Rect.fromSize(
                { getWidth: () => 100, getHeight: () => 50 } as SizeLike,
                { getX: () => 10, getY: () => 20 } as PointLike,
                Direction.CENTER
            );
            expect(rect).toEqual(new Rect(-40, -5, 100, 50));
        });
    });

    describe("toJSON", () => {
        it("returns JSON representation of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).toJSON()).toEqual({
                left: 1,
                top: 2,
                width: 3,
                height: 4
            });
        });
    });

    describe("toString", () => {
        it("returns string representation of the rectangle", () => {
            expect(new Rect(10, 20, 1024, 768).toString()).toBe("1024x768+10+20");
            expect(new Rect(5.6, -7.8, 1.2, 3.4).toString()).toBe("1.2x3.4+5.6-7.8");
            expect(new Rect(-1e21, -1e-6, 1e21, 1e-6).toString()).toBe(
                "1000000000000000000000x0.000001-1000000000000000000000-0.000001");
        });
        it("supports setting maximum fraction digits", () => {
            expect(new Rect(1.234567890, 2.34567890, 3.4567890, 4.567890).toString(3)).toBe("3.457x4.568+1.235+2.346");
        });
    });

    describe("fromString", () => {
        it("creates rectangle from a string", () => {
            expect(Rect.fromString("103.1 x 9-1-2")).toEqual(new Rect(-1, -2, 103.1, 9));
            expect(Rect.fromString(" 1024 768 1 2")).toEqual(new Rect(1, 2, 1024, 768));
            expect(Rect.fromString("1  /  2 -3 _ 4")).toEqual(new Rect(-3, 4, 1, 2));
            expect(Rect.fromString("1000000000000000000000x0.000001-1000000000000000000000-0.000001")).toEqual(
                new Rect(-1000000000000000000000, -0.000001, 1000000000000000000000, 0.000001));
        });
        it("throws error when rectangle string is invalid", () => {
            expect(() => Rect.fromString("+++")).toThrowWithMessage(IllegalArgumentException,
                "Invalid rectangle string: +++");
        });
    });

    describe("fromJSON", () => {
        it("deserializes rectangle from JSON", () => {
            expect(Rect.fromJSON({ left: 1, top: 2, width: 3, height: 4 })).toEqual(new Rect(1, 2, 3, 4));
        });
    });

    describe("isNull", () => {
        it("checks if all rectangle components are 0", () => {
            expect(new Rect(0, 0, 0, 0).isNull()).toBe(true);
            expect(new Rect(0, 1, 0, 0).isNull()).toBe(false);
            expect(new Rect(0, 0, 1, 0).isNull()).toBe(false);
            expect(new Rect(0, 0, 0, 1).isNull()).toBe(false);
            expect(new Rect(-1, 0, 0, 0).isNull()).toBe(false);
            expect(new Rect(0, -1, 0, 0).isNull()).toBe(false);
            expect(new Rect(0, 0, -1, 0).isNull()).toBe(false);
            expect(new Rect(0, 0, 0, -1).isNull()).toBe(false);
        });
    });

    describe("transpose", () => {
        it("swaps X and Y coordinates and width and height", () => {
            const rect = new Rect(1, 2, 3, 4);
            const transposed = rect.transpose();
            expect(transposed).toEqual(new Rect(2, 1, 4, 3));
            expect(transposed).not.toBe(rect);
        });
    });

     describe("equals", () => {
        it("checks if rectangles are equal", () => {
            expect(new Rect(1, 2, 3, 4)).toBeEquatable([
                new Rect(1, 2, 3, 4),
                new Rect(1, 6, 3, -4)
            ], [
                new Rect(9, 2, 3, 4),
                new Rect(1, 9, 3, 4),
                new Rect(1, 2, 9, 4),
                new Rect(1, 2, 3, 9)
            ]);
        });
    });

    describe("getX", () => {
        it("returns X position for given anchor", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getX()).toBe(1);
            expect(rect.getX(Direction.NORTH_WEST)).toBe(1);
            expect(rect.getX(Direction.WEST)).toBe(1);
            expect(rect.getX(Direction.SOUTH_WEST)).toBe(1);
            expect(rect.getX(Direction.NORTH)).toBe(2.5);
            expect(rect.getX(Direction.CENTER)).toBe(2.5);
            expect(rect.getX(Direction.SOUTH)).toBe(2.5);
            expect(rect.getX(Direction.NORTH_EAST)).toBe(4);
            expect(rect.getX(Direction.EAST)).toBe(4);
            expect(rect.getX(Direction.SOUTH_EAST)).toBe(4);
        });
    });

    describe("getY", () => {
        it("returns Y position for given anchor", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getY()).toBe(2);
            expect(rect.getY(Direction.NORTH_WEST)).toBe(2);
            expect(rect.getY(Direction.NORTH)).toBe(2);
            expect(rect.getY(Direction.NORTH_EAST)).toBe(2);
            expect(rect.getY(Direction.WEST)).toBe(4);
            expect(rect.getY(Direction.CENTER)).toBe(4);
            expect(rect.getY(Direction.EAST)).toBe(4);
            expect(rect.getY(Direction.SOUTH_WEST)).toBe(6);
            expect(rect.getY(Direction.SOUTH)).toBe(6);
            expect(rect.getY(Direction.SOUTH_EAST)).toBe(6);
        });
    });

    describe("getLocation", () => {
        it("returns location for given anchor", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getLocation()).toEqual(new Point(1, 2));
            expect(rect.getLocation(Direction.NORTH_WEST)).toEqual(new Point(1, 2));
            expect(rect.getLocation(Direction.WEST)).toEqual(new Point(1, 4));
            expect(rect.getLocation(Direction.SOUTH_WEST)).toEqual(new Point(1, 6));
            expect(rect.getLocation(Direction.NORTH)).toEqual(new Point(2.5, 2));
            expect(rect.getLocation(Direction.CENTER)).toEqual(new Point(2.5, 4));
            expect(rect.getLocation(Direction.SOUTH)).toEqual(new Point(2.5, 6));
            expect(rect.getLocation(Direction.NORTH_EAST)).toEqual(new Point(4, 2));
            expect(rect.getLocation(Direction.EAST)).toEqual(new Point(4, 4));
            expect(rect.getLocation(Direction.SOUTH_EAST)).toEqual(new Point(4, 6));
        });
    });

    describe("setLocation", () => {
        it("moves the rectangle to new location", () => {
            expect(new Rect(1, 2, 3, 4).setLocation(new Point(10, 20))).toEqual(new Rect(10, 20, 3, 4));
            expect(new Rect(1, 2, 3, 4).setLocation(new Point(10, 20), Direction.SOUTH_EAST))
                .toEqual(new Rect(7, 16, 3, 4));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.setLocation(new Point(0, 0))).not.toBe(rect);
            expect(rect.setLocation(new Point(1, 2))).toBe(rect);
            expect(rect.setLocation({ getX: () => 4, getY: () => 6 }, Direction.SOUTH_EAST)).toBe(rect);
        });
    });

    describe("move", () => {
        it("moves the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).move(10, -20)).toEqual(new Rect(11, -18, 3, 4));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.move(0, 1)).not.toBe(rect);
            expect(rect.move(1, 0)).not.toBe(rect);
            expect(rect.move(0, 0)).toBe(rect);
        });
    });

    describe("moveTo", () => {
        it("moves the rectangle to give position", () => {
            expect(new Rect(1, 2, 3, 4).moveTo(100, -100)).toEqual(new Rect(100, -100, 3, 4));
            expect(new Rect(1, 2, 3, 4).moveTo(100, -100, Direction.SOUTH_EAST)).toEqual(new Rect(97, -104, 3, 4));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.moveTo(0, 0)).not.toBe(rect);
            expect(rect.moveTo(1, 2)).toBe(rect);
            expect(rect.moveTo(4, 6, Direction.SOUTH_EAST)).toBe(rect);
        });
    });

    describe("moveToPoint", () => {
        it("moves the rectangle to give position", () => {
            expect(new Rect(1, 2, 3, 4).moveToPoint(new Point(100, -100))).toEqual(new Rect(100, -100, 3, 4));
            expect(new Rect(1, 2, 3, 4).moveToPoint(new Point(100, -100), Direction.SOUTH_EAST))
                .toEqual(new Rect(97, -104, 3, 4));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.moveToPoint(new Point(0, 0))).not.toBe(rect);
            expect(rect.moveToPoint(new Point(1, 2))).toBe(rect);
            expect(rect.moveToPoint(new Point(4, 6), Direction.SOUTH_EAST)).toBe(rect);
        });
    });

    describe("getLeft", () => {
        it("returns the left edge of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getLeft()).toBe(1);
        });
    });

    describe("getTop", () => {
        it("returns the top edge of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getTop()).toBe(2);
        });
    });

    describe("getWidth", () => {
        it("returns the width of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getWidth()).toBe(3);
        });
    });

    describe("getHeight", () => {
        it("returns height of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getHeight()).toBe(4);
        });
    });

    describe("getTopLeft", () => {
        it("returns the top left corner of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getTopLeft()).toEqual(new Point(1, 2));
        });
        it("caches the result", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getTopLeft()).toBe(rect.getTopLeft());
        });
    });

    describe("getTopRight", () => {
        it("returns the top right corner of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getTopRight()).toEqual(new Point(4, 2));
        });
        it("caches the result", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getTopRight()).toBe(rect.getTopRight());
        });
    });

    describe("getBottomRight", () => {
        it("returns the bottom right corner of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getBottomRight()).toEqual(new Point(4, 6));
        });
        it("caches the result", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getBottomRight()).toBe(rect.getBottomRight());
        });
    });

    describe("getBottomLeft", () => {
        it("returns the bottom left corner of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getBottomLeft()).toEqual(new Point(1, 6));
        });
        it("caches the result", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getBottomLeft()).toBe(rect.getBottomLeft());
        });
    });

    describe("getCenter", () => {
        it("returns the center of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getCenter()).toEqual(new Point(2.5, 4));
        });
        it("caches the result", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getCenter()).toBe(rect.getCenter());
        });
    });

    describe("getCenterX", () => {
        it("returns the horizontal center of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getCenterX()).toBe(2.5);
        });
    });

    describe("getCenterY", () => {
        it("returns the vertical center of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getCenterY()).toBe(4);
        });
    });

    describe("getSize", () => {
        it("returns the size of the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).getSize()).toEqual(new Size(3, 4));
        });
        it("caches the result", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getSize()).toBe(rect.getSize());
        });
    });

    describe("resize", () => {
        it("resizes the rectangle by given size delta", () => {
            expect(new Rect(1, 2, 3, 4).resize(17, 6)).toEqual(new Rect(1, 2, 20, 10));
            expect(new Rect(1, 2, 3, 4).resize(7, 2, Direction.EAST)).toEqual(new Rect(-6, 1, 10, 6));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.resize(0, 0)).toBe(rect);
            expect(rect.resize(0, 1)).not.toBe(rect);
            expect(rect.resize(1, 0)).not.toBe(rect);
        });
    });

    describe("addSize", () => {
        it("adds given size to rectangle", () => {
            expect(new Rect(1, 2, 3, 4).addSize(new Size(17, 6))).toEqual(new Rect(1, 2, 20, 10));
            expect(new Rect(1, 2, 3, 4).addSize(new Size(7, 2), Direction.EAST)).toEqual(new Rect(-6, 1, 10, 6));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.addSize(new Size(0, 0))).toBe(rect);
            expect(rect.addSize(new Size(0, 1))).not.toBe(rect);
            expect(rect.addSize({ getWidth: () => 1, getHeight: () => 0 })).not.toBe(rect);
        });
    });

    describe("subSize", () => {
        it("subtracts given size from rectangle", () => {
            expect(new Rect(1, 2, 20, 10).subSize(new Size(17, 6))).toEqual(new Rect(1, 2, 3, 4));
            expect(new Rect(-6, 1, 10, 6).subSize(new Size(7, 2), Direction.EAST)).toEqual(new Rect(1, 2, 3, 4));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.subSize(new Size(0, 0))).toBe(rect);
            expect(rect.subSize(new Size(0, 1))).not.toBe(rect);
            expect(rect.subSize({ getWidth: () => 1, getHeight: () => 0 })).not.toBe(rect);
        });
    });

    describe("resizeTo", () => {
        it("resizes the rectangle to given size", () => {
            expect(new Rect(1, 2, 3, 4).resizeTo(20, 10)).toEqual(new Rect(1, 2, 20, 10));
            expect(new Rect(1, 2, 3, 4).resizeTo(10, 6, Direction.EAST)).toEqual(new Rect(-6, 1, 10, 6));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.resizeTo(3, 4)).toBe(rect);
            expect(rect.resizeTo(4, 4)).not.toBe(rect);
            expect(rect.resizeTo(4, 3)).not.toBe(rect);
        });
    });

    describe("setSize", () => {
        it("resizes the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).setSize(new Size(20, 10))).toEqual(new Rect(1, 2, 20, 10));
            expect(new Rect(1, 2, 3, 4).setSize(new Size(10, 6), Direction.EAST)).toEqual(new Rect(-6, 1, 10, 6));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.setSize(new Size(3, 4))).toBe(rect);
            expect(rect.setSize(new Size(4, 4))).not.toBe(rect);
            expect(rect.setSize({ getWidth: () => 4, getHeight: () => 3 })).not.toBe(rect);
        });
    });

    describe("isEmpty", () => {
        it("returns true when rectangle is empty, false if not", () => {
            expect(new Rect(1, 2, 0, 0).isEmpty()).toBe(true);
            expect(new Rect(1, 2, -1, -1).isEmpty()).toBe(false);
            expect(new Rect(1, 2, 1, 0).isEmpty()).toBe(true);
            expect(new Rect(1, 2, 0, 1).isEmpty()).toBe(true);
            expect(new Rect(1, 2, 1, 1).isEmpty()).toBe(false);
        });
    });

    describe("contains", () => {
        it("checks if point is within rectangle", () => {
            expect(new Rect(10, 20, 100, 50).contains(10, 20)).toBe(true);
            expect(new Rect(10, 20, 100, 50).contains(110, 70)).toBe(true);
            expect(new Rect(10, 20, 100, 50).contains(9, 20)).toBe(false);
            expect(new Rect(10, 20, 100, 50).contains(10, 19)).toBe(false);
            expect(new Rect(10, 20, 100, 50).contains(111, 70)).toBe(false);
            expect(new Rect(10, 20, 100, 50).contains(110, 71)).toBe(false);
        });
        it("checks if rectangle is within rectangle", () => {
            expect(new Rect(10, 20, 100, 50).contains(10, 20, 100, 50)).toBe(true);
            expect(new Rect(10, 20, 100, 50).contains(9, 20, 100, 50)).toBe(false);
            expect(new Rect(10, 20, 100, 50).contains(9, 19, 100, 50)).toBe(false);
            expect(new Rect(10, 20, 100, 50).contains(10, 20, 101, 50)).toBe(false);
            expect(new Rect(10, 20, 100, 50).contains(10, 20, 100, 51)).toBe(false);
            expect(new Rect(10, 20, 100, 50).contains(110, 70, -100, -50)).toBe(true);
            expect(new Rect(10, 20, 100, 50).contains(110, 70, 100, 50, Direction.SOUTH_EAST)).toBe(true);
        });
    });

    describe("containsPoint", () => {
        it("checks if point is within rectangle", () => {
            expect(new Rect(10, 20, 100, 50).containsPoint({ getX: () => 10, getY: () => 20 })).toBe(true);
            expect(new Rect(10, 20, 100, 50).containsPoint({ getX: () => 110, getY: () => 70 })).toBe(true);
            expect(new Rect(10, 20, 100, 50).containsPoint({ getX: () => 9, getY: () => 20 })).toBe(false);
            expect(new Rect(10, 20, 100, 50).containsPoint({ getX: () => 10, getY: () => 19 })).toBe(false);
            expect(new Rect(10, 20, 100, 50).containsPoint({ getX: () => 111, getY: () => 70 })).toBe(false);
            expect(new Rect(10, 20, 100, 50).containsPoint({ getX: () => 110, getY: () => 71 })).toBe(false);
        });
    });

    describe("contains", () => {
        it("checks if rectangle is within rectangle", () => {
            expect(new Rect(10, 20, 100, 50).containsRect(
                { getLeft: () => 10, getTop: () => 20, getWidth: () => 100, getHeight: () => 50 })).toBe(true);
            expect(new Rect(10, 20, 100, 50).containsRect(
                { getLeft: () => 9, getTop: () => 20, getWidth: () => 100, getHeight: () => 50 })).toBe(false);
            expect(new Rect(10, 20, 100, 50).containsRect(
                { getLeft: () => 9, getTop: () => 19, getWidth: () => 100, getHeight: () => 50 })).toBe(false);
            expect(new Rect(10, 20, 100, 50).containsRect(
                { getLeft: () => 10, getTop: () => 20, getWidth: () => 101, getHeight: () => 50 })).toBe(false);
            expect(new Rect(10, 20, 100, 50).containsRect(
                { getLeft: () => 10, getTop: () => 20, getWidth: () => 100, getHeight: () => 51 })).toBe(false);
        });
    });

    describe("getIntersection", () => {
        it("returns intersection rectangle", () => {
            expect(new Rect(-1, -1, 4, 3).getIntersection(2, 0, 3, 4)).toEqual(new Rect(2, 0, 1, 2));
            expect(new Rect(-1, -1, 4, 3).getIntersection(2, 0, 3, 1)).toEqual(new Rect(2, 0, 1, 1));
            expect(new Rect(-1, -1, 4, 3).getIntersection(3.5, 2, 3, 4, Direction.CENTER))
                .toEqual(new Rect(2, 0, 1, 2));
        });
        it("returns empty rectangle when rectangles do not intersect", () => {
            expect(new Rect(-1, -1, 4, 3).getIntersection(3, 0, 3, 1)).toEqual(Rect.NULL);
            expect(new Rect(-1, -1, 4, 3).getIntersection(2, 2, 3, 4)).toEqual(Rect.NULL);
            expect(new Rect(-1, -1, 4, 3).getIntersection(2, -1, 3, 4, Direction.SOUTH_WEST)).toEqual(Rect.NULL);
            expect(new Rect(-1, -1, 4, 3).getIntersection(2, -1, 3, 4, Direction.SOUTH_EAST)).toEqual(Rect.NULL);
            expect(new Rect(-1, -1, 4, 3).getIntersection(-1, 2, 3, 4, Direction.SOUTH_EAST)).toEqual(Rect.NULL);
        });
        it("returns new rectangle", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getIntersection(2, 3, 4, 5)).not.toBe(rect);
        });
    });

    describe("getRectIntersection", () => {
        it("returns intersection rectangle", () => {
            expect(new Rect(-1, -1, 4, 3).getRectIntersection(new Rect(2, 0, 3, 4))).toEqual(new Rect(2, 0, 1, 2));
            expect(new Rect(-1, -1, 4, 3).getRectIntersection(new Rect(2, 0, 3, 1))).toEqual(new Rect(2, 0, 1, 1));
            expect(new Rect(-1, -1, 4, 3).getRectIntersection({
                getLeft: () => 0,
                getTop: () => 0,
                getWidth: () => 2,
                getHeight: () => 1
            })).toEqual(new Rect(0, 0, 2, 1));
        });
        it("returns empty rectangle when rectangles do not intersect", () => {
            expect(new Rect(-1, -1, 4, 3).getRectIntersection(new Rect(3, 0, 3, 1))).toEqual(Rect.NULL);
            expect(new Rect(-1, -1, 4, 3).getRectIntersection(new Rect(2, 2, 3, 4))).toEqual(Rect.NULL);
            expect(new Rect(-1, -1, 4, 3).getRectIntersection(new Rect(2, -5, 3, 4))).toEqual(Rect.NULL);
            expect(new Rect(-1, -1, 4, 3).getRectIntersection(new Rect(-1, -5, 3, 4))).toEqual(Rect.NULL);
            expect(new Rect(-1, -1, 4, 3).getRectIntersection(new Rect(-4, -2, 3, 4))).toEqual(Rect.NULL);
        });
        it("returns new rectangle", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.getRectIntersection(new Rect(2, 3, 4, 5))).not.toBe(rect);
        });
    });

    describe("intersects", () => {
        it("returns true if rectangles do intersect", () => {
            expect(new Rect(-1, -1, 4, 3).intersects(2, 0, 3, 4)).toBe(true);
            expect(new Rect(-1, -1, 4, 3).intersects(2, 0, 3, 1)).toBe(true);
            expect(new Rect(-1, -1, 4, 3).intersects(3.5, 2, 3, 4, Direction.CENTER)).toBe(true);
        });
        it("returns false if rectangles do not intersect", () => {
            expect(new Rect(-1, -1, 4, 3).intersects(3, 0, 3, 1)).toBe(false);
            expect(new Rect(-1, -1, 4, 3).intersects(2, 2, 3, 4)).toBe(false);
            expect(new Rect(-1, -1, 4, 3).intersects(2, -1, 3, 4, Direction.SOUTH_WEST)).toBe(false);
            expect(new Rect(-1, -1, 4, 3).intersects(2, -1, 3, 4, Direction.SOUTH_EAST)).toBe(false);
            expect(new Rect(-1, -1, 4, 3).intersects(-1, 2, 3, 4, Direction.SOUTH_EAST)).toBe(false);
        });
    });

    describe("intersectsRect", () => {
        it("returns true if rectangles do intersect", () => {
            expect(new Rect(-1, -1, 4, 3).intersectsRect(new Rect(2, 0, 3, 4))).toBe(true);
            expect(new Rect(-1, -1, 4, 3).intersectsRect(new Rect(2, 0, 3, 1))).toBe(true);
            expect(new Rect(-1, -1, 4, 3).intersectsRect({
                getLeft: () => 0,
                getTop: () => 0,
                getWidth: () => 2,
                getHeight: () => 1
            })).toBe(true);
        });
        it("returns false if rectangles do not intersect", () => {
            expect(new Rect(-1, -1, 4, 3).intersectsRect(new Rect(3, 0, 3, 1))).toBe(false);
            expect(new Rect(-1, -1, 4, 3).intersectsRect(new Rect(2, 2, 3, 4))).toBe(false);
            expect(new Rect(-1, -1, 4, 3).intersectsRect(new Rect(2, -5, 3, 4))).toBe(false);
            expect(new Rect(-1, -1, 4, 3).intersectsRect(new Rect(-1, -5, 3, 4))).toBe(false);
            expect(new Rect(-1, -1, 4, 3).intersectsRect(new Rect(-4, -2, 3, 4))).toBe(false);
        });
    });

    describe("add", () => {
        it("adds point (as coordinates) to rectangle", () => {
            expect(new Rect(1, 2, 3, 4).add(-2, 10)).toEqual(new Rect(-2, 2, 6, 8));
            expect(new Rect(1, 2, 3, 4).add(10, -2)).toEqual(new Rect(1, -2, 9, 8));
        });
        it("adds rectangle (as coordinate) to rectangle, creating a union", () => {
            expect(new Rect(-1, -1, 4, 3).add(2, 0, 3, 4)).toEqual(new Rect(-1, -1, 6, 5));
            expect(new Rect(2, 0, 3, 4).add(3, 2, 4, 3, Direction.SOUTH_EAST)).toEqual(new Rect(-1, -1, 6, 5));
        });
        it("returns new rectangle", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.add(0, 0)).not.toBe(rect);
        });
    });

    describe("addPoint", () => {
        it("adds point to rectangle", () => {
            expect(new Rect(1, 2, 3, 4).addPoint(new Point(-2, 10))).toEqual(new Rect(-2, 2, 6, 8));
            expect(new Rect(1, 2, 3, 4).addPoint(new Point(10, -2))).toEqual(new Rect(1, -2, 9, 8));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.addPoint({ getX: () => 0, getY: () => 0 })).not.toBe(rect);
            expect(rect.addPoint(new Point(1.5, 2.5))).toBe(rect);
        });
    });

    describe("addRect", () => {
        it("creates union of two rectangles", () => {
            expect(new Rect(-1, -1, 4, 3).addRect(new Rect(2, 0, 3, 4))).toEqual(new Rect(-1, -1, 6, 5));
            expect(new Rect(2, 0, 3, 4).addRect(new Rect(-1, -1, 4, 3))).toEqual(new Rect(-1, -1, 6, 5));
            expect(new Rect(2, 0, 3, 4).addRect(new Rect(1000, -1000, 0, 0))).toEqual(new Rect(2, -1000, 998, 1004));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.addRect({
                getLeft: () => 2,
                getTop: () => 3,
                getWidth: () => 4,
                getHeight: () => 5
            })).not.toBe(rect);
            expect(rect.addRect(new Rect(1, 2, 3, 4))).toBe(rect);
            expect(rect.addRect(new Rect(1.1, 2.1, 2, 3))).toBe(rect);
        });
    });

    describe("addInsets", () => {
        it("adds insets to the rectangle", () => {
            expect(new Rect(1, 2, 3, 4).addInsets(new Insets(1, 2, 3, 4))).toEqual(new Rect(-3, 1, 9, 8));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.addInsets(new Insets(1, 0, 0, 0))).not.toBe(rect);
            expect(rect.addInsets(new Insets(0, 1, 0, 0))).not.toBe(rect);
            expect(rect.addInsets(new Insets(0, 0, 1, 0))).not.toBe(rect);
            expect(rect.addInsets(new Insets(0, 0, 0, 1))).not.toBe(rect);
            expect(rect.addInsets({
                getLeft: () => 0,
                getTop: () => 0,
                getRight: () => 0,
                getBottom: () => 0
            })).toBe(rect);
        });
    });

    describe("subInsets", () => {
        it("adds insets to the rectangle", () => {
            expect(new Rect(10, 20, 30, 40).subInsets(new Insets(1, 2, 3, 4))).toEqual(new Rect(14, 21, 24, 36));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.subInsets(new Insets(1, 0, 0, 0))).not.toBe(rect);
            expect(rect.subInsets(new Insets(0, 1, 0, 0))).not.toBe(rect);
            expect(rect.subInsets(new Insets(0, 0, 1, 0))).not.toBe(rect);
            expect(rect.subInsets(new Insets(0, 0, 0, 1))).not.toBe(rect);
            expect(rect.subInsets({
                getLeft: () => 0,
                getTop: () => 0,
                getRight: () => 0,
                getBottom: () => 0
            })).toBe(rect);
        });
    });

    describe("mul", () => {
        it("multiplies the rectangle with the given factors", () => {
            expect(new Rect(1, 2, 3, 4).mul(10)).toEqual(new Rect(10, 20, 30, 40));
            expect(new Rect(1, 2, 3, 4).mul(10, 100)).toEqual(new Rect(10, 200, 30, 400));
            expect(new Rect(1, 2, 3, 4).mul(10, 1, 1, 1)).toEqual(new Rect(10, 2, 3, 4));
            expect(new Rect(1, 2, 3, 4).mul(1, 10, 1, 1)).toEqual(new Rect(1, 20, 3, 4));
            expect(new Rect(1, 2, 3, 4).mul(1, 1, 10, 1)).toEqual(new Rect(1, 2, 30, 4));
            expect(new Rect(1, 2, 3, 4).mul(1, 1, 1, 10)).toEqual(new Rect(1, 2, 3, 40));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.mul(1, 1, 1, 1)).toBe(rect);
            expect(rect.mul(2, 1, 1, 1)).not.toBe(rect);
            expect(rect.mul(1, 2, 1, 1)).not.toBe(rect);
            expect(rect.mul(1, 1, 2, 1)).not.toBe(rect);
            expect(rect.mul(1, 1, 1, 2)).not.toBe(rect);
        });
    });

    describe("div", () => {
        it("divides the rectangle by the given divisors", () => {
            expect(new Rect(10, 20, 30, 40).div(10)).toEqual(new Rect(1, 2, 3, 4));
            expect(new Rect(10, 20, 30, 40).div(10, 1)).toEqual(new Rect(1, 20, 3, 40));
            expect(new Rect(10, 20, 30, 40).div(10, 1, 1, 1)).toEqual(new Rect(1, 20, 30, 40));
            expect(new Rect(10, 20, 30, 40).div(1, 10, 1, 1)).toEqual(new Rect(10, 2, 30, 40));
            expect(new Rect(10, 20, 30, 40).div(1, 1, 10, 1)).toEqual(new Rect(10, 20, 3, 40));
            expect(new Rect(10, 20, 30, 40).div(1, 1, 1, 10)).toEqual(new Rect(10, 20, 30, 4));
        });
        it("returns new rectangle when changed", () => {
            const rect = new Rect(1, 2, 3, 4);
            expect(rect.div(1, 1, 1, 1)).toBe(rect);
            expect(rect.div(2, 1, 1, 1)).not.toBe(rect);
            expect(rect.div(1, 2, 1, 1)).not.toBe(rect);
            expect(rect.div(1, 1, 2, 1)).not.toBe(rect);
            expect(rect.div(1, 1, 1, 2)).not.toBe(rect);
        });
    });
});
