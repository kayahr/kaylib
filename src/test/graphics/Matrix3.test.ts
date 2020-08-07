/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";
import "jest-extended";

import { Matrix2 } from "../../main/graphics/Matrix2";
import { Matrix3 } from "../../main/graphics/Matrix3";
import { Matrix4 } from "../../main/graphics/Matrix4";
import { Vector3 } from "../../main/graphics/Vector3";
import { IllegalArgumentException, IllegalStateException } from "../../main/util/exception";
import { isBrowser } from "../../main/util/runtime";

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
        it("initializes matrix from a buffer without offset", () => {
            const array = new Float32Array(9);
            const m = new Matrix3(array.buffer);
            m.setComponents(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(Array.from(array)).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
        });
        it("initializes matrix from a buffer with offset", () => {
            const array = new Float32Array(11);
            const m = new Matrix3(array.buffer, 4);
            m.setComponents(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]);
        });
    });

    describe("fromMatrix", () => {
        it("initializes matrix from other 2x2 matrix", () => {
            const a = new Matrix2(1, 2, 3, 4);
            const b = Matrix3.fromMatrix(a);
            a.setComponents(2, 3, 4, 5);
            expect(b.toJSON()).toEqual([ 1, 2, 0, 3, 4, 0, 0, 0, 1 ]);
        });
        it("initializes matrix from other 3x3 matrix", () => {
            const a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const b = Matrix3.fromMatrix(a);
            a.setComponents(2, 3, 4, 5, 6, 7, 8, 9, 10);
            expect(b.toJSON()).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
        });
        it("initializes matrix from other 4x4 matrix", () => {
            const a = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = Matrix3.fromMatrix(a);
            a.setComponents(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            expect(b.toJSON()).toEqual([ 1, 2, 3, 5, 6, 7, 9, 10, 11 ]);
        });
    });

    describe("fromColumns", () => {
        it("initializes matrix from three column vectors", () => {
            const m = Matrix3.fromColumns(
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
    });

    describe("fromRows", () => {
        it("initializes matrix from three row vectors", () => {
            const m = Matrix3.fromRows(
                new Vector3(1, 4, 7),
                new Vector3(2, 5, 8),
                new Vector3(3, 6, 9)
            );
            expect(m.toJSON()).toEqual([
                 1, 2, 3,
                 4, 5, 6,
                 7, 8, 9
            ]);
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

    describe("setComponents", () => {
        it("sets the matrix components", () => {
            const m = new Matrix3();
            m.setComponents(2, 4, 6, 8, 10, 12, 14, 16, 18);
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12, 14, 16, 18 ]);
        });
    });

    describe("setColumns", () => {
        it("sets the matrix components from three vectors", () => {
            const m = new Matrix3();
            m.setColumns(new Vector3(2, 4, 6), new Vector3(8, 10, 12), new Vector3(14, 16, 18));
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12, 14, 16, 18 ]);
        });
    });
    describe("setMatrix", () => {
        it("sets the matrix components from other 2x2 matrix", () => {
            const m = new Matrix3();
            m.setMatrix(new Matrix2(2, 4, 6, 8));
            expect(m.toJSON()).toEqual([ 2, 4, 0, 6, 8, 0, 0, 0, 1 ]);
        });
        it("sets the matrix components from other 3x3 matrix", () => {
            const m = new Matrix3();
            m.setMatrix(new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9));
            expect(m.toJSON()).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
        });
        it("sets the matrix components from other 4x4 matrix", () => {
            const m = new Matrix3();
            m.setMatrix(new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16));
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
    });

    describe("fromJSON", () => {
        it("constructs matrix from component array", () => {
            const m = Matrix3.fromJSON([ 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
            expect(m).toBeInstanceOf(Matrix3);
            expect(m.toJSON()).toEqual([ 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
        });
    });

    describe("toString", () => {
        it("returns string representation of matrix", () => {
            const m = new Matrix3(
                1.234567890, -2.345678901, 3.456789012,
                4.567890123, -5.678901234, 6.789012345,
                7.890123456, -8.901234567, 9.012345678
            );
            expect(m.toString()).toBe("[ 1.23457, -2.34568, 3.45679, "
                + "4.56789, -5.6789, 6.78901, "
                + "7.89012, -8.90123, 9.01235 ]");
        });
        it("allows custom number of maximum fraction digits", () => {
            const m = new Matrix3(
                1.234567890, -2.345678901, 3.456789012,
                4.567890123, -5.678901234, 6.789012345,
                7.890123456, -8.901234567, 9.012345678
            );
            expect(m.toString(2)).toBe("[ 1.23, -2.35, 3.46, 4.57, -5.68, 6.79, 7.89, -8.9, 9.01 ]");
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

    describe("translate", () => {
        it("translates the matrix", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.translate(10, 20);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,   2,   3,
                 4,   5,   6,
                97, 128, 159
            ]);
        });
    });

    describe("translateX", () => {
        it("translates the matrix by given X delta", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.translateX(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,  2,  3,
                 4,  5,  6,
                17, 28, 39
            ]);
        });
    });

    describe("translateY", () => {
        it("translates the matrix by given Y delta", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.translateY(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,  2,  3,
                 4,  5,  6,
                47, 58, 69
            ]);
        });
    });

    describe("scale", () => {
        it("scales the matrix by given scale factor", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.scale(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                10, 20, 30,
                40, 50, 60,
                 7,  8,  9
            ]);
        });
        it("scales the matrix by given individual scale factors", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.scale(10, 20);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                10,  20,  30,
                80, 100, 120,
                 7,   8,   9
            ]);
        });
    });

    describe("scaleX", () => {
        it("scales the matrix by given X scale factor", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.scaleX(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                10, 20, 30,
                 4,  5,  6,
                 7,  8,  9
            ]);
        });
    });

    describe("scaleY", () => {
        it("scales the matrix by given Y scale factor", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.scaleY(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,  2,  3,
                40, 50, 60,
                 7,  8,  9
            ]);
        });
    });

    describe("rotate", () => {
        it("rotates the matrix", () => {
            const m = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const result = m.rotate(0.5);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                2.7952847480773926, 4.152292728424072, 5.509300708770752,
                3.030904769897461, 3.4290616512298584, 3.827218770980835,
                7, 8, 9
            ]);
        });
    });

    if (isBrowser()) {
        describe("fromDOMMatrix", () => {
            it("creates matrix from a DOMMatrix", () => {
                const domMatrix = new DOMMatrix([ 2, 3, 4, 5, 6, 7 ]);
                const matrix = Matrix3.fromDOMMatrix(domMatrix);
                expect(matrix.toJSON()).toEqual([ 2, 3, 0, 4, 5, 0, 6, 7, 1 ]);
            });
            it("throws exception when DOMMatrix is not a 2D matrix", () => {
                const domMatrix = new DOMMatrix([ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ]);
                expect(() => Matrix3.fromDOMMatrix(domMatrix)).toThrowWithMessage(IllegalArgumentException,
                    "Can only create Matrix3 from 2D DOMMatrix");
            });
        });
        describe("toDOMMatrix", () => {
            it("creates DOMMatrix from matrix", () => {
                const matrix = new Matrix3(2, 3, 0, 4, 5, 0, 6, 7, 1);
                const domMatrix = matrix.toDOMMatrix();
                expect(domMatrix.toFloat32Array()).toEqual(
                    new Float32Array([ 2, 3, 0, 0, 4, 5, 0, 0, 0, 0, 1, 0, 6, 7, 0, 1 ]));
                expect(domMatrix.is2D).toBe(true);
            });
            it("throws exception when matrix is not a 2D affine transformation", () => {
                expect(() => new Matrix3(2, 3, 1, 5, 6, 0, 8, 9, 1).toDOMMatrix()).toThrowWithMessage(
                    IllegalStateException, "Can only create DOMMatrix from Matrix3 2D affine transformation");
                expect(() => new Matrix3(2, 3, 0, 5, 6, 1, 8, 9, 1).toDOMMatrix()).toThrowWithMessage(
                    IllegalStateException, "Can only create DOMMatrix from Matrix3 2D affine transformation");
                expect(() => new Matrix3(2, 3, 0, 5, 6, 0, 8, 9, 0).toDOMMatrix()).toThrowWithMessage(
                    IllegalStateException, "Can only create DOMMatrix from Matrix3 2D affine transformation");
            });
        });
    }
});
