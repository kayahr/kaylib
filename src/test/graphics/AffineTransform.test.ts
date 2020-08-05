/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { AffineTransform } from "../../main/graphics/AffineTransform";
import { Matrix2 } from "../../main/graphics/Matrix2";
import { Matrix3 } from "../../main/graphics/Matrix3";
import { Matrix4 } from "../../main/graphics/Matrix4";
import { Vector2 } from "../../main/graphics/Vector2";

describe("AffineTransform", () => {
    describe("constructor", () => {
        it("initializes identity matrix if no arguments are given", () => {
            const m = new AffineTransform();
            expect(m.toJSON()).toEqual([
                1, 0,
                0, 1,
                0, 0
            ]);
        });
        it("initializes matrix with given elements", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            expect(m.toJSON()).toEqual([
                 1, 2,
                 3, 4,
                 5, 6
            ]);
        });
        it("initializes matrix from three vectors", () => {
            const m = new AffineTransform(
                new Vector2(1, 2),
                new Vector2(3, 4),
                new Vector2(5, 6)
            );
            expect(m.toJSON()).toEqual([
                 1, 2,
                 3, 4,
                 5, 6
            ]);
        });
        it("initializes matrix from a buffer without offset", () => {
            const array = new Float32Array(6);
            const m = new AffineTransform(array.buffer);
            m.set(1, 2, 3, 4, 5, 6);
            expect(Array.from(array)).toEqual([ 1, 2, 3, 4, 5, 6 ]);
        });
        it("initializes matrix from a buffer with offset", () => {
            const array = new Float32Array(8);
            const m = new AffineTransform(array.buffer, 4);
            m.set(1, 2, 3, 4, 5, 6);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 0 ]);
        });
        it("initializes matrix from other 2x2 matrix", () => {
            const a = new Matrix2(1, 2, 3, 4);
            const b = new AffineTransform(a);
            a.set(2, 3, 4, 5);
            expect(b.toJSON()).toEqual([ 1, 2, 3, 4, 0, 0 ]);
        });
        it("initializes matrix from other 3x3 matrix", () => {
            const a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const b = new AffineTransform(a);
            a.set(2, 3, 4, 5, 6, 7, 8, 9, 10);
            expect(b.toJSON()).toEqual([ 1, 2, 4, 5, 7, 8 ]);
        });
        it("initializes matrix from other 4x4 matrix", () => {
            const a = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = new AffineTransform(a);
            a.set(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            expect(b.toJSON()).toEqual([ 1, 2, 5, 6, 9, 10 ]);
        });
    });

    describe("m* getters", () => {
        it("reads the matrix components", () => {
            const m = new AffineTransform(2, 3, 4, 5, 6, 7);
            expect(m.m11).toBe(2);
            expect(m.m12).toBe(3);
            expect(m.m21).toBe(4);
            expect(m.m22).toBe(5);
            expect(m.m31).toBe(6);
            expect(m.m32).toBe(7);
        });
    });

    describe("a-f getters", () => {
        it("reads the matrix components", () => {
            const m = new AffineTransform(2, 3, 4, 5, 6, 7);
            expect(m.a).toBe(2);
            expect(m.b).toBe(3);
            expect(m.c).toBe(4);
            expect(m.d).toBe(5);
            expect(m.e).toBe(6);
            expect(m.f).toBe(7);
        });
    });

    describe("m* setters", () => {
        it("sets the matrix components", () => {
            const m = new AffineTransform();
            m.m11 = 2;
            m.m12 = 4;
            m.m21 = 8;
            m.m22 = 10;
            m.m31 = 14;
            m.m32 = 16;
            expect(m.toJSON()).toEqual([ 2, 4, 8, 10, 14, 16 ]);
        });
    });

    describe("a-f setters", () => {
        it("sets the matrix components", () => {
            const m = new AffineTransform();
            m.a = 2;
            m.b = 4;
            m.c = 8;
            m.d = 10;
            m.e = 14;
            m.f = 16;
            expect(m.toJSON()).toEqual([ 2, 4, 8, 10, 14, 16 ]);
        });
    });

    describe("set", () => {
        it("sets the matrix components", () => {
            const m = new AffineTransform();
            m.set(2, 4, 6, 8, 10, 12);
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12 ]);
        });
        it("sets the matrix components from three vectors", () => {
            const m = new AffineTransform();
            m.set(new Vector2(2, 4), new Vector2(8, 10), new Vector2(14, 16));
            expect(m.toJSON()).toEqual([ 2, 4, 8, 10, 14, 16 ]);
        });
        it("sets the matrix components from other 2x2 matrix", () => {
            const m = new AffineTransform();
            m.set(new Matrix2(2, 4, 6, 8));
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 0, 0 ]);
        });
        it("sets the matrix components from other 3x3 matrix", () => {
            const m = new AffineTransform();
            m.set(new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9));
            expect(m.toJSON()).toEqual([ 1, 2, 4, 5, 7, 8 ]);
        });
        it("sets the matrix components from other 4x4 matrix", () => {
            const m = new AffineTransform();
            m.set(new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16));
            expect(m.toJSON()).toEqual([ 1, 2, 5, 6, 9, 10 ]);
        });
    });

    describe("clone", () => {
        it("returns new matrix", () => {
            const matrix = new AffineTransform(6, 7, 1, 2, 3, 4);
            const clone = matrix.clone();
            expect(clone).toBeInstanceOf(AffineTransform);
            expect(clone.toJSON()).toEqual([ 6, 7, 1, 2, 3, 4 ]);
            expect(clone).not.toBe(matrix);
        });
    });

    describe("toJSON()", () => {
        it("returns array with the matrix components", () => {
            expect(new AffineTransform(
                1, 2.123456789,
                4, 5,
                7, 8,
            ).toJSON()).toEqual([
                1, 2.1234567165374756,
                4, 5,
                7, 8
            ]);
        });
    });

    describe("fromJSON", () => {
        it("constructs matrix from component array", () => {
            const m = AffineTransform.fromJSON([ 2, 3, 4, 5, 6, 7 ]);
            expect(m).toBeInstanceOf(AffineTransform);
            expect(m.toJSON()).toEqual([ 2, 3, 4, 5, 6, 7 ]);
        });
    });

    describe("toString", () => {
        it("returns string representation of matrix", () => {
            const m = new AffineTransform(
                1.234567890, -2.345678901, 3.456789012,
                4.567890123, -5.678901234, 6.789012345
            );
            expect(m.toString()).toBe("[ 1.23457, -2.34568, 3.45679, 4.56789, -5.6789, 6.78901 ]");
        });
        it("allows custom number of maximum fraction digits", () => {
            const m = new AffineTransform(
                1.234567890, -2.345678901, 3.456789012,
                4.567890123, -5.678901234, 6.789012345
            );
            expect(m.toString(2)).toBe("[ 1.23, -2.35, 3.46, 4.57, -5.68, 6.79 ]");
        });
    });

    describe("equals", () => {
        it("correctly implements the equality contract", () => {
            expect(new AffineTransform(1, 2, 3, 4, 5, 6,)).toBeEquatable([
                new AffineTransform(1, 2, 3, 4, 5, 6)
            ], [
                new AffineTransform(0, 2, 3, 4, 5, 6),
                new AffineTransform(1, 0, 3, 4, 5, 6),
                new AffineTransform(1, 2, 0, 4, 5, 6),
                new AffineTransform(1, 2, 3, 0, 5, 6),
                new AffineTransform(1, 2, 3, 4, 0, 6),
                new AffineTransform(1, 2, 3, 4, 5, 0)
            ]);
        });
    });

    describe("isIdentity", () => {
        it("returns true if matrix is an identity matrix", () => {
            expect(new AffineTransform(
                1, 0,
                0, 1,
                0, 0
            ).isIdentity()).toBe(true);
        });
        it("returns false if matrix is not an identity matrix", () => {
            expect(new AffineTransform(2, 0, 0, 1, 0, 0).isIdentity()).toBe(false);
            expect(new AffineTransform(1, 2, 0, 1, 0, 0).isIdentity()).toBe(false);
            expect(new AffineTransform(1, 0, 2, 1, 0, 0).isIdentity()).toBe(false);
            expect(new AffineTransform(1, 0, 0, 2, 0, 0).isIdentity()).toBe(false);
            expect(new AffineTransform(1, 0, 0, 1, 2, 0).isIdentity()).toBe(false);
            expect(new AffineTransform(1, 0, 0, 1, 0, 2).isIdentity()).toBe(false);
        });
    });

    describe("getDeterminant", () => {
        it("returns the matrix determinant", () => {
            expect(new AffineTransform(6, 3, 7, 20, 5, 8).getDeterminant()).toBe(99);
            expect(new AffineTransform(41, 13, 13, 812, -44, 0).getDeterminant()).toBe(33123);
            expect(new AffineTransform(1, 5, 10, 9, 4, 6).getDeterminant()).toBe(-41);
        });
    });

    describe("invert", () => {
        it("inverts the matrix", () => {
            const m = new AffineTransform(1, 5, 10, 9, 4, 6);
            const result = m.invert();
            expect(result.toJSON()).toEqualCloseTo([
                -0.2195121943950653, 0.12195122241973877,
                0.24390244483947754, -0.024390242993831635,
                -0.5853658318519592, -0.3414634168148041
            ]);
        });
    });
});
