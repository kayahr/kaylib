/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { Matrix2 } from "../../main/graphics/Matrix2";
import { Matrix2x3 } from "../../main/graphics/Matrix2x3";
import { Matrix3 } from "../../main/graphics/Matrix3";
import { Matrix4 } from "../../main/graphics/Matrix4";
import { Vector3 } from "../../main/graphics/Vector3";

describe("Matrix2x3", () => {
    describe("constructor", () => {
        it("initializes identity matrix if no arguments are given", () => {
            const m = new Matrix2x3();
            expect(m.toJSON()).toEqual([
                1, 0, 0,
                0, 1, 0
            ]);
        });
        it("initializes matrix with given elements", () => {
            const m = new Matrix2x3(1, 2, 3, 4, 5, 6);
            expect(m.toJSON()).toEqual([
                 1, 2, 3,
                 4, 5, 6
            ]);
        });
        it("initializes matrix from a buffer without offset", () => {
            const array = new Float32Array(6);
            const m = new Matrix2x3(array.buffer);
            m.setComponents(1, 2, 3, 4, 5, 6);
            expect(Array.from(array)).toEqual([ 1, 2, 3, 4, 5, 6 ]);
        });
        it("initializes matrix from a buffer with offset", () => {
            const array = new Float32Array(8);
            const m = new Matrix2x3(array.buffer, 4);
            m.setComponents(1, 2, 3, 4, 5, 6);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 0 ]);
        });
    });

    describe("fromMatrix", () => {
        it("initializes matrix from other 2x2 matrix", () => {
            const a = new Matrix2(1, 2, 3, 4);
            const b = Matrix2x3.fromMatrix(a);
            a.setComponents(2, 3, 4, 5);
            expect(b.toJSON()).toEqual([ 1, 2, 0, 3, 4, 0 ]);
        });
        it("initializes matrix from other 3x3 matrix", () => {
            const a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const b = Matrix2x3.fromMatrix(a);
            a.setComponents(2, 3, 4, 5, 6, 7, 8, 9, 10);
            expect(b.toJSON()).toEqual([ 1, 2, 3, 4, 5, 6 ]);
        });
        it("initializes matrix from other 4x4 matrix", () => {
            const a = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = Matrix2x3.fromMatrix(a);
            a.setComponents(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            expect(b.toJSON()).toEqual([ 1, 2, 3, 5, 6, 7 ]);
        });
    });

    describe("fromColumns", () => {
        it("initializes matrix from three vectors", () => {
            const m = Matrix2x3.fromColumns(
                new Vector3(1, 2, 3),
                new Vector3(4, 5, 6),
            );
            expect(m.toJSON()).toEqual([
                 1, 2, 3,
                 4, 5, 6
            ]);
        });
    });

    describe("m* getters", () => {
        it("reads the matrix components", () => {
            const m = new Matrix2x3(2, 3, 4, 5, 6, 7);
            expect(m.m11).toBe(2);
            expect(m.m12).toBe(3);
            expect(m.m13).toBe(4);
            expect(m.m21).toBe(5);
            expect(m.m22).toBe(6);
            expect(m.m23).toBe(7);
        });
    });

    describe("m* setters", () => {
        it("sets the matrix components", () => {
            const m = new Matrix2x3();
            m.m11 = 2;
            m.m12 = 4;
            m.m13 = 8;
            m.m21 = 10;
            m.m22 = 14;
            m.m23 = 16;
            expect(m.toJSON()).toEqual([ 2, 4, 8, 10, 14, 16 ]);
        });
    });

    describe("setComponents", () => {
        it("sets the matrix components", () => {
            const m = new Matrix2x3();
            m.setComponents(2, 4, 6, 8, 10, 12);
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12 ]);
        });
    });

    describe("setColumns", () => {
        it("sets the matrix components from three vectors", () => {
            const m = new Matrix2x3();
            m.setColumns(new Vector3(2, 4, 8), new Vector3(10, 14, 16));
            expect(m.toJSON()).toEqual([ 2, 4, 8, 10, 14, 16 ]);
        });
    });

    describe("setMatrix", () => {
        it("sets the matrix components from other 2x2 matrix", () => {
            const m = new Matrix2x3();
            m.setMatrix(new Matrix2(2, 4, 6, 8));
            expect(m.toJSON()).toEqual([ 2, 4, 0, 6, 8, 0 ]);
        });
        it("sets the matrix components from other 3x3 matrix", () => {
            const m = new Matrix2x3();
            m.setMatrix(new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9));
            expect(m.toJSON()).toEqual([ 1, 2, 3, 4, 5, 6 ]);
        });
        it("sets the matrix components from other 4x4 matrix", () => {
            const m = new Matrix2x3();
            m.setMatrix(new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16));
            expect(m.toJSON()).toEqual([ 1, 2, 3, 5, 6, 7 ]);
        });
    });

    describe("clone", () => {
        it("returns new matrix", () => {
            const matrix = new Matrix2x3(6, 7, 1, 2, 3, 4);
            const clone = matrix.clone();
            expect(clone).toBeInstanceOf(Matrix2x3);
            expect(clone.toJSON()).toEqual([ 6, 7, 1, 2, 3, 4 ]);
            expect(clone).not.toBe(matrix);
        });
    });

    describe("toJSON()", () => {
        it("returns array with the matrix components", () => {
            expect(new Matrix2x3(
                1, 2.123456789, 4,
                5, 7, 8,
            ).toJSON()).toEqual([
                1, 2.1234567165374756, 4,
                5, 7, 8
            ]);
        });
    });

    describe("fromJSON", () => {
        it("constructs matrix from component array", () => {
            const m = Matrix2x3.fromJSON([ 2, 3, 4, 5, 6, 7 ]);
            expect(m).toBeInstanceOf(Matrix2x3);
            expect(m.toJSON()).toEqual([ 2, 3, 4, 5, 6, 7 ]);
        });
    });

    describe("toString", () => {
        it("returns string representation of matrix", () => {
            const m = new Matrix2x3(
                1.234567890, -2.345678901, 3.456789012,
                4.567890123, -5.678901234, 6.789012345
            );
            expect(m.toString()).toBe("[ 1.23457, -2.34568, 3.45679, 4.56789, -5.6789, 6.78901 ]");
        });
        it("allows custom number of maximum fraction digits", () => {
            const m = new Matrix2x3(
                1.234567890, -2.345678901, 3.456789012,
                4.567890123, -5.678901234, 6.789012345
            );
            expect(m.toString(2)).toBe("[ 1.23, -2.35, 3.46, 4.57, -5.68, 6.79 ]");
        });
    });

    describe("equals", () => {
        it("correctly implements the equality contract", () => {
            expect(new Matrix2x3(1, 2, 3, 4, 5, 6,)).toBeEquatable([
                new Matrix2x3(1, 2, 3, 4, 5, 6)
            ], [
                new Matrix2x3(0, 2, 3, 4, 5, 6),
                new Matrix2x3(1, 0, 3, 4, 5, 6),
                new Matrix2x3(1, 2, 0, 4, 5, 6),
                new Matrix2x3(1, 2, 3, 0, 5, 6),
                new Matrix2x3(1, 2, 3, 4, 0, 6),
                new Matrix2x3(1, 2, 3, 4, 5, 0)
            ]);
        });
    });

    describe("isIdentity", () => {
        it("returns true if matrix is an identity matrix", () => {
            expect(new Matrix2x3(
                1, 0, 0,
                0, 1, 0
            ).isIdentity()).toBe(true);
        });
        it("returns false if matrix is not an identity matrix", () => {
            expect(new Matrix2x3(2, 0, 0, 0, 1, 0).isIdentity()).toBe(false);
            expect(new Matrix2x3(1, 2, 0, 0, 1, 0).isIdentity()).toBe(false);
            expect(new Matrix2x3(1, 0, 2, 0, 1, 0).isIdentity()).toBe(false);
            expect(new Matrix2x3(1, 0, 0, 2, 1, 0).isIdentity()).toBe(false);
            expect(new Matrix2x3(1, 0, 0, 0, 2, 0).isIdentity()).toBe(false);
            expect(new Matrix2x3(1, 0, 0, 0, 1, 2).isIdentity()).toBe(false);
        });
    });

    describe("add", () => {
        it("adds given value", () => {
            const m = new Matrix2x3(1, 2, 3, 4, 5, 6);
            const result = m.add(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ 3, 4, 5, 6, 7, 8 ]);
        });
        it("adds given matrix", () => {
            const a = new Matrix2x3(20, 3, 40, 5, 60, 7);
            const b = new Matrix2x3(3, 40, 5, 60, 7, 80);
            const result = a.add(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 23, 43, 45, 65, 67, 87 ]);
        });
    });

    describe("sub", () => {
        it("subtracts given value", () => {
            const m = new Matrix2x3(1, 2, 3, 4, 5, 6);
            const result = m.sub(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ -1, 0, 1, 2, 3, 4 ]);
        });
        it("subtracts given matrix", () => {
            const a = new Matrix2x3(20, 3, 40, 5, 60, 7);
            const b = new Matrix2x3(3, 40, 5, 60, 7, 80);
            const result = a.sub(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 17, -37, 35, -55, 53, -73 ]);
        });
    });

     describe("compMul", () => {
        it("multiplies matrix with a factor", () => {
            const m = new Matrix2x3(20, -3, 40, -5, 60, -7);
            const result = m.compMul(-2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ -40, 6, -80, 10, -120, 14 ]);
        });
        it("multiplies matrix with another matrix", () => {
            const a = new Matrix2x3(20, -3, 40, -5, 60, -7);
            const b = new Matrix2x3(3, 40, 5, 60, 7, 80);
            const result = a.compMul(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 60, -120, 200, -300, 420, -560 ]);
        });
    });

    describe("compDiv", () => {
        it("divides matrix by scalar", () => {
            const m = new Matrix2x3(20, -3, 40, -5, 60, -7);
            const result = m.compDiv(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ 10, -1.5, 20, -2.5, 30, -3.5 ]);
        });
        it("divides matrix by another matrix component-wise", () => {
            const a = new Matrix2x3(20, -3, 40, -5, 60, -7);
            const b = new Matrix2x3(3, 40, 5, 60, 7, 80);
            const result = a.compDiv(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([
                 6.66667, -0.07500,  8.00000,
                -0.08333,  8.57143, -0.08750
            ]);
        });
    });
});
