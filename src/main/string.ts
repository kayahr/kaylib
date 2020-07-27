/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Regular expression used to split words in a string. Words can be separated by dashes, underscores or white-spaces.
 * Switching from lower-case to upper-case also separates words.
 */
const WORD_SPLIT_REGEXP = /(?:(?<=[a-z])(?=[A-Z])|[-_\s]+)/;

/**
 * Splits the given string into a list of words which can then be concatenated in various forms (dash case, snake case,
 * camel case, ...).
 *
 * @param s - The string to process.
 * @return The string split into words.
 */
export function extractWords(s: string): string[] {
    return s.split(WORD_SPLIT_REGEXP);
}

/**
 * Converts the first character to upper-case and the rest to lower-case
 *
 * @param s - The string to capitalize.
 * @return The capitalized string.
 */
export function capitalize(s: string): string {
    if (s.length === 0) {
        return s;
    } else if (s.length === 1) {
        return s.toUpperCase();
    } else {
        return s[0].toUpperCase() + s.substr(1).toLowerCase();
    }
}

/**
 * Converts the given string to upper snake case.
 *
 * @param s - The string to convert.
 * @return The string in upper snake case.
 */
export function toUpperSnakeCase(s: string): string {
    return extractWords(s).join("_").toUpperCase();
}

/**
 * Converts the given string to lower snake case.
 *
 * @param s - The string to convert.
 * @return The string in lower snake case.
 */
export function toLowerSnakeCase(s: string): string {
    return extractWords(s).join("_").toLowerCase();
}

/**
 * Converts the given string to lower dash case.
 *
 * @param s - The string to convert.
 * @return The string in lower dash case.
 */
export function toLowerDashCase(s: string): string {
    return extractWords(s).join("-").toLowerCase();
}

/**
 * Converts the given string to upper dash case.
 *
 * @param s - The string to convert.
 * @return The string in upper dash case.
 */
export function toUpperDashCase(s: string): string {
    return extractWords(s).join("-").toUpperCase();
}

/**
 * Converts the given string to lower camel case.
 *
 * @param s - The string to convert.
 * @return The string in lower camel case.
 */
export function toLowerCamelCase(s: string): string {
    return extractWords(s).map((s, i) => (i === 0 ? s.toLowerCase() : capitalize(s))).join("");
}

/**
 * Converts the given string to upper camel case.
 *
 * @param s - The string to convert.
 * @return The string in upper camel case.
 */
export function toUpperCamelCase(s: string): string {
    return extractWords(s).map(capitalize).join("");
}
