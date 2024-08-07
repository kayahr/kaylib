/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Comparable } from "../lang/Comparable";
import { Equatable, isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { Exception, IllegalStateException } from "../util/exception";
import { normalizePath } from "../util/file";
import { isNodeJS, isWindows } from "../util/runtime";

/** The regular expression used to parse an URI string. */
// eslint-disable-next-line regexp/no-super-linear-backtracking
const URI_REGEXP = /^(?:([a-z][a-z0.9]*):)?((?:\/\/((?:(.*?)@)?([a-z0-9.-]*)(?::(\d+))?))?(.*?)(?:\?(.*?))?)(?:#(.*))?$/i;

/** Thrown when URI could not be parsed. */
export class URISyntaxException extends Exception {}

/**
 * Container for a parsed URI.
 */
export class URI implements Serializable<string>, Equatable, Comparable<URI> {
    private readonly scheme: string | null;
    private readonly rawSchemeSpecificPart: string;
    private readonly schemeSpecificPart: string;
    private readonly rawAuthority: string | null;
    private readonly authority: string | null;
    private readonly rawUserInfo: string | null;
    private readonly userInfo: string | null;
    private readonly host: string | null;
    private readonly port: number;
    private readonly rawPath: string | null;
    private readonly path: string | null;
    private readonly rawQuery: string | null;
    private readonly query: string | null;
    private readonly rawFragment: string | null;
    private readonly fragment: string | null;

    /**
     * Parses the given URI string into an URI object.
     *
     * @param uri - The URI string to parse.
     */
    public constructor(uri: string) {
        const match = URI_REGEXP.exec(uri);
        if (match == null) {
            throw new URISyntaxException("Unable to parse URI: " + uri);
        }
        this.scheme = match[1] ?? null;
        this.rawSchemeSpecificPart = match[2];
        this.schemeSpecificPart = decodeURI(match[2]);
        const opaque = this.scheme != null && !this.rawSchemeSpecificPart.startsWith("/");
        this.rawAuthority = match[3] ?? null;
        this.authority = match[3] != null ? decodeURI(match[3]) : null;
        this.rawUserInfo = match[4] ?? null;
        this.userInfo = match[4] != null ? decodeURI(match[4]) : null;
        this.host = match[5] ?? null;
        this.port = +(match[6] ?? -1);
        this.rawPath = opaque ? null : match[7];
        this.path = opaque ? null : decodeURI(match[7]);
        this.rawQuery = opaque ? null : (match[8] ?? null);
        this.query = opaque ? null : (match[8] != null ? decodeURI(match[8]) : null);
        this.rawFragment = match[9] ?? null;
        this.fragment = match[9] != null ? decodeURI(match[9]) : null;
    }

    public static fromJSON(json: string): URI {
        return new URI(json);
    }

    /**
     * Converts a URL into a URI.
     *
     * @param url - The URL to convert.
     * @return The created URI.
     */
    public static fromURL(url: URL): URI {
        return new URI(url.toString());
    }

    /**
     * Converts operating system specific file path into an URI.
     *
     * @param file - The file path to convert.
     * @return The created URI.
     */
    public static fromFile(file: string): URI {
        if (file.includes("\\")) {
            file = file.replace(/\\/g, "/");
            if (/^[a-z]:/i.exec(file) != null) {
                return new URI(`file:///${file}`);
            }
        } else if (file.startsWith("/")) {
            return new URI(`file://${file}`);
        }
        return new URI(file);
    }

    /** @inheritDoc */
    public toString(): string {
        return (this.scheme != null ? `${this.scheme}:` : "")
            + this.rawSchemeSpecificPart
            + (this.rawFragment != null ? `#${this.rawFragment}` : "");
    }

    /** @inheritDoc */
    public toJSON(): string {
        return this.toString();
    }

    /**
     * Converts the URI into a URL.
     *
     * @return The created URL.
     */
    public toURL(): URL {
        return new URL(this.toString());
    }

    /**
     * Converts this URI into a file path and returns it.
     *
     * @param windows - Set to true to force windows file syntax, false to force unix file syntax. If not specified
     *                  then operating-system specific syntax is used.
     * @return The URI as a file path.
     * @throws IllegalStateError - When URI has a scheme but this scheme is not "file".
     */
    public toFile(windows?: boolean): string {
        if ((this.scheme != null && this.scheme !== "file") || this.path == null) {
            throw new IllegalStateException(`URI '${this}' can't be converted into a file path`);
        }
        const file = this.path;
        if (windows !== false && (windows === true || (isNodeJS() && isWindows()))) {
            if (/^\/[a-z]:/i.exec(file) != null) {
                return file.substring(1).replace(/\//g, "\\");
            } else {
                return file.replace(/\//g, "\\");
            }
        }
        return file;
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.scheme === other.scheme
            && this.rawSchemeSpecificPart === other.rawSchemeSpecificPart && this.rawFragment === other.rawFragment);
    }

    /** @inheritDoc */
    public compareTo(other: URI): number {
        return this.toString().localeCompare(other.toString());
    }

    /**
     * Returns the URI scheme. Null if URI is not absolute and therefor has no scheme.
     *
     * @return The URI scheme or null if not an absolute scheme.
     */
    public getScheme(): string | null {
        return this.scheme;
    }

    /**
     * Checks whether this URI is absolute. A URI is absolute when it has a scheme.
     *
     * @return True if URI is absolute, false if not.
     */
    public isAbsolute(): boolean {
        return this.scheme != null;
    }

    /**
     * Checks whether this URI is opaque. An opaque URI is an absolute URI which scheme specific part does not
     * start with a slash character.
     *
     * @return True if URI is opaque, false if not.
     */
    public isOpaque(): boolean {
        return this.isAbsolute() && !this.rawSchemeSpecificPart.startsWith("/");
    }

    /**
     * Returns the raw scheme specific part. This is the complete part of the URI after the scheme but without the
     * fragment. Escaped characters are not decoded.
     *
     * @return The raw scheme specific part.
     */
    public getRawSchemeSpecificPart(): string {
        return this.rawSchemeSpecificPart;
    }

    /**
     * Returns the scheme specific part. This is the complete part of the URI after the scheme but without the
     * fragment. Escaped characters are decoded.
     *
     * @return The scheme specific part.
     */
    public getSchemeSpecificPart(): string {
        return this.schemeSpecificPart;
    }

    /**
     * Returns the raw authority which is a string containing the user info, the host and the port. Escaped characters
     * are not decoded.
     *
     * @return The raw authority or null if URI has none.
     */
    public getRawAuthority(): string | null {
        return this.rawAuthority;
    }

    /**
     * Returns the authority which is a string containing the user info, the host and the port. Escaped characters
     * are decoded.
     *
     * @return The authority or null if URI has none.
     */
    public getAuthority(): string | null {
        return this.authority;
    }

    /**
     * Returns the raw user info which is the string before the hostname separated with a @-character. Escaped
     * characters are not decoded.
     *
     * @return The raw user info or null if URI has none.
     */
    public getRawUserInfo(): string | null {
        return this.rawUserInfo;
    }

    /**
     * Returns the user info which is the string before the hostname separated with a @-character. Escaped
     * characters are decoded.
     *
     * @return The user info or null if URI has none.
     */
    public getUserInfo(): string | null {
        return this.userInfo;
    }

    /**
     * Returns the host name or null if URI has none.
     *
     * @return The host name or null if URI has none.
     */
    public getHost(): string | null {
        return this.host;
    }

    /**
     * Returns the port number or -1 if URI has none.
     *
     * @return The port number or -1 if URI has none.
     */
    public getPort(): number {
        return this.port;
    }

    /**
     * Returns the raw URI path. Escaped characters are not decoded.
     *
     * @return The raw URI path. Null if URI has none.
     */
    public getRawPath(): string | null {
        return this.rawPath;
    }

    /**
     * Returns the URI path. Escaped characters are decoded.
     *
     * @return The URI path. Null if URI has none.
     */
    public getPath(): string | null {
        return this.path;
    }

    /**
     * Returns the raw query string without the question mark. Escaped characters are not decoded.
     *
     * @return The raw query string. Null if none.
     */
    public getRawQuery(): string | null {
        return this.rawQuery;
    }

    /**
     * Returns the query string without the question mark. Escaped characters are decoded.
     *
     * @return The query string. Null if none.
     */
    public getQuery(): string | null {
        return this.query;
    }

    /**
     * Returns the raw URI fragment without the #-character. Escaped characters are not decoded.
     *
     * @return The raw URI fragment. Null if none.
     */
    public getRawFragment(): string | null {
        return this.rawFragment;
    }

    /**
     * Returns the URI fragment without the #-character. Escaped characters are decoded.
     *
     * @return The URI fragment. Null if none.
     */
    public getFragment(): string | null {
        return this.fragment;
    }

    /**
     * Normalizes the URI and returns the normalized one.
     *
     * @return The normalized URI. May be the same URI when there is nothing to normalize.
     */
    public normalize(): URI {
        if (this.isOpaque() || this.path == null) {
            return this;
        }
        const newPath = normalizePath(this.path, "/");
        if (newPath === this.path) {
            return this;
        }
        return new URI(
            (this.scheme != null ? `${this.scheme}:` : "")
            + (this.rawAuthority != null ? `//${this.rawAuthority}` : "")
            + newPath
            + (this.rawQuery != null ? `?${this.rawQuery}` : "")
            + (this.rawFragment != null ? `#${this.rawFragment}` : "")
        );
    }

    /**
     * Resolves the given URI against this URI.
     *
     * @param uri - The URI to be resolved against this URI.
     * @return The resulting URI.
     */
    public resolve(uri: string): string {
        return this.resolveURI(new URI(uri)).toString();
    }

    /**
     * Resolves the given URI against this URI.
     *
     * @param uri - The URI to be resolved against this URI.
     * @return The resulting URI.
     */
    public resolveURI(uri: URI): URI {
        // If the given URI is already absolute, or if this URI is opaque, then the given URI is returned.
        if (uri.isAbsolute() || this.isOpaque()) {
            return uri;
        }

        const scheme = uri.getScheme();
        const authority = uri.getRawAuthority();
        const path = uri.getRawPath() ?? "";
        const query = uri.getRawQuery();
        const fragment = uri.getRawFragment();

        // If given URL only has a fragment then return base URI with this fragment added.
        if (fragment != null && path === "" && scheme == null && authority == null && query == null) {
            return new URI((this.scheme != null ? `${this.scheme}:` : "")
                + this.rawSchemeSpecificPart
                + `#${fragment}`);
        }

        // Construct a new hierarchical URI in a manner consistent with RFC 2396, section 5.2
        // A new URI is constructed with this URI's scheme and the given URI's query and fragment components.
        const newScheme = this.scheme;
        const newQuery = query;
        const newFragment = fragment;
        let newAuthority: string | null;
        let newPath: string;
        if (authority != null) {
            // If the given URI has an authority component then the new URI's authority and path are taken from the
            // given URI.
            newAuthority = authority;
            newPath = path;
        } else {
            // Otherwise the new URI's authority component is copied from this URI, and its path is resolved
            newAuthority = this.rawAuthority;
            if (path.startsWith("/")) {
                // If the given URI's path is absolute then the new URI's path is taken from the given URI.
                newPath = path;
            } else {
                // Otherwise the given URI's path is relative, and so the new URI's path is computed by resolving the
                // path of the given URI against the path of this URI. This is done by concatenating all but the last
                // segment of this URI's path, if any, with the given URI's path
                const basePath = this.path ?? "";
                newPath = normalizePath(basePath.substring(0, basePath.lastIndexOf("/") + 1) + path, "/");
            }
        }

        // Construct, normalize and return the new URI
        return new URI(
            (newScheme != null ? `${newScheme}:` : "")
            + (newAuthority != null ? `//${newAuthority}` : "")
            + newPath
            + (newQuery != null ? `?${newQuery}` : "")
            + (newFragment != null ? `#${newFragment}` : "")
        );
    }
}
