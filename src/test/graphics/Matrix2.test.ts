/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { Matrix2 } from "../../main/graphics/Matrix2";
import { Matrix3 } from "../../main/graphics/Matrix3";
import { Matrix4 } from "../../main/graphics/Matrix4";
import { Vector2 } from "../../main/graphics/Vector2";

describe("Matrix2", () => {
    describe("constructor", () => {
        it("initializes identity matrix if no arguments are given", () => {
            const m = new Matrix2();
            expect(m.toJSON()).toEqual([
                1, 0,
                0, 1
            ]);
        });
        it("initializes matrix with given elements", () => {
            const m = new Matrix2(1, 2, 3, 4);
            expect(m.toJSON()).toEqual([
                 1, 2,
                 3, 4
            ]);
        });
        it("initializes matrix from two vectors", () => {
            const m = new Matrix2(
                new Vector2(1, 2),
                new Vector2(3, 4)
            );
            expect(m.toJSON()).toEqual([
                 1, 2,
                 3, 4
            ]);
        });
        it("initializes matrix from a buffer without offset", () => {
            const array = new Float32Array(4);
            const m = new Matrix2(array.buffer);
            m.set(1, 2, 3, 4);
            expect(Array.from(array)).toEqual([ 1, 2, 3, 4 ]);
        });
        it("initializes matrix from a buffer with offset", () => {
            const array = new Float32Array(6);
            const m = new Matrix2(array.buffer, 4);
            m.set(1, 2, 3, 4);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 4, 0 ]);
        });
        it("initializes matrix from other 2x2 matrix", () => {
            const a = new Matrix2(1, 2, 3, 4);
            const b = new Matrix2(a);
            a.set(2, 3, 4, 5);
            expect(b.toJSON()).toEqual([ 1, 2, 3, 4 ]);
        });
        it("initializes matrix from other 3x3 matrix", () => {
            const a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const b = new Matrix2(a);
            a.set(2, 3, 4, 5, 6, 7, 8, 9, 10);
            expect(b.toJSON()).toEqual([ 1, 2, 4, 5 ]);
        });
        it("initializes matrix from other 4x4 matrix", () => {
            const a = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = new Matrix2(a);
            a.set(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            expect(b.toJSON()).toEqual([ 1, 2, 5, 6 ]);
        });
    });

    describe("m* getters", () => {
        it("reads the matrix components", () => {
            const m = new Matrix2(2, 3, 4, 5);
            expect(m.m11).toBe(2);
            expect(m.m12).toBe(3);
            expect(m.m21).toBe(4);
            expect(m.m22).toBe(5);
        });
    });

    describe("m* setters", () => {
        it("sets the matrix components", () => {
            const m = new Matrix2();
            m.m11 = 2;
            m.m12 = 4;
            m.m21 = 6;
            m.m22 = 8;
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8 ]);
        });
    });

    describe("set", () => {
        it("sets the matrix components", () => {
            const m = new Matrix2();
            m.set(2, 4, 6, 8);
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8 ]);
        });
        it("sets the matrix components from two vectors", () => {
            const m = new Matrix2();
            m.set(new Vector2(2, 4), new Vector2(6, 8));
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8 ]);
        });
        it("sets the matrix components from other 2x2 matrix", () => {
            const m = new Matrix2();
            m.set(new Matrix2(2, 4, 6, 8));
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8 ]);
        });
        it("sets the matrix components from other 3x3 matrix", () => {
            const m = new Matrix2();
            m.set(new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9));
            expect(m.toJSON()).toEqual([ 1, 2, 4, 5 ]);
        });
        it("sets the matrix components from other 4x4 matrix", () => {
            const m = new Matrix2();
            m.set(new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16));
            expect(m.toJSON()).toEqual([ 1, 2, 5, 6 ]);
        });
    });

    describe("clone", () => {
        it("returns new matrix", () => {
            const matrix = new Matrix2(6, 7, 1, 2);
            const clone = matrix.clone();
            expect(clone).toBeInstanceOf(Matrix2);
            expect(clone.toJSON()).toEqual([ 6, 7, 1, 2 ]);
            expect(clone).not.toBe(matrix);
        });
    });

    describe("toJSON()", () => {
        it("returns array with the matrix components", () => {
            expect(new Matrix2(1, 2.123456789, 3, 4).toJSON()).toEqual([ 1, 2.1234567165374756, 3, 4 ]);
        });
    });

    describe("fromJSON", () => {
        it("constructs matrix from component array", () => {
            const m = Matrix2.fromJSON([ 2, 3, 4, 5 ]);
            expect(m).toBeInstanceOf(Matrix2);
            expect(m.toJSON()).toEqual([ 2, 3, 4, 5 ]);
        });
    });

    describe("toString", () => {
        it("returns string representation of matrix", () => {
            const m = new Matrix2(
                1.234567890, -2.345678901,
                -3.456789012, 4.567890123
            );
            expect(m.toString()).toBe("[ 1.23457, -2.34568, -3.45679, 4.56789 ]");
        });
        it("allows custom number of maximum fraction digits", () => {
            const m = new Matrix2(
                1.234567890, -2.345678901,
                -3.456789012, 4.567890123
            );
            expect(m.toString(2)).toBe("[ 1.23, -2.35, -3.46, 4.57 ]");
        });
    });

    describe("equals", () => {
        it("correctly implements the equality contract", () => {
            expect(new Matrix2(1, 2, 3, 4)).toBeEquatable([ new Matrix2(1, 2, 3, 4) ], [
                new Matrix2(1, 2, 3, 5),
                new Matrix2(1, 2, 5, 4),
                new Matrix2(1, 5, 3, 4),
                new Matrix2(5, 2, 3, 4)
            ]);
        });
    });

    describe("isIdentity", () => {
        it("returns true if matrix is an identity matrix", () => {
            expect(new Matrix2(1, 0, 0, 1).isIdentity()).toBe(true);
        });
        it("returns false if matrix is not an identity matrix", () => {
            expect(new Matrix2(2, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix2(1, 2, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix2(1, 0, 2, 1).isIdentity()).toBe(false);
            expect(new Matrix2(1, 0, 0, 2).isIdentity()).toBe(false);
        });
    });

    describe("getDeterminant", () => {
        it("returns the matrix determinant", () => {
            expect(new Matrix2(1, 2, 3, 4).getDeterminant()).toBe(-2);
            expect(new Matrix2(1, 2, 4, 7).getDeterminant()).toBe(-1);
            expect(new Matrix2(1.1, 2.2, 3.3, 4.4).getDeterminant()).toBeCloseTo(-2.42);
        });
    });

    describe("invert", () => {
        it("inverts the matrix", () => {
            const m = new Matrix2(1, 2, 4, 7);
            const r = m.invert();
            expect(r).toBe(m);
            expect(r.toJSON()).toEqual([
                -7,  2,
                 4, -1
            ]);
        });
    });

    describe("transpose", () => {
        it("transposes the matrix", () => {
            const m = new Matrix2(1, 2, 4, 7);
            const r = m.transpose();
            expect(r).toBe(m);
            expect(r.toJSON()).toEqual([
                1, 4,
                2, 7
            ]);
        });
    });

    describe("adjugate", () => {
        it("adjugates the matrix", () => {
            const m = new Matrix2(1, 2, 4, 7);
            const r = m.adjugate();
            expect(r).toBe(m);
            expect(r.toJSON()).toEqual([
                 7, -4,
                -2,  1
            ]);
        });
    });

    describe("add", () => {
        it("adds given value", () => {
            const m = new Matrix2(1, 2, 3, 4);
            const r = m.add(2);
            expect(r).toBe(m);
            expect(r.toJSON()).toEqualCloseTo([ 3, 4, 5, 6 ]);
        });
        it("adds given matrix", () => {
            const a = new Matrix2(20, 3, 40, 5);
            const b = new Matrix2(3, 40, 5, 60);
            const r = a.add(b);
            expect(r).toBe(a);
            expect(r.toJSON()).toEqualCloseTo([ 23, 43, 45, 65 ]);
        });
    });

    describe("sub", () => {
        it("subtracts given value", () => {
            const m = new Matrix2(1, 2, 3, 4);
            const r = m.sub(2);
            expect(r).toBe(m);
            expect(r.toJSON()).toEqualCloseTo([ -1, 0, 1, 2 ]);
        });
        it("subtracts given matrix", () => {
            const a = new Matrix2(20, 3, 40, 5);
            const b = new Matrix2(3, 40, 5, 60);
            const r = a.sub(b);
            expect(r).toBe(a);
            expect(r.toJSON()).toEqualCloseTo([ 17, -37, 35, -55 ]);
        });
    });

    describe("mul", () => {
        it("multiplies matrix with another matrix", () => {
            const a = new Matrix2(20, 3, 40, 5);
            const b = new Matrix2(3, 40, 5, 60);
            const r = a.mul(b);
            expect(r).toBe(a);
            expect(r.toJSON()).toEqualCloseTo([ 1660, 209, 2500, 315 ]);
        });
    });

    describe("compMul", () => {
        it("multiplies matrix with a factor", () => {
            const m = new Matrix2(1, -2, 3, -4);
            const r = m.compMul(-2);
            expect(r).toBe(m);
            expect(r.toJSON()).toEqualCloseTo([ -2, 4, -6, 8 ]);
        });
        it("multiplies matrix with another matrix", () => {
            const a = new Matrix2(20, 3, 40, 5);
            const b = new Matrix2(3, 40, 5, 60);
            const r = a.compMul(b);
            expect(r).toBe(a);
            expect(r.toJSON()).toEqualCloseTo([ 20 * 3, 3 * 40, 40 * 5, 5 * 60 ]);
        });
    });

    describe("div", () => {
        it("divides matrix by another matrix", () => {
            const a = new Matrix2(2, -4, 6, -8);
            const b = new Matrix2(-10, 11, -12, 13);
            const r = a.div(b);
            expect(r).toBe(a);
            expect(r.toJSON()).toEqualCloseTo([ -20, 18, -18, 16 ]);
        });
    });

    describe("compDiv", () => {
        it("divides matrix by scalar", () => {
            const m = new Matrix2(2, -4, 6, -8);
            const r = m.compDiv(2);
            expect(r).toBe(m);
            expect(r.toJSON()).toEqualCloseTo([ 1, -2, 3, -4 ]);
        });
        it("divides matrix by another matrix component-wise", () => {
            const a = new Matrix2(3 * 2, 4 * 3, 5 * 4, 6 * 5);
            const b = new Matrix2(2, 3, 4, 5);
            const r = a.compDiv(b);
            expect(r).toBe(a);
            expect(r.toJSON()).toEqualCloseTo([ 3, 4, 5, 6 ]);
        });
    });
});
