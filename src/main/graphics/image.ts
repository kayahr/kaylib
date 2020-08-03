/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IOException, UnsupportedOperationException } from "../util/exception";

let imageSupport: boolean | null = null;
let imageBitmapSupport: boolean | null = null;

/**
 * Checks if runtime has image support.
 *
 * @return True if runtime has image support, false if not.
 */
export function hasImageSupport(): boolean {
    return imageSupport ?? (imageSupport = typeof HTMLImageElement !== "undefined");
}

/**
 * Checks if runtime has image bitmap support.
 *
 * @return True if runtime has image bitmap support, false if not.
 */
export function hasImageBitmapSupport(): boolean {
    return imageBitmapSupport ?? (imageBitmapSupport = typeof ImageBitmap !== "undefined"
        && typeof createImageBitmap !== "undefined");
}

/**
 * Throws an exception when runtime has no image support.
 */
export function assertImageSupport(): void {
    if (!hasImageSupport()) {
        throw new UnsupportedOperationException("Runtime has no image support");
    }
}

/**
 * Throws an exception when runtime has no image bitmap support.
 */
export function assertImageBitmapSupport(): void {
    if (!hasImageBitmapSupport()) {
        throw new UnsupportedOperationException("Runtime has no image bitmap support");
    }
}

/** Set of options for loading an image. */
export interface LoadImageOptions {
    /** The cross-origin attribute used for image loading. */
    crossOrigin?: "anonymous" | "use-credentials"
}

/**
 * Loads the image from the given URL and returns it after it has finished loading.
 *
 * @param url     - The image URL.
 * @param options - OPtional load image options.
 * @return The loaded image.
 */
export async function loadImage(url: string, options?: LoadImageOptions): Promise<HTMLImageElement> {
    assertImageSupport();
    return new Promise((resolve, reject) => {
        const image = new Image();
        const reset = (): void => {
            image.removeEventListener("load", onload);
            image.removeEventListener("error", onerror);
        };
        const onload = (): void => {
            reset();
            if (image.naturalWidth === 0 || image.naturalHeight === 0) {
                reject(new IOException(`Loaded image '${url}' is empty`));
            } else {
                resolve(image);
            }
        };
        const onerror = (): void => {
            reset();
            reject(new IOException(`Unable to load image with URL '${url}'`));
        };
        image.addEventListener("load", onload);
        image.addEventListener("error", onerror);
        image.crossOrigin = options?.crossOrigin ?? null;
        image.src = url;
    });
}
