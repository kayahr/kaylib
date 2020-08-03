/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import {
    assertCanvasSupport, assertImageDataSupport, assertOffscreenCanvasSupport, createCanvas, getRenderingContext,
    hasCanvasSupport, hasImageDataSupport, hasOffscreenCanvasSupport, isOffscreenCanvas
} from "../../main/graphics/canvas";
import { UnsupportedOperationException } from "../../main/util/exception";
import { isBrowser, isNodeJS } from "../../main/util/runtime";

describe("canvas", () => {
    describe("hasCanvasSupport", () => {
        if (isBrowser()) {
            it("returns true in browser", () => {
                expect(hasCanvasSupport()).toBe(true);
            });
        } else if (isNodeJS()) {
            it("returns false in NodeJS", () => {
                expect(hasCanvasSupport()).toBe(false);
            });
        }
    });

    describe("hasOffscreenCanvasSupport", () => {
        if (isBrowser()) {
            it("returns true in browser", () => {
                expect(hasOffscreenCanvasSupport()).toBe(true);
            });
        } else if (isNodeJS()) {
            it("returns false in NodeJS", () => {
                expect(hasOffscreenCanvasSupport()).toBe(false);
            });
        }
    });

    describe("hasImageDataSupport", () => {
        if (isBrowser()) {
            it("returns true in browser", () => {
                expect(hasImageDataSupport()).toBe(true);
            });
        } else if (isNodeJS()) {
            it("returns false in NodeJS", () => {
                expect(hasImageDataSupport()).toBe(false);
            });
        }
    });

    describe("assertCanvasSupport", () => {
        if (isBrowser()) {
            it("does not throw exception in browser", () => {
                expect(() => assertCanvasSupport()).not.toThrow();
            });
        } else if (isNodeJS()) {
            it("throws exception in Node.js", () => {
                expect(() => assertCanvasSupport()).toThrowWithMessage(UnsupportedOperationException,
                    "Runtime has no canvas support");
            });
        }
    });

    describe("assertOffscreenCanvasSupport", () => {
        if (isBrowser()) {
            it("does not throw exception in browser", () => {
                expect(() => assertOffscreenCanvasSupport()).not.toThrow();
            });
        } else if (isNodeJS()) {
            it("throws exception in Node.js", () => {
                expect(() => assertOffscreenCanvasSupport()).toThrowWithMessage(UnsupportedOperationException,
                    "Runtime has no offscreen canvas support");
            });
        }
    });

    describe("assertImageDataSupport", () => {
        if (isBrowser()) {
            it("does not throw exception in browser", () => {
                expect(() => assertImageDataSupport()).not.toThrow();
            });
        } else if (isNodeJS()) {
            it("throws exception in Node.js", () => {
                expect(() => assertImageDataSupport()).toThrowWithMessage(UnsupportedOperationException,
                    "Runtime has no image data support");
            });
        }
    });

    describe("isOffscreenCanvas", () => {
        if (hasOffscreenCanvasSupport()) {
            it("returns true for offscreen canvas", () => {
                expect(isOffscreenCanvas(new OffscreenCanvas(320, 200))).toBe(true);
            });
        }
        if (hasCanvasSupport()) {
            it("returns false for normal canvas", () => {
                expect(isOffscreenCanvas(document.createElement("canvas"))).toBe(false);
            });
        }
    });

    describe("createCanvas", () => {
        if (hasCanvasSupport()) {
            it("creates a new canvas with given size", () => {
                const canvas = createCanvas(12, 34);
                expect(isOffscreenCanvas(canvas)).toBe(false);
                expect(canvas.width).toBe(12);
                expect(canvas.height).toBe(34);
            });

            if (hasOffscreenCanvasSupport()) {
                it("creates a new offscreen canvas with given size", () => {
                    const canvas = createCanvas(12, 34, true);
                    expect(isOffscreenCanvas(canvas)).toBe(true);
                    expect(canvas.width).toBe(12);
                    expect(canvas.height).toBe(34);
                });
            }
        }
    });

    describe("getRenderingContext", () => {
        if (hasCanvasSupport()) {
            it("returns 2D context", () => {
                const ctx = getRenderingContext(createCanvas(12, 34), "2d");
                expect(ctx.canvas.toDataURL).toBeInstanceOf(Function);
            });
            it("throws exception for unsupported context", () => {
                expect(() => getRenderingContext(createCanvas(12, 34), "4d")).toThrowWithMessage(
                    UnsupportedOperationException, "Canvas doesn't support '4d' context");
            });

            if (hasOffscreenCanvasSupport()) {
                it("returns offscreen 2D context from offscreen canvas", () => {
                    const canvas = createCanvas(12, 34, true);
                    if (isOffscreenCanvas(canvas)) {
                        const ctx = getRenderingContext(canvas, "2d");
                        expect(ctx.canvas.convertToBlob).toBeInstanceOf(Function);
                    }
                });
            }
        }
    });
});
