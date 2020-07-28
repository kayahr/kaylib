/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Comparable } from "../lang/Comparable";
import { Equatable, isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { Exception } from "../util/exception";

/** The regular expression used to parse an URI string. */
const URI_REGEXP
    = /^(?:([a-z][a-z0.9]*):)?((?:\/\/((?:(.*?)@)?([a-z0-9.-]*)(?::([0-9]+))?))?(.*?)(?:\?(.*?))?)(?:#(.*))?$/i;

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

    public toString(): string {
        return (this.scheme != null ? `${this.scheme}:` : "")
            + this.rawSchemeSpecificPart
            + (this.rawFragment != null ? `#${this.rawFragment}` : "");
    }

    public toJSON(): string {
        return this.toString();
    }

    public static fromJSON(json: string): URI {
        return new URI(json);
    }

    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.scheme === other.scheme
            && this.rawSchemeSpecificPart === other.rawSchemeSpecificPart && this.rawFragment === other.rawFragment);
    }

    public compareTo(other: URI): number {
        return this.toString().localeCompare(other.toString());
    }

    public toURL(): URL {
        return new URL(this.toString());
    }

    public static fromURL(url: URL): URI {
        return new URI(url.toString());
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
}
