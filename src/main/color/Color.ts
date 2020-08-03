/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalArgumentException } from "../util/exception";
import { namedColors } from "./colors";
import { RGBAColor } from "./RGBAColor";
import { RGBColor } from "./RGBColor";

/**
 * Base interface of a color.
 */
export interface Color {
    /**
     * Serializes the color into a string.
     *
     * @return The serialized color.
     */
    toJSON(): string;

    /**
     * Converts the color into a string.
     *
     * @return The color as a string.
     */
    toString(): string;

    /**
     * Converts the color to RGB.
     *
     * @return The RGB color.
     */
    toRGB(): RGBColor;

    /**
     * Converts the color to RGBA.
     *
     * @return The RGBA color.
     */
    toRGBA(): RGBAColor;
}

export namespace Color {
    /**
     * Converts the given string into a color object. The string can be a named color or a color defined in HTML or
     * CSS format.
     *
     * @param s - The color string to parse.
     * @return The parsed color.
     */
    export function fromString(s: string): Color {
        const color = namedColors[s.trim().toLowerCase()];
        if (color != null) {
            return color;
        }

        for (const implementation of [ RGBColor, RGBAColor ]) {
            try {
                return implementation.fromString(s);
            } catch (e) {
                // Incompatible implementation, continue searching
            }
        }
        throw new IllegalArgumentException("Unknown color format: " + s);
    }

    /**
     * Deserializes the given serialized color. This simply does the same same as [[fromString]].
     *
     * @param The serialized color.
     * @return The deserialized color.
     */
    export function fromJSON(json: string): Color {
        return Color.fromString(json);
    }
}
