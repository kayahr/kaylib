/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";

import { URI, URISyntaxException } from "../../main/net/URI";
import { IllegalStateException } from "../../main/util/exception";
import { isNodeJS, isWindows } from "../../main/util/runtime";

describe("URI", () => {
    describe("constructor", () => {
        it("throws error when URI is invalid", () => {
            expect(() => new URI("\n")).toThrowWithMessage(URISyntaxException, "Unable to parse URI: \n");
        });
        it("can parse an empty URI", () => {
            const uri = new URI("");
            expect(uri.getScheme()).toBeNull();
            expect(uri.isAbsolute()).toBe(false);
            expect(uri.isOpaque()).toBe(false);
            expect(uri.getRawSchemeSpecificPart()).toBe("");
            expect(uri.getSchemeSpecificPart()).toBe("");
            expect(uri.getRawAuthority()).toBeNull();
            expect(uri.getAuthority()).toBeNull();
            expect(uri.getRawUserInfo()).toBeNull();
            expect(uri.getUserInfo()).toBeNull();
            expect(uri.getHost()).toBeNull();
            expect(uri.getPort()).toBe(-1);
            expect(uri.getRawPath()).toBe("");
            expect(uri.getPath()).toBe("");
            expect(uri.getRawQuery()).toBeNull();
            expect(uri.getQuery()).toBeNull();
            expect(uri.getRawFragment()).toBeNull();
            expect(uri.getFragment()).toBeNull();
        });
        it("can parse a URI with a simple path", () => {
            const uri = new URI("foo");
            expect(uri.getScheme()).toBeNull();
            expect(uri.isAbsolute()).toBe(false);
            expect(uri.isOpaque()).toBe(false);
            expect(uri.getRawSchemeSpecificPart()).toBe("foo");
            expect(uri.getSchemeSpecificPart()).toBe("foo");
            expect(uri.getRawAuthority()).toBeNull();
            expect(uri.getAuthority()).toBeNull();
            expect(uri.getRawUserInfo()).toBeNull();
            expect(uri.getUserInfo()).toBeNull();
            expect(uri.getHost()).toBeNull();
            expect(uri.getPort()).toBe(-1);
            expect(uri.getRawPath()).toBe("foo");
            expect(uri.getPath()).toBe("foo");
            expect(uri.getRawQuery()).toBeNull();
            expect(uri.getQuery()).toBeNull();
            expect(uri.getRawFragment()).toBeNull();
            expect(uri.getFragment()).toBeNull();
        });
        it("can parse a URI with a fragment", () => {
            const uri = new URI("foo#bar");
            expect(uri.getScheme()).toBeNull();
            expect(uri.isAbsolute()).toBe(false);
            expect(uri.isOpaque()).toBe(false);
            expect(uri.getRawSchemeSpecificPart()).toBe("foo");
            expect(uri.getSchemeSpecificPart()).toBe("foo");
            expect(uri.getRawAuthority()).toBeNull();
            expect(uri.getAuthority()).toBeNull();
            expect(uri.getRawUserInfo()).toBeNull();
            expect(uri.getUserInfo()).toBeNull();
            expect(uri.getHost()).toBeNull();
            expect(uri.getPort()).toBe(-1);
            expect(uri.getRawPath()).toBe("foo");
            expect(uri.getPath()).toBe("foo");
            expect(uri.getRawQuery()).toBeNull();
            expect(uri.getQuery()).toBeNull();
            expect(uri.getRawFragment()).toBe("bar");
            expect(uri.getFragment()).toBe("bar");
        });
        it("can parse a URI with a query string", () => {
            const uri = new URI("foo?bar=123");
            expect(uri.getScheme()).toBeNull();
            expect(uri.isAbsolute()).toBe(false);
            expect(uri.isOpaque()).toBe(false);
            expect(uri.getRawSchemeSpecificPart()).toBe("foo?bar=123");
            expect(uri.getSchemeSpecificPart()).toBe("foo?bar=123");
            expect(uri.getRawAuthority()).toBeNull();
            expect(uri.getAuthority()).toBeNull();
            expect(uri.getRawUserInfo()).toBeNull();
            expect(uri.getUserInfo()).toBeNull();
            expect(uri.getHost()).toBeNull();
            expect(uri.getPort()).toBe(-1);
            expect(uri.getRawPath()).toBe("foo");
            expect(uri.getPath()).toBe("foo");
            expect(uri.getRawQuery()).toBe("bar=123");
            expect(uri.getQuery()).toBe("bar=123");
            expect(uri.getRawFragment()).toBeNull();
            expect(uri.getFragment()).toBeNull();
        });
        it("can parse a URN", () => {
            const uri = new URI("foo:bar:1234");
            expect(uri.getScheme()).toBe("foo");
            expect(uri.isAbsolute()).toBe(true);
            expect(uri.isOpaque()).toBe(true);
            expect(uri.getRawSchemeSpecificPart()).toBe("bar:1234");
            expect(uri.getSchemeSpecificPart()).toBe("bar:1234");
            expect(uri.getRawAuthority()).toBeNull();
            expect(uri.getAuthority()).toBeNull();
            expect(uri.getRawUserInfo()).toBeNull();
            expect(uri.getUserInfo()).toBeNull();
            expect(uri.getHost()).toBeNull();
            expect(uri.getPort()).toBe(-1);
            expect(uri.getRawPath()).toBeNull();
            expect(uri.getPath()).toBeNull();
            expect(uri.getRawQuery()).toBeNull();
            expect(uri.getQuery()).toBeNull();
            expect(uri.getRawFragment()).toBeNull();
            expect(uri.getFragment()).toBeNull();
        });

        it("can parse full URI", () => {
            const uri = new URI("https://user%20name:pass@host.tld:12345/some%20path?a=1&b=2&c%20d=3#frag%204");
            expect(uri.getScheme()).toBe("https");
            expect(uri.isAbsolute()).toBe(true);
            expect(uri.isOpaque()).toBe(false);
            expect(uri.getRawSchemeSpecificPart()).toBe(
                "//user%20name:pass@host.tld:12345/some%20path?a=1&b=2&c%20d=3");
            expect(uri.getSchemeSpecificPart()).toBe("//user name:pass@host.tld:12345/some path?a=1&b=2&c d=3");
            expect(uri.getRawAuthority()).toBe("user%20name:pass@host.tld:12345");
            expect(uri.getAuthority()).toBe("user name:pass@host.tld:12345");
            expect(uri.getRawUserInfo()).toBe("user%20name:pass");
            expect(uri.getUserInfo()).toBe("user name:pass");
            expect(uri.getHost()).toBe("host.tld");
            expect(uri.getPort()).toBe(12345);
            expect(uri.getRawPath()).toBe("/some%20path");
            expect(uri.getPath()).toBe("/some path");
            expect(uri.getRawQuery()).toBe("a=1&b=2&c%20d=3");
            expect(uri.getQuery()).toBe("a=1&b=2&c d=3");
            expect(uri.getRawFragment()).toBe("frag%204");
            expect(uri.getFragment()).toBe("frag 4");
        });
    });

    describe("toString", () => {
        it("returns the URI as a string", () => {
            expect(new URI("https://foo.tld:321/?arg=1#bar").toString()).toBe("https://foo.tld:321/?arg=1#bar");
            expect(new URI("path").toString()).toBe("path");
        });
    });

    describe("toJSON", () => {
        it("returns the URI as a JSON object", () => {
            expect(new URI("https://foo.tld:321/?arg=1#bar").toJSON()).toBe("https://foo.tld:321/?arg=1#bar");
            expect(new URI("path").toJSON()).toBe("path");
        });
    });

    describe("toFile", () => {
        it("converts relative URI to a file", () => {
            expect(new URI("../path/file").toFile(true)).toBe("..\\path\\file");
            expect(new URI("../path/file").toFile(false)).toBe("../path/file");
        });
        it("converts absolute URI to a file", () => {
            expect(new URI("file:///C:/path/file").toFile(true)).toBe("C:\\path\\file");
            expect(new URI("file:///path/file").toFile(false)).toBe("/path/file");
        });
        it("defaults to operating-system specific conversion", () => {
            if (isNodeJS() && isWindows()) {
                expect(new URI("file:///C:/path/file").toFile()).toBe("C:\\path\\file");
            } else {
                expect(new URI("file:///path/file").toFile()).toBe("/path/file");
            }
        });
        it("throws exception when URI is not a relative path or a non-file scheme", () => {
            expect(() => new URI("http://foo/").toFile()).toThrowWithMessage(IllegalStateException,
                "URI 'http://foo/' can't be converted into a file path");
        });
    });

    describe("fromJSON", () => {
        it("constructs an URI from a JSON object", () => {
            expect(URI.fromJSON("https://foo.tld:321/?arg=1#bar").toString()).toBe("https://foo.tld:321/?arg=1#bar");
            expect(URI.fromJSON("path").toString()).toBe("path");
        });
    });

    describe("fromFile", () => {
        it("converts relative path to relative URI", () => {
            expect(URI.fromFile("../path/file")).toEqual(new URI("../path/file"));
            expect(URI.fromFile("..\\path\\file")).toEqual(new URI("../path/file"));
        });
        it("converts absolute path to URI", () => {
            expect(URI.fromFile("/path/file/")).toEqual(new URI("file:///path/file/"));
            expect(URI.fromFile("C:\\path\\file\\")).toEqual(new URI("file:///C:/path/file/"));
        });
    });

    describe("equals", () => {
        it("returns true if URIs are equal", () => {
            const uri = new URI("https://goo.tld:321/?arg=1#bar");
            expect(uri.equals(uri)).toBe(true);
            expect(uri.equals(new URI("https://goo.tld:321/?arg=1#bar"))).toBe(true);
        });
        it("returns false if URIs are not equal", () => {
            const uri = new URI("https://goo.tld:321/?arg=1#bar");
            expect(uri.equals(null)).toBe(false);
            expect(uri.equals("https://goo.tld:321/?arg=1#bar")).toBe(false);
            expect(uri.equals(new URL("https://goo.tld:321/?arg=1#bar"))).toBe(false);
            expect(uri.equals(new URI("https://goo.tld:321/?arg=1#foo"))).toBe(false);
            expect(uri.equals(new URI("https://goo.tld:321/?arg=2#bar"))).toBe(false);
            expect(uri.equals(new URI("https://goo.tld:123/?arg=1#bar"))).toBe(false);
            expect(uri.equals(new URI("https://foo.tld:321/?arg=1#bar"))).toBe(false);
            expect(uri.equals(new URI("http://goo.tld:321/?arg=1#bar"))).toBe(false);
        });
    });

    describe("compareTo", () => {
        it("sorts URIs alphabetically", () => {
            expect(new URI("a").compareTo(new URI("c"))).toBe(-1);
            expect(new URI("c").compareTo(new URI("a"))).toBe(1);
            expect(new URI("a").compareTo(new URI("a"))).toBe(0);
        });
    });

    describe("toURL", () => {
        it("converts the URI into a URL", () => {
            expect(new URI("https://foo.tld:321/?arg=1#bar").toURL()).toEqual(
                new URL("https://foo.tld:321/?arg=1#bar"));
        });
    });

    describe("fromURL", () => {
        it("converts a URL into a URI", () => {
            expect(URI.fromURL(new URL("https://foo.tld:321/?arg=1#bar")).toString()).toBe(
                "https://foo.tld:321/?arg=1#bar");
        });
    });

    describe("fromFile", () => {
        it("converts a os-specific file system path into a file URI", () => {
            expect(URI.fromFile(__filename).toFile()).toBe(__filename);
        });
    });

    describe("resolveURI", () => {
        it("returns given URI if absolute", () => {
            const baseURI = new URI("http://host/path");
            const uri = new URI("http://otherhost/otherpath");
            expect(baseURI.resolveURI(uri)).toBe(uri);
        });
        it("returns given URI if base URI is opaque", () => {
            const baseURI = new URI("urn:isbn:0123456789");
            const uri = new URI("path");
            expect(baseURI.resolveURI(uri)).toBe(uri);
        });
        it("merges base URI with fragment", () => {
            const baseURI = new URI("http://user:pass@host:123/path?a=1#bar");
            const uri = new URI("#foo");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("http://user:pass@host:123/path?a=1#foo"));
        });
        it("uses authority and path from given URI if authority is given", () => {
            const baseURI = new URI("http://user:pass@host:123/path?a=1#bar");
            const uri = new URI("//user2:pass2@host2:321/path2/");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("http://user2:pass2@host2:321/path2/"));
        });
        it("merges base URI with absolute path", () => {
            const baseURI = new URI("http://user:pass@host:123/path?a=1#bar");
            const uri = new URI("/path2/file");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("http://user:pass@host:123/path2/file"));
        });
        it("merges base URI ending in file with relative path", () => {
            const baseURI = new URI("http://user:pass@host:123/path/file?a=1#bar");
            const uri = new URI("path2/file2");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("http://user:pass@host:123/path/path2/file2"));
        });
        it("merges base URI ending in directory with relative path", () => {
            const baseURI = new URI("http://user:pass@host:123/path/?a=1#bar");
            const uri = new URI("path2/file2");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("http://user:pass@host:123/path/path2/file2"));
        });
        it("uses query from given URI", () => {
            const baseURI = new URI("http://user:pass@host:123/path/?a=1#bar");
            const uri = new URI("path2/file2?b=2");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("http://user:pass@host:123/path/path2/file2?b=2"));
        });
        it("uses fragment from given URI", () => {
            const baseURI = new URI("http://user:pass@host:123/path/?a=1#bar");
            const uri = new URI("path2/file2#foo");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("http://user:pass@host:123/path/path2/file2#foo"));
        });
        it("normalizes merged paths", () => {
            const baseURI = new URI("http://user:pass@host:123/path/foo/?a=1#bar");
            const uri = new URI("../path2/file2");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("http://user:pass@host:123/path/path2/file2"));
        });
        it("merges relative paths", () => {
            const baseURI = new URI("a/b/c");
            const uri = new URI("../d");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("a/d"));
        });
        it("merges relative path with fragment", () => {
            const baseURI = new URI("a/b/c");
            const uri = new URI("#foo");
            expect(baseURI.resolveURI(uri)).toEqual(new URI("a/b/c#foo"));
        });
    });

    describe("resolve", () => {
        it("returns given URI if absolute", () => {
            const baseURI = new URI("http://host/path");
            const uri = "http://otherhost/otherpath";
            expect(baseURI.resolve(uri)).toBe(uri);
        });
        it("returns given URI if base URI is opaque", () => {
            const baseURI = new URI("urn:isbn:0123456789");
            const uri = "path";
            expect(baseURI.resolve(uri)).toBe(uri);
        });
        it("merges base URI with fragment", () => {
            const baseURI = new URI("http://user:pass@host:123/path?a=1#bar");
            const uri = "#foo";
            expect(baseURI.resolve(uri)).toBe("http://user:pass@host:123/path?a=1#foo");
        });
        it("uses authority and path from given URI if authority is given", () => {
            const baseURI = new URI("http://user:pass@host:123/path?a=1#bar");
            const uri = "//user2:pass2@host2:321/path2/";
            expect(baseURI.resolve(uri)).toBe("http://user2:pass2@host2:321/path2/");
        });
        it("merges base URI with absolute path", () => {
            const baseURI = new URI("http://user:pass@host:123/path?a=1#bar");
            const uri = "/path2/file";
            expect(baseURI.resolve(uri)).toBe("http://user:pass@host:123/path2/file");
        });
        it("merges base URI ending in file with relative path", () => {
            const baseURI = new URI("http://user:pass@host:123/path/file?a=1#bar");
            const uri = "path2/file2";
            expect(baseURI.resolve(uri)).toBe("http://user:pass@host:123/path/path2/file2");
        });
        it("merges base URI ending in directory with relative path", () => {
            const baseURI = new URI("http://user:pass@host:123/path/?a=1#bar");
            const uri = "path2/file2";
            expect(baseURI.resolve(uri)).toBe("http://user:pass@host:123/path/path2/file2");
        });
        it("uses query from given URI", () => {
            const baseURI = new URI("http://user:pass@host:123/path/?a=1#bar");
            const uri = "path2/file2?b=2";
            expect(baseURI.resolve(uri)).toBe("http://user:pass@host:123/path/path2/file2?b=2");
        });
        it("uses fragment from given URI", () => {
            const baseURI = new URI("http://user:pass@host:123/path/?a=1#bar");
            const uri = "path2/file2#foo";
            expect(baseURI.resolve(uri)).toBe("http://user:pass@host:123/path/path2/file2#foo");
        });
        it("normalizes merged paths", () => {
            const baseURI = new URI("http://user:pass@host:123/path/foo/?a=1#bar");
            const uri = "../path2/file2";
            expect(baseURI.resolve(uri)).toBe("http://user:pass@host:123/path/path2/file2");
        });
        it("merges relative paths", () => {
            const baseURI = new URI("a/b/c");
            const uri = "../d";
            expect(baseURI.resolve(uri)).toBe("a/d");
        });
        it("merges relative path with fragment", () => {
            const baseURI = new URI("a/b/c");
            const uri = "#foo";
            expect(baseURI.resolve(uri)).toBe("a/b/c#foo");
        });
    });

    describe("normalize", () => {
        it("returns same URI when opaque", () => {
            const uri = new URI("foo:bar:1234");
            expect(uri.normalize()).toBe(uri);
        });
        it("returns same URI when nothing to normalize", () => {
            const uri = new URI("https://host/foo/bar");
            expect(uri.normalize()).toBe(uri);
        });
        it("normalizes URI with all URI components set", () => {
            const uri = new URI("http://user:pass@host:123/a/b/./../c/../d/?a=1#bar");
            expect(uri.normalize()).toEqual(new URI("http://user:pass@host:123/a/d/?a=1#bar"));
        });
        it("normalizes URI which only has a path", () => {
            const uri = new URI("/a/../../b/./../c/../d/");
            expect(uri.normalize()).toEqual(new URI("/d/"));
        });
    });
});
