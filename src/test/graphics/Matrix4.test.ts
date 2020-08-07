/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { AffineTransform } from "../../main/graphics/AffineTransform";
import { Matrix2 } from "../../main/graphics/Matrix2";
import { Matrix2x3 } from "../../main/graphics/Matrix2x3";
import { Matrix3 } from "../../main/graphics/Matrix3";
import { Matrix3x2 } from "../../main/graphics/Matrix3x2";
import { Matrix4 } from "../../main/graphics/Matrix4";
import { Vector3 } from "../../main/graphics/Vector3";
import { Vector4 } from "../../main/graphics/Vector4";
import { isBrowser } from "../../main/util/runtime";

describe("Matrix4", () => {
    describe("constructor", () => {
        it("initializes identity matrix if no arguments are given", () => {
            const m = new Matrix4();
            expect(m.toJSON()).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        });
        it("initializes matrix with given elements", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            expect(m.toJSON()).toEqual([
                 1,  2,  3,  4,
                 5,  6,  7,  8,
                 9, 10, 11, 12,
                13, 14, 15, 16
            ]);
        });
        it("initializes matrix from a buffer without offset", () => {
            const array = new Float32Array(16);
            const m = new Matrix4(array.buffer);
            m.setComponents(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            expect(Array.from(array)).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]);
        });
        it("initializes matrix from a buffer with offset", () => {
            const array = new Float32Array(18);
            const vector = new Matrix4(array.buffer, 4);
            vector.setComponents(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 0 ]);
        });
    });

    describe("fromColumns", () => {
        it("initializes matrix from four column vectors", () => {
            const m = Matrix4.fromColumns(
                new Vector4(1, 2, 3, 4),
                new Vector4(5, 6, 7, 8),
                new Vector4(9, 10, 11, 12),
                new Vector4(13, 14, 15, 16)
            );
            expect(m.toJSON()).toEqual([
                 1,  2,  3,  4,
                 5,  6,  7,  8,
                 9, 10, 11, 12,
                13, 14, 15, 16
            ]);
        });
    });

    describe("fromRows", () => {
        it("initializes matrix from four row vectors", () => {
            const m = Matrix4.fromRows(
                new Vector4(1, 5, 9, 13),
                new Vector4(2, 6, 10, 14),
                new Vector4(3, 7, 11, 15),
                new Vector4(4, 8, 12, 16)
            );
            expect(m.toJSON()).toEqual([
                 1,  2,  3,  4,
                 5,  6,  7,  8,
                 9, 10, 11, 12,
                13, 14, 15, 16
            ]);
        });
    });

    describe("fromMatrix", () => {
        it("initializes matrix from other 2x2 matrix", () => {
            const a = new Matrix2(3, 4, 5, 6);
            const b = Matrix4.fromMatrix(a);
            a.setComponents(2, 3, 4, 5);
            expect(b.toJSON()).toEqual([
                3, 4, 0, 0,
                5, 6, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
             ]);
        });
        it("initializes matrix from other affine transform", () => {
            const a = new AffineTransform(3, 4, 5, 6, 7, 8);
            const b = Matrix4.fromMatrix(a);
            a.setComponents(2, 3, 4, 5, 6, 7);
            expect(b.toJSON()).toEqual([
                3, 4, 0, 0,
                5, 6, 0, 0,
                7, 8, 1, 0,
                0, 0, 0, 1
             ]);
        });
        it("initializes matrix from other 2x3 matrix", () => {
            const a = new Matrix2x3(3, 4, 5, 6, 7, 8);
            const b = Matrix4.fromMatrix(a);
            a.setComponents(2, 3, 4, 5, 6, 7);
            expect(b.toJSON()).toEqual([
                3, 4, 5, 0,
                6, 7, 8, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
             ]);
        });
        it("initializes matrix from other 3x2 matrix", () => {
            const a = new Matrix3x2(3, 4, 5, 6, 7, 8);
            const b = Matrix4.fromMatrix(a);
            a.setComponents(2, 3, 4, 5, 6, 7);
            expect(b.toJSON()).toEqual([
                3, 4, 0, 0,
                5, 6, 0, 0,
                7, 8, 1, 0,
                0, 0, 0, 1
             ]);
        });
        it("initializes matrix from other 3x3 matrix", () => {
            const a = new Matrix3(3, 4, 5, 6, 7, 8, 9, 10, 11);
            const b = Matrix4.fromMatrix(a);
            a.setComponents(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(b.toJSON()).toEqual([
                3,  4,  5, 0,
                6,  7,  8, 0,
                9, 10, 11, 0,
                0,  0,  0, 1
             ]);
        });
        it("initializes matrix from other 3x3 matrix", () => {
            const a = new Matrix4(3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18);
            const b = Matrix4.fromMatrix(a);
            a.setComponents(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            expect(b.toJSON()).toEqual([
                 3,  4,  5,  6,
                 7,  8,  9, 10,
                11, 12, 13, 14,
                15, 16, 17, 18
             ]);
        });
    });

    describe("m* getters", () => {
        it("reads the matrix components", () => {
            const m = new Matrix4(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            expect(m.m11).toBe(2);
            expect(m.m12).toBe(3);
            expect(m.m13).toBe(4);
            expect(m.m14).toBe(5);
            expect(m.m21).toBe(6);
            expect(m.m22).toBe(7);
            expect(m.m23).toBe(8);
            expect(m.m24).toBe(9);
            expect(m.m31).toBe(10);
            expect(m.m32).toBe(11);
            expect(m.m33).toBe(12);
            expect(m.m34).toBe(13);
            expect(m.m41).toBe(14);
            expect(m.m42).toBe(15);
            expect(m.m43).toBe(16);
            expect(m.m44).toBe(17);
        });
    });

    describe("m* setters", () => {
        it("sets the matrix components", () => {
            const m = new Matrix4();
            m.m11 = 2;
            m.m12 = 4;
            m.m13 = 6;
            m.m14 = 8;
            m.m21 = 10;
            m.m22 = 12;
            m.m23 = 14;
            m.m24 = 16;
            m.m31 = 18;
            m.m32 = 20;
            m.m33 = 22;
            m.m34 = 24;
            m.m41 = 26;
            m.m42 = 28;
            m.m43 = 30;
            m.m44 = 32;
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32 ]);
        });
    });

    describe("setComponents", () => {
        it("sets the matrix components", () => {
            const m = new Matrix4();
            m.setComponents(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32 ]);
        });
    });

    describe("setColumns", () => {
        it("sets the matrix components from four vectors", () => {
            const m = new Matrix4();
            m.setColumns(
                new Vector4(2, 4, 6, 8),
                new Vector4(10, 12, 14, 16),
                new Vector4(18, 20, 22, 24),
                new Vector4(26, 28, 30, 32)
            );
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32 ]);
        });
    });

    describe("setMatrix", () => {
        it("sets the matrix components from an affine transformation", () => {
            const m = new Matrix4();
            m.setMatrix(new AffineTransform(2, 4, 6, 8, 10, 12));
            expect(m.toJSON()).toEqual([
                 2,  4, 0, 0,
                 6,  8, 0, 0,
                10, 12, 1, 0,
                 0,  0, 0, 1
            ]);
        });
        it("sets the matrix components from an 2x3 matrix", () => {
            const m = new Matrix4();
            m.setMatrix(new Matrix2x3(2, 4, 6, 8, 10, 12));
            expect(m.toJSON()).toEqual([
                 2,  4,  6, 0,
                 8, 10, 12, 0,
                 0,  0,  1, 0,
                 0,  0,  0, 1
            ]);
        });
        it("sets the matrix components from an 3x2 matrix", () => {
            const m = new Matrix4();
            m.setMatrix(new Matrix3x2(2, 4, 6, 8, 10, 12));
            expect(m.toJSON()).toEqual([
                 2,  4, 0, 0,
                 6,  8, 0, 0,
                10, 12, 1, 0,
                 0,  0, 0, 1
            ]);
        });
        it("sets the matrix components from other 2x2 matrix", () => {
            const m = new Matrix4();
            m.setMatrix(new Matrix2(2, 4, 6, 8));
            expect(m.toJSON()).toEqual([
                2, 4, 0, 0,
                6, 8, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        });
        it("sets the matrix components from other 3x3 matrix", () => {
            const m = new Matrix4();
            m.setMatrix(new Matrix3(2, 3, 4, 5, 6, 7, 8, 9, 10));
            expect(m.toJSON()).toEqual([
                2, 3,  4, 0,
                5, 6,  7, 0,
                8, 9, 10, 0,
                0, 0,  0, 1
            ]);
        });
        it("sets the matrix components from other 4x4 matrix", () => {
            const m = new Matrix4();
            m.setMatrix(new Matrix4(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17));
            expect(m.toJSON()).toEqual([
                 2,  3,  4,  5,
                 6,  7,  8,  9,
                10, 11, 12, 13,
                14, 15, 16, 17
            ]);
        });
    });

    describe("clone", () => {
        it("returns new matrix", () => {
            const matrix = new Matrix4(6, 7, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const clone = matrix.clone();
            expect(clone).toBeInstanceOf(Matrix4);
            expect(clone.toJSON()).toEqual([ 6, 7, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]);
            expect(clone).not.toBe(matrix);
        });
    });

    describe("toJSON()", () => {
        it("returns array with the matrix components", () => {
            expect(new Matrix4(
                1, 2.123456789, 3, -1,
                4, 5, 6, -2,
                7, 8, 9, -3,
                -4, -5, -6, -7
            ).toJSON()).toEqual([
                1, 2.1234567165374756, 3, -1,
                4, 5, 6, -2,
                7, 8, 9, -3,
                -4, -5, -6, -7
            ]);
        });
    });

    describe("fromJSON", () => {
        it("constructs matrix from component array", () => {
            const m = Matrix4.fromJSON([ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ]);
            expect(m).toBeInstanceOf(Matrix4);
            expect(m.toJSON()).toEqual([ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ]);
        });
    });

    describe("toString", () => {
        it("returns string representation of matrix", () => {
            const m = new Matrix4(
                1.234567890, -2.345678901, 3.456789012, 1,
                4.567890123, -5.678901234, 6.789012345, 2,
                7.890123456, -8.901234567, 9.012345678, 3,
                4, 5, 6, 7
            );
            expect(m.toString()).toBe("[ 1.23457, -2.34568, 3.45679, 1, "
                + "4.56789, -5.6789, 6.78901, 2, "
                + "7.89012, -8.90123, 9.01235, 3, "
                + "4, 5, 6, 7 ]");
        });
        it("allows custom number of maximum fraction digits", () => {
            const m = new Matrix4(
                1.234567890, -2.345678901, 3.456789012, 1,
                4.567890123, -5.678901234, 6.789012345, 2,
                7.890123456, -8.901234567, 9.012345678, 3,
                4, 5, 6, 7
            );
            expect(m.toString(2)).toBe("[ 1.23, -2.35, 3.46, 1, 4.57, -5.68, 6.79, 2, 7.89, -8.9, 9.01, "
                + "3, 4, 5, 6, 7 ]");
        });
    });

    if (isBrowser()) {
        describe("fromDOMMatrix", () => {
            it("creates matrix from a DOMMatrix", () => {
                const domMatrix = new DOMMatrix([ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ]);
                const matrix = Matrix4.fromDOMMatrix(domMatrix);
                expect(matrix.toJSON()).toEqual([ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ]);
            });
        });
        describe("toDOMMatrix", () => {
            it("creates DOMMatrix from matrix", () => {
                const matrix = new Matrix4(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
                const domMatrix = matrix.toDOMMatrix();
                expect(domMatrix.toFloat32Array()).toEqual(
                    new Float32Array([ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ]));
            });
        });
    }

    describe("equals", () => {
        it("correctly implements the equality contract", () => {
            expect(new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)).toBeEquatable([
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
            ], [
                new Matrix4(0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 0, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 0, 8, 9, 10, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 0, 9, 10, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 0, 10, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 12, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 14, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 15, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 16),
                new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0)
            ]);
        });
    });

    describe("isIdentity", () => {
        it("returns true if matrix is an identity matrix", () => {
            expect(new Matrix4(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ).isIdentity()).toBe(true);
        });
        it("returns false if matrix is not an identity matrix", () => {
            expect(new Matrix4(2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 2, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 2, 0, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 0, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 2, 0, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1).isIdentity()).toBe(false);
            expect(new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2).isIdentity()).toBe(false);
        });
    });

    describe("getDeterminant", () => {
        it("returns the matrix determinant", () => {
            expect(new Matrix4(6, 3, 1, 7, 20, -3, 5, 8, 30, 12, -10, 4, 9, -5, -9, 2).getDeterminant()).toBe(28346);
        });
    });

    describe("invert", () => {
        it("inverts the matrix", () => {
            const m = new Matrix4(6, 3, 1, 7, 20, -3, 5, 8, 30, 12, -10, 4, 9, -5, -9, 2);
            const result = m.invert();
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                -0.0540464,  0.0388767,  0.02032030, -0.00698511,
                 0.0437451, -0.0419107,  0.03707750, -0.05962040,
                -0.0392295,  0.0569393, -0.00744373, -0.07556620,
                 0.1760390, -0.0234954, -0.03224440,  0.04233400
            ], 6);
        });
    });

    describe("transpose", () => {
        it("transposes the matrix", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.transpose();
            expect(result).toBe(m);
            expect(result.toJSON()).toEqual([
                1, 5, 9, 13,
                2, 6, 10, 14,
                3, 7, 11, 15,
                4, 8, 12, 16
            ]);
        });
    });

    describe("adjugate", () => {
        it("adjugates the matrix", () => {
            const m = new Matrix4(6, 3, 1, 7, 20, -3, 5, 8, 30, 12, -10, 4, 9, -5, -9, 2);
            const result = m.adjugate();
            expect(result).toBe(m);
            expect(result.toJSON()).toEqual([
                -1532,  1240, -1112, 4990,
                 1102, -1188,  1614, -666,
                  576,  1051,  -211, -914,
                 -198, -1690, -2142, 1200
            ]);
        });
    });

    describe("add", () => {
        it("adds given value", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.add(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ]);
        });
        it("adds given matrix", () => {
            const a = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = new Matrix4(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            const result = a.add(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33 ]);
        });
    });

    describe("sub", () => {
        it("subtracts given value", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.sub(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]);
        });
        it("subtracts given matrix", () => {
            const a = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = new Matrix4(17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2);
            const result = a.sub(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14 ]);
        });
    });

    describe("mul", () => {
        it("multiplies matrix with another matrix", () => {
            const a = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = new Matrix4(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            const result = a.mul(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([
                118, 132, 146, 160,
                230, 260, 290, 320,
                342, 388, 434, 480,
                454, 516, 578, 640
            ]);
        });
    });

    describe("compMul", () => {
        it("multiplies matrix with a factor", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.compMul(-2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 -2,  -4,  -6,  -8,
                -10, -12, -14, -16,
                -18, -20, -22, -24,
                -26, -28, -30, -32
            ]);
        });
        it("multiplies matrix with another matrix", () => {
            const a = new Matrix4(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            const b = new Matrix4(3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18);
            const result = a.compMul(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([
                   6,  12,  20,  30,
                  42,  56,  72,  90,
                 110, 132, 156, 182,
                 210, 240, 272, 306
            ]);
        });
    });

    describe("div", () => {
        it("divides matrix by another matrix", () => {
            const a = new Matrix4(
                 510,  4880,  474,  7440,
                -548, -8120, -924, -5600,
                1116,  9240, 1808, 18000,
                1926, 16880, 1890, 29520
            );
            const b = new Matrix4(25, 3, 45, 5, 65, 7, -85, 9, 105, 11, 125, -13, 145, 15, 165, 17);
            const result = a.div(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([
                 1, -20,   3,  40,
                 5,  60,  -7,  80,
                 9, 100,  11, 120,
                13, 140, -15, 160
            ]);
        });
    });

    describe("compDiv", () => {
        it("divides matrix by scalar", () => {
            const m = new Matrix4(25, 3, 45, 5, 65, 7, -85, 9, 105, 11, 125, -13, 145, 15, 165, 17);
            const result = m.compDiv(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                12.5, 1.5,  22.5,  2.5,
                32.5, 3.5, -42.5,  4.5,
                52.5, 5.5,  62.5, -6.5,
                72.5, 7.5,  82.5,  8.5
            ]);
        });
        it("divides matrix by another matrix component-wise", () => {
            const a = new Matrix4(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            const b = new Matrix4(3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18);
            const result = a.compDiv(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([
                0.666667, 0.750000, 0.800000, 0.833333,
                0.857143, 0.875000, 0.888889, 0.900000,
                0.909091, 0.916667, 0.923077, 0.928571,
                0.933333, 0.937500, 0.941176, 0.944444
            ]);
        });
    });

    describe("translate", () => {
        it("translates the matrix", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.translate(10, 20, 30);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                  1,   2,   3,   4,
                  5,   6,   7,   8,
                  9,  10,  11,  12,
                393, 454, 515, 576
            ]);
        });
    });

    describe("translateX", () => {
        it("translates the matrix along the X axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.translateX(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,  2,  3,  4,
                 5,  6,  7,  8,
                 9, 10, 11, 12,
                23, 34, 45, 56
            ]);
        });
    });

    describe("translateY", () => {
        it("translates the matrix along the Y axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.translateY(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,  2,  3,  4,
                 5,  6,  7,  8,
                 9, 10, 11, 12,
                63, 74, 85, 96
            ]);
        });
    });

    describe("translateZ", () => {
        it("translates the matrix along the Z axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.translateZ(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                  1,   2,   3,   4,
                  5,   6,   7,   8,
                  9,  10,  11,  12,
                103, 114, 125, 136
            ]);
        });
    });

    describe("scale", () => {
        it("scales the matrix by individual scale factors", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.scale(10, 20, 30);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 10,  20,  30,  40,
                100, 120, 140, 160,
                270, 300, 330, 360,
                 13,  14,  15,  16
            ]);
        });
        it("scales the matrix by given scale factor", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.scale(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                10,  20,  30,  40,
                50,  60,  70,  80,
                90, 100, 110, 120,
                13,  14,  15,  16
            ]);
        });
    });

    describe("scaleX", () => {
        it("scales the matrix along the X axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.scaleX(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 10, 20, 30, 40,
                  5,  6,  7,  8,
                  9, 10, 11, 12,
                 13, 14, 15, 16
            ]);
        });
    });

    describe("scaleX", () => {
        it("scales the matrix along the Y axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.scaleY(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                  1,  2,  3,  4,
                 50, 60, 70, 80,
                  9, 10, 11, 12,
                 13, 14, 15, 16
            ]);
        });
    });

    describe("scaleZ", () => {
        it("scales the matrix along the Z axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.scaleZ(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                  1,   2,   3,   4,
                  5,   6,   7,   8,
                 90, 100, 110, 120,
                 13,  14,  15,  16
            ]);
        });
    });

    describe("rotate", () => {
        it("rotates the matrix around the given axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.rotate(0.5, new Vector3(10, 15, -30));
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                -3.21119, -2.955, -2.69882, -2.44264,
                5.75434, 7.17235, 8.59035, 10.0084,
                7.97344, 8.9345, 9.89557, 10.8566,
                13, 14, 15, 16
            ]);
        });
    });

    describe("rotateX", () => {
        it("rotates the matrix around the X axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.rotateX(0.5);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                1, 2, 3, 4,
                8.702742576599121, 10.0597505569458, 11.41675853729248, 12.77376651763916,
                5.501115322113037, 5.899272441864014, 6.29742956161499, 6.695586204528809,
                13, 14, 15, 16
            ]);
        });
    });

    describe("rotateY", () => {
        it("rotates the matrix around the Y axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.rotateY(0.5);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                -3.4372472763061523, -3.039090156555176, -2.6409332752227783, -2.2427761554718018,
                5, 6, 7, 8,
                8.377668380737305, 9.734676361083984, 11.091684341430664, 12.44869327545166,
                13, 14, 15, 16
            ]);
        });
    });

    describe("rotateZ", () => {
        it("rotates the matrix around the Z axis", () => {
            const m = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const result = m.rotateZ(0.5);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                3.274710178375244, 4.631718158721924, 5.988726615905762,  7.345734596252441,
                3.908487319946289, 4.306644439697266, 4.704801082611084, 5.1029582023620605,
                9, 10, 11, 12,
                13, 14, 15, 16
            ]);
        });
    });
});
