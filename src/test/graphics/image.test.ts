/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import {
    assertImageBitmapSupport, assertImageSupport, hasImageBitmapSupport, hasImageSupport, loadImage
} from "../../main/graphics/image";
import { URI } from "../../main/net/URI";
import { IOException, UnsupportedOperationException } from "../../main/util/exception";
import { isBrowser, isNodeJS } from "../../main/util/runtime";

describe("image", () => {
    describe("hasImageSupport", () => {
        if (isBrowser()) {
            it("returns true in browser", () => {
                expect(hasImageSupport()).toBe(true);
            });
        } else if (isNodeJS()) {
            it("returns false in NodeJS", () => {
                expect(hasImageSupport()).toBe(false);
            });
        }
    });

    describe("hasImageBitmapSupport", () => {
        if (isBrowser()) {
            it("returns true in browser", () => {
                expect(hasImageBitmapSupport()).toBe(true);
            });
        } else if (isNodeJS()) {
            it("returns false in NodeJS", () => {
                expect(hasImageBitmapSupport()).toBe(false);
            });
        }
    });

    describe("assertImageSupport", () => {
        if (isBrowser()) {
            it("does not throw exception in browser", () => {
                expect(() => assertImageSupport()).not.toThrow();
            });
        } else if (isNodeJS()) {
            it("throws exception in Node.js", () => {
                expect(() => assertImageSupport()).toThrowWithMessage(UnsupportedOperationException,
                    "Runtime has no image support");
            });
        }
    });

    describe("assertImageBitmapSupport", () => {
        if (isBrowser()) {
            it("does not throw exception in browser", () => {
                expect(() => assertImageBitmapSupport()).not.toThrow();
            });
        } else if (isNodeJS()) {
            it("throws exception in Node.js", () => {
                expect(() => assertImageBitmapSupport()).toThrowWithMessage(UnsupportedOperationException,
                    "Runtime has no image bitmap support");
            });
        }
    });

    describe("loadImage", () => {
        const imgURI = URI.fromFile(__filename).resolve("../../../src/test/data/clipper.jpeg");
        if (hasImageSupport()) {
            it("loads an image", async () => {
                const image = await loadImage(imgURI);
                expect(image.width).toBe(512);
                expect(image.height).toBe(320);
            });
            it("uses given crossDomain attribute", async () => {
                const image = await loadImage(imgURI, { crossOrigin: "anonymous" });
                expect(image.crossOrigin).toBe("anonymous");
            });
            it("reports error when image not found", async () => {
                const uri = URI.fromFile(__filename).resolve("../../../src/test/data/not-found.jpeg");
                return expect(loadImage(uri)).rejects.toEqual(
                    new IOException(`Unable to load image with URL '${uri}'`));
            });
            it("reports error when image is broken", async () => {
                const uri = URI.fromFile(__filename).resolve("../../../src/test/data/broken.jpeg");
                return expect(loadImage(uri)).rejects.toEqual(
                    new IOException(`Unable to load image with URL '${uri}'`));
            });
        }
    });
});
