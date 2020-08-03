/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { UnsupportedOperationException } from "../util/exception";

let canvasSupport: boolean | null = null;
let offscreenCanvasSupport: boolean | null = null;
let imageDataSupport: boolean | null = null;

/**
 * Checks if runtime has canvas support.
 *
 * @return True if runtime has canvas support, false if not.
 */
export function hasCanvasSupport(): boolean {
    return canvasSupport ?? (canvasSupport = typeof HTMLCanvasElement !== "undefined");
}

/**
 * Checks if runtime has offscreen canvas support.
 *
 * @return True if runtime has offscreen canvas support, false if not.
 */
export function hasOffscreenCanvasSupport(): boolean {
    return offscreenCanvasSupport ?? (offscreenCanvasSupport = typeof OffscreenCanvas !== "undefined");
}

/**
 * Checks if runtime has image data support.
 *
 * @return True if runtime has image data support, false if not.
 */
export function hasImageDataSupport(): boolean {
    return imageDataSupport ?? (imageDataSupport = typeof ImageData !== "undefined");
}

/**
 * Throws an exception when runtime has no canvas support.
 */
export function assertCanvasSupport(): void {
    if (!hasCanvasSupport()) {
        throw new UnsupportedOperationException("Runtime has no canvas support");
    }
}

/**
 * Throws an exception when runtime has no offscreen canvas support.
 */
export function assertOffscreenCanvasSupport(): void {
    if (!hasOffscreenCanvasSupport()) {
        throw new UnsupportedOperationException("Runtime has no offscreen canvas support");
    }
}

/**
 * Throws an exception when runtime has no image bitmap support.
 */
export function assertImageDataSupport(): void {
    if (!hasImageDataSupport()) {
        throw new UnsupportedOperationException("Runtime has no image data support");
    }
}

/**
 * Checks if given canvas is an offscreen canvas.
 *
 * @param canvas - The canvas to check.
 * @return True if offscreen canvas, false if not.
 */
export function isOffscreenCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): canvas is OffscreenCanvas {
    return hasOffscreenCanvasSupport() && canvas instanceof OffscreenCanvas;
}

export function createCanvas(width: number, height: number, offscreen?: false): HTMLCanvasElement;
export function createCanvas(width: number, height: number, offscreen?: true): HTMLCanvasElement | OffscreenCanvas;

/**
 * Creates and returns a canvas with the given size. Optionally an offscreen canvas can be created if runtime
 * supports it.
 *
 * @param width     - The canvas width in pixels.
 * @param height    - The canvas height in pixels.
 * @param offscreen - When set to true then an offscreen canvas is created if runtime supports it. If false (default)
 *                    or when runtime doesn't support offscreen canvas then a normal canvas is created instead.
 * @return The created canvas.
 */
export function createCanvas(width: number, height: number, offscreen = false): HTMLCanvasElement | OffscreenCanvas {
    if (offscreen && hasOffscreenCanvasSupport()) {
        return new OffscreenCanvas(width, height);
    } else {
        assertCanvasSupport();
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}

export function getRenderingContext(canvas: OffscreenCanvas, contextId: "2d",
    options?: CanvasRenderingContext2DSettings): OffscreenCanvasRenderingContext2D;
export function getRenderingContext(canvas: HTMLCanvasElement, contextId: "2d",
    options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D;
export function getRenderingContext(canvas: HTMLCanvasElement | OffscreenCanvas, contextId: "2d",
    options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
export function getRenderingContext(canvas: HTMLCanvasElement | OffscreenCanvas, contextId: "bitmaprenderer",
    options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext;
export function getRenderingContext(canvas: HTMLCanvasElement | OffscreenCanvas, contextId: "webgl",
    options?: WebGLContextAttributes): WebGLRenderingContext;
export function getRenderingContext(canvas: HTMLCanvasElement | OffscreenCanvas, contextId: "webgl2",
    options?: WebGLContextAttributes): WebGL2RenderingContext;
export function getRenderingContext(canvas: OffscreenCanvas, contextId: OffscreenRenderingContextId, options?: any):
    OffscreenRenderingContext;
export function getRenderingContext(canvas: HTMLCanvasElement, contextId: string, options?: any): RenderingContext;
export function getRenderingContext(canvas: HTMLCanvasElement | OffscreenCanvas, contextId: string,
    options?: any): RenderingContext | OffscreenRenderingContext;

/**
 * Returns the rendering context with the given ID. Throws an exception instead of returning null when canvas doesn't
 * support the requested context.
 *
 * @param canvas    - The canvas from which to get the context.
 * @param contextId - The context ID.
 * @param options   - Optional context settings.
 * @return The rendering context.
 */
export function getRenderingContext(canvas: HTMLCanvasElement | OffscreenCanvas, contextId: string, options?: unknown):
        OffscreenRenderingContext | RenderingContext {
    const ctx = isOffscreenCanvas(canvas)
        ? canvas.getContext(contextId as OffscreenRenderingContextId, options)
        : canvas.getContext(contextId, options);
    if (ctx == null) {
        throw new UnsupportedOperationException(`Canvas doesn't support '${contextId}' context`);
    }
    return ctx;
}
