/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { Matrix2 } from "../../main/graphics/Matrix2";
import { Matrix3 } from "../../main/graphics/Matrix3";
import { Matrix4 } from "../../main/graphics/Matrix4";
import { Vector3 } from "../../main/graphics/Vector3";

describe("Matrix3", () => {
    describe("constructor", () => {
        it("initializes identity matrix if no arguments are given", () => {
            const m = new Matrix3();
            expect(m.toJSON()).toEqual([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ]);
        });
        it("initializes matrix with given elements", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(m.toJSON()).toEqual([
                 1, 2, 3,
                 4, 5, 6,
                 7, 8, 9
            ]);
        });
        it("initializes matrix from three vectors", () => {
            const m = new Matrix3(
                new Vector3(1, 2, 3),
                new Vector3(4, 5, 6),
                new Vector3(7, 8, 9)
            );
            expect(m.toJSON()).toEqual([
                 1, 2, 3,
                 4, 5, 6,
                 7, 8, 9
            ]);
        });
        it("initializes matrix from a buffer without offset", () => {
            const array = new Float32Array(9);
            const m = new Matrix3(array.buffer);
            m.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(Array.from(array)).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
        });
        it("initializes matrix from a buffer with offset", () => {
            const array = new Float32Array(11);
            const m = new Matrix3(array.buffer, 4);
            m.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]);
        });
        it("initializes matrix from other 2x2 matrix", () => {
            const a = new Matrix2(1, 2, 3, 4);
            const b = new Matrix3(a);
            a.set(2, 3, 4, 5);
            expect(b.toJSON()).toEqual([ 1, 2, 0, 3, 4, 0, 0, 0, 1 ]);
        });
        it("initializes matrix from other 3x3 matrix", () => {
            const a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const b = new Matrix3(a);
            a.set(2, 3, 4, 5, 6, 7, 8, 9, 10);
            expect(b.toJSON()).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
        });
        it("initializes matrix from other 4x4 matrix", () => {
            const a = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = new Matrix3(a);
            a.set(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            expect(b.toJSON()).toEqual([ 1, 2, 3, 5, 6, 7, 9, 10, 11 ]);
        });
    });

    describe("m* getters", () => {
        it("reads the matrix components", () => {
            const m = new Matrix3(2, 3, 4, 5, 6, 7, 8, 9, 10);
            expect(m.m11).toBe(2);
            expect(m.m12).toBe(3);
            expect(m.m13).toBe(4);
            expect(m.m21).toBe(5);
            expect(m.m22).toBe(6);
            expect(m.m23).toBe(7);
            expect(m.m31).toBe(8);
            expect(m.m32).toBe(9);
            expect(m.m33).toBe(10);
        });
    });

    describe("m* setters", () => {
        it("sets the matrix components", () => {
            const m = new Matrix3();
            m.m11 = 2;
            m.m12 = 4;
            m.m13 = 6;
            m.m21 = 8;
            m.m22 = 10;
            m.m23 = 12;
            m.m31 = 14;
            m.m32 = 16;
            m.m33 = 18;
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12, 14, 16, 18 ]);
        });
    });

    describe("set", () => {
        it("sets the matrix components", () => {
            const m = new Matrix3();
            m.set(2, 4, 6, 8, 10, 12, 14, 16, 18);
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12, 14, 16, 18 ]);
        });
        it("sets the matrix components from three vectors", () => {
            const m = new Matrix3();
            m.set(new Vector3(2, 4, 6), new Vector3(8, 10, 12), new Vector3(14, 16, 18));
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12, 14, 16, 18 ]);
        });
        it("sets the matrix components from other 2x2 matrix", () => {
            const m = new Matrix3();
            m.set(new Matrix2(2, 4, 6, 8));
            expect(m.toJSON()).toEqual([ 2, 4, 0, 6, 8, 0, 0, 0, 1 ]);
        });
        it("sets the matrix components from other 3x3 matrix", () => {
            const m = new Matrix3();
            m.set(new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9));
            expect(m.toJSON()).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
        });
        it("sets the matrix components from other 4x4 matrix", () => {
            const m = new Matrix3();
            m.set(new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16));
            expect(m.toJSON()).toEqual([ 1, 2, 3, 5, 6, 7, 9, 10, 11 ]);
        });
    });

    describe("clone", () => {
        it("returns new matrix", () => {
            const matrix = new Matrix3(6, 7, 1, 2, 3, 4, 5, 8, 9);
            const clone = matrix.clone();
            expect(clone).toBeInstanceOf(Matrix3);
            expect(clone.toJSON()).toEqual([ 6, 7, 1, 2, 3, 4, 5, 8, 9 ]);
            expect(clone).not.toBe(matrix);
        });
    });

    describe("toJSON()", () => {
        it("returns array with the matrix components", () => {
            expect(new Matrix3(
                1, 2.123456789, 3,
                4, 5, 6,
                7, 8, 9
            ).toJSON()).toEqual([
                1, 2.1234567165374756, 3,
                4, 5, 6,
                7, 8, 9
            ]);
        });
        it("returns array with the matrix components with given number of fraction digits", () => {
            expect(new Matrix3(
                1.1234567, -2.827634687, 9.998,
                5.499, -444.192938, 0.928374,
                678.8283, -0.4491, 345345.23411
            ).toJSON(2)).toEqual([
                1.12, -2.83, 10,
                5.5, -444.19, 0.93,
                678.83, -0.45, 345345.22
            ]);
        });
    });

    describe("fromJSON", () => {
        it("constructs matrix from component array", () => {
            const m = Matrix3.fromJSON([ 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
            expect(m).toBeInstanceOf(Matrix3);
            expect(m.toJSON()).toEqual([ 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
        });
    });

    describe("equals", () => {
        it("correctly implements the equality contract", () => {
            expect(new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9)).toBeEquatable([
                new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9)
            ], [
                new Matrix3(0, 2, 3, 4, 5, 6, 7, 8, 9),
                new Matrix3(1, 0, 3, 4, 5, 6, 7, 8, 9),
                new Matrix3(1, 2, 0, 4, 5, 6, 7, 8, 9),
                new Matrix3(1, 2, 3, 0, 5, 6, 7, 8, 9),
                new Matrix3(1, 2, 3, 4, 0, 6, 7, 8, 9),
                new Matrix3(1, 2, 3, 4, 5, 0, 7, 8, 9),
                new Matrix3(1, 2, 3, 4, 5, 6, 0, 8, 9),
                new Matrix3(1, 2, 3, 4, 5, 6, 7, 0, 9),
                new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 0)
            ]);
        });
        it("supports reducing precision for equality check", () => {
            expect(new Matrix3(
                1.23456, -2.34567, 1.23456,
                1.23456, -2.34567, 1.23456,
                1.23456, -2.34567, 1.23456
            ).equals(new Matrix3(
                1.231, -2.349, 1.231,
                1.231, -2.349, 1.231,
                1.231, -2.349, 1.231
            ), 2)).toBe(true);
            expect(new Matrix3(
                1.23456, -2.34567, 1.23456,
                1.23456, -2.34567, 1.23456,
                1.23456, -2.34567, 1.23456
            ).equals(new Matrix3(
                1.231, -2.349, 1.231,
                1.231, -2.349, 1.231,
                1.231, -2.349, 1.231
            ), 3)).toBe(false);
        });
    });

    describe("isIdentity", () => {
        it("returns true if matrix is an identity matrix", () => {
            expect(new Matrix3(
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ).isIdentity()).toBe(true);
        });
        it("returns false if matrix is not an identity matrix", () => {
            expect(new Matrix3(2, 0, 0, 0, 1, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix3(1, 2, 0, 0, 1, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix3(1, 0, 2, 0, 1, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix3(1, 0, 0, 2, 1, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix3(1, 0, 0, 0, 2, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix3(1, 0, 0, 0, 1, 2, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix3(1, 0, 0, 0, 1, 0, 2, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix3(1, 0, 0, 0, 1, 0, 0, 2, 1).isIdentity()).toBe(false);
            expect(new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 2).isIdentity()).toBe(false);
        });
    });

    describe("getDeterminant", () => {
        it("returns the matrix determinant", () => {
            expect(new Matrix3(6, 3, 1, 7, 20, -3, 5, 8, 30).getDeterminant()).toBe(3025);
            expect(new Matrix3(41, 13, -51, 13, 812, 121, -44, 0, 51).getDeterminant()).toBe(-202067);
            expect(new Matrix3(1, 5, 3, 10, 9, 8, 4, 6, 2).getDeterminant()).toBe(102);
        });
    });

    describe("invert", () => {
        it("inverts the matrix", () => {
            const m = new Matrix3(1, 5, 3, 10, 9, 8, 4, 6, 2);
            const result = m.invert();
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                -0.294118,  0.0784314,  0.127451,
                 0.117647, -0.0980392,  0.215686,
                 0.235294,  0.1372550, -0.401961
            ]);
        });
    });

    describe("transpose", () => {
        it("transposes the matrix", () => {
            const m = new Matrix3(1, 5, 3, 7, 9, 8, 4, 6, 2);
            const result = m.transpose();
            expect(result).toBe(m);
            expect(result.toJSON()).toEqual([
                1, 7, 4,
                5, 9, 6,
                3, 8, 2
            ]);
        });
    });

    describe("adjugate", () => {
        it("adjugates the matrix", () => {
            const m = new Matrix3(6, 3, 1, 7, 20, -3, 5, 8, 30);
            const result = m.adjugate();
            expect(result).toBe(m);
            expect(result.toJSON()).toEqual([
                 624, -82, -29,
                -225, 175,  25,
                 -44, -33,  99
            ]);
        });
    });

    describe("add", () => {
        it("adds given value", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.add(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ 3, 4, 5, 6, 7, 8, 9, 10, 11 ]);
        });
        it("adds given matrix", () => {
            const a = new Matrix3(20, 3, 40, 5, 60, 7, 80, 9, 100);
            const b = new Matrix3(3, 40, 5, 60, 7, 80, 9, 100, 11);
            const result = a.add(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 23, 43, 45, 65, 67, 87, 89, 109, 111 ]);
        });
    });

    describe("sub", () => {
        it("subtracts given value", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.sub(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ -1, 0, 1, 2, 3, 4, 5, 6, 7 ]);
        });
        it("subtracts given matrix", () => {
            const a = new Matrix3(20, 3, 40, 5, 60, 7, 80, 9, 100);
            const b = new Matrix3(3, 40, 5, 60, 7, 80, 9, 100, 11);
            const result = a.sub(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 17, -37, 35, -55, 53, -73, 71, -91, 89 ]);
        });
    });

    describe("mul", () => {
        it("multiplies matrix with another matrix", () => {
            const a = new Matrix3(20, 3, 40, 5, 60, 7, 80, 9, 100);
            const b = new Matrix3(3, 40, 5, 60, 7, 80, 9, 100, 11);
            const result = a.mul(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 660, 2454, 900, 7635, 1320, 10449, 1560, 6126, 2160 ]);
        });
    });

    describe("compMul", () => {
        it("multiplies matrix with a factor", () => {
            const m = new Matrix3(20, -3, 40, -5, 60, -7, 80, -9, 100);
            const result = m.compMul(-2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ -40, 6, -80, 10, -120, 14, -160, 18, -200 ]);
        });
        it("multiplies matrix with another matrix", () => {
            const a = new Matrix3(20, -3, 40, -5, 60, -7, 80, -9, 100);
            const b = new Matrix3(3, 40, 5, 60, 7, 80, 9, 100, 11);
            const result = a.compMul(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 60, -120, 200, -300, 420, -560, 720, -900, 1100 ]);
        });
    });

    describe("div", () => {
        it("divides matrix by another matrix", () => {
            const a = new Matrix3(660, 2454, 900, 7635, 1320, 10449, 1560, 6126, 2160);
            const b = new Matrix3(3, 40, 5, 60, 7, 80, 9, 100, 11);
            const result = a.div(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 20, 3, 40, 5, 60, 7, 80, 9, 100 ]);
        });
    });

    describe("compDiv", () => {
        it("divides matrix by scalar", () => {
            const m = new Matrix3(20, -3, 40, -5, 60, -7, 80, -9, 100);
            const result = m.compDiv(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ 10, -1.5, 20, -2.5, 30, -3.5, 40, -4.5, 50 ]);
        });
        it("divides matrix by another matrix component-wise", () => {
            const a = new Matrix3(20, -3, 40, -5, 60, -7, 80, -9, 100);
            const b = new Matrix3(3, 40, 5, 60, 7, 80, 9, 100, 11);
            const result = a.compDiv(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([
                 6.66667, -0.07500,  8.00000,
                -0.08333,  8.57143, -0.08750,
                 8.88889, -0.09000,  9.09091
            ]);
        });
    });
});
