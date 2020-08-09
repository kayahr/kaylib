/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "jest-extended";
import "@kayahr/jest-matchers";

import { AffineTransform } from "../../main/graphics/AffineTransform";
import { createCanvas, getRenderingContext, hasCanvasSupport } from "../../main/graphics/canvas";
import { Matrix2 } from "../../main/graphics/Matrix2";
import { Matrix3 } from "../../main/graphics/Matrix3";
import { Matrix4 } from "../../main/graphics/Matrix4";
import { Vector2 } from "../../main/graphics/Vector2";
import { Vector3 } from "../../main/graphics/Vector3";
import { IllegalArgumentException } from "../../main/util/exception";
import { degrees, normalizeDegrees, radians } from "../../main/util/math";
import { isBrowser } from "../../main/util/runtime";

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
        it("initializes matrix from a buffer without offset", () => {
            const array = new Float32Array(6);
            const m = new AffineTransform(array.buffer);
            m.setComponents(1, 2, 3, 4, 5, 6);
            expect(Array.from(array)).toEqual([ 1, 2, 3, 4, 5, 6 ]);
        });
        it("initializes matrix from a buffer with offset", () => {
            const array = new Float32Array(8);
            const m = new AffineTransform(array.buffer, 4);
            m.setComponents(1, 2, 3, 4, 5, 6);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 0 ]);
        });
    });

    describe("fromMatrix", () => {
        it("initializes matrix from other 2x2 matrix", () => {
            const a = new Matrix2(1, 2, 3, 4);
            const b = AffineTransform.fromMatrix(a);
            a.setComponents(2, 3, 4, 5);
            expect(b.toJSON()).toEqual([ 1, 2, 3, 4, 0, 0 ]);
        });
        it("initializes matrix from other 3x3 matrix", () => {
            const a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const b = AffineTransform.fromMatrix(a);
            a.setComponents(2, 3, 4, 5, 6, 7, 8, 9, 10);
            expect(b.toJSON()).toEqual([ 1, 2, 4, 5, 7, 8 ]);
        });
        it("initializes matrix from other 4x4 matrix", () => {
            const a = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = AffineTransform.fromMatrix(a);
            a.setComponents(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
            expect(b.toJSON()).toEqual([ 1, 2, 5, 6, 9, 10 ]);
        });
    });

    describe("fromColumns", () => {
        it("initializes matrix from three column vectors", () => {
            const m = AffineTransform.fromColumns(
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
    });

    describe("fromRows", () => {
        it("initializes matrix from two row vectors", () => {
            const m = AffineTransform.fromRows(
                new Vector3(1, 3, 5),
                new Vector3(2, 4, 6)
            );
            expect(m.toJSON()).toEqual([
                 1, 2,
                 3, 4,
                 5, 6
            ]);
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

    describe("setComponents", () => {
        it("sets the matrix components", () => {
            const m = new AffineTransform();
            m.setComponents(2, 4, 6, 8, 10, 12);
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 10, 12 ]);
        });
    });

    describe("setColumns", () => {
        it("sets the matrix components from three vectors", () => {
            const m = new AffineTransform();
            m.setColumns(new Vector2(2, 4), new Vector2(8, 10), new Vector2(14, 16));
            expect(m.toJSON()).toEqual([ 2, 4, 8, 10, 14, 16 ]);
        });
    });

    describe("setMatrix", () => {
        it("sets the matrix components from other 2x2 matrix", () => {
            const m = new AffineTransform();
            m.setMatrix(new Matrix2(2, 4, 6, 8));
            expect(m.toJSON()).toEqual([ 2, 4, 6, 8, 0, 0 ]);
        });
        it("sets the matrix components from other 3x3 matrix", () => {
            const m = new AffineTransform();
            m.setMatrix(new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9));
            expect(m.toJSON()).toEqual([ 1, 2, 4, 5, 7, 8 ]);
        });
        it("sets the matrix components from other 4x4 matrix", () => {
            const m = new AffineTransform();
            m.setMatrix(new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16));
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

    describe("add", () => {
        it("adds given value", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.add(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ 3, 4, 5, 6, 7, 8 ]);
        });
        it("adds given matrix", () => {
            const a = new AffineTransform(20, 3, 40, 5, 60, 7);
            const b = new AffineTransform(3, 40, 5, 60, 7, 80);
            const result = a.add(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 23, 43, 45, 65, 67, 87 ]);
        });
    });

    describe("sub", () => {
        it("subtracts given value", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.sub(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ -1, 0, 1, 2, 3, 4 ]);
        });
        it("subtracts given matrix", () => {
            const a = new AffineTransform(20, 3, 40, 5, 60, 7);
            const b = new AffineTransform(3, 40, 5, 60, 7, 80);
            const result = a.sub(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 17, -37, 35, -55, 53, -73 ]);
        });
    });

     describe("compMul", () => {
        it("multiplies matrix with a factor", () => {
            const m = new AffineTransform(20, -3, 40, -5, 60, -7);
            const result = m.compMul(-2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ -40, 6, -80, 10, -120, 14 ]);
        });
        it("multiplies matrix with another matrix", () => {
            const a = new AffineTransform(20, -3, 40, -5, 60, -7);
            const b = new AffineTransform(3, 40, 5, 60, 7, 80);
            const result = a.compMul(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 60, -120, 200, -300, 420, -560 ]);
        });
    });

    describe("compDiv", () => {
        it("divides matrix by scalar", () => {
            const m = new AffineTransform(20, -3, 40, -5, 60, -7);
            const result = m.compDiv(2);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([ 10, -1.5, 20, -2.5, 30, -3.5 ]);
        });
        it("divides matrix by another matrix component-wise", () => {
            const a = new AffineTransform(20, -3, 40, -5, 60, -7);
            const b = new AffineTransform(3, 40, 5, 60, 7, 80);
            const result = a.compDiv(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([
                 6.66667, -0.07500,  8.00000,
                -0.08333,  8.57143, -0.08750
            ]);
        });
    });

    describe("mul", () => {
        it("multiplies matrix with another matrix", () => {
            const a = new AffineTransform(20, 3, 40, 5, 60, 7);
            const b = new AffineTransform(3, 40, 5, 60, 7, 80);
            const result = a.mul(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([
                1660, 209,
                2500, 315,
                3400, 428
            ]);
        });
    });

    describe("div", () => {
        it("divides matrix by another matrix", () => {
            const a = new AffineTransform(1660, 209, 2500, 315, 3400, 428);
            const b = new AffineTransform(3, 40, 5, 60, 7, 80);
            const result = a.div(b);
            expect(result).toBe(a);
            expect(result.toJSON()).toEqualCloseTo([ 20, 3, 40, 5, 60, 7 ]);
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

    describe("translate", () => {
        it("translates the matrix", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.translate(10, 20);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,   2,
                 3,   4,
                75, 106
            ]);
        });
    });

    describe("translateX", () => {
        it("translates the matrix by given X delta", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.translateX(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,  2,
                 3,  4,
                15, 26
            ]);
        });
    });

    describe("getTranslationX", () => {
        it("returns the horizontal translation of the matrix", () => {
            expect(new AffineTransform(1, 0, 0, 1, -9.1, 3).getTranslationX()).toBeCloseTo(-9.1);
        });
    });

    describe("translateY", () => {
        it("translates the matrix by given Y delta", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.translateY(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,  2,
                 3,  4,
                35, 46
            ]);
        });
    });

    describe("getTranslationY", () => {
        it("returns the vertical translation of the matrix", () => {
            expect(new AffineTransform(1, 0, 0, 1, 41.3, 49.13).getTranslationY()).toBeCloseTo(49.13);
        });
    });

    describe("setTranslation", () => {
        it("sets translation matrix", () => {
            const m = new AffineTransform(7, 2, 3, 4, 5, 6);
            const result = m.setTranslation(2, 3);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                1, 0,
                0, 1,
                2, 3
            ]);
        });
    });

    describe("createTranslation", () => {
        it("creates translation matrix", () => {
            const m = AffineTransform.createTranslation(2, 3);
            expect(m.toJSON()).toEqualCloseTo([
                1, 0,
                0, 1,
                2, 3
            ]);
        });
    });

    describe("scale", () => {
        it("scales the matrix by given scale factor", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.scale(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                10, 20,
                30, 40,
                 5,  6
            ]);
        });
        it("scales the matrix by given individual scale factors", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.scale(10, 20);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                10, 20,
                60, 80,
                 5,  6
            ]);
        });
    });

    describe("scaleX", () => {
        it("scales the matrix by given X scale factor", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.scaleX(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                10, 20,
                 3,  4,
                 5,  6
            ]);
        });
    });

    describe("getScaleX", () => {
        it("returns the horizontal scaling factor of the matrix", () => {
            const matrix = new AffineTransform();
            matrix.translate(1, 2);
            matrix.scale(10, 1);
            expect(matrix.getScaleX()).toBeCloseTo(10);
            matrix.scale(0.5, 1);
            expect(matrix.getScaleX()).toBeCloseTo(5);
            matrix.rotate(radians(23.45));
            expect(matrix.getScaleX()).toBeCloseTo(5);
        });
        it("returns horizontal scaling for every rotation angle", () => {
            for (let i = -360; i <= 360; i++) {
                const matrix = AffineTransform.createScale(5, 10).rotate(radians(i));
                expect(matrix.getScaleX()).toBeCloseTo(5);
            }
        });
        it("returns correct X scale when Y scale is 0", () => {
            expect(AffineTransform.createScale(10, 0).rotate(1.3).getScaleX()).toBeCloseTo(10);
        });
        it("returns 0 for scale 0", () => {
            expect(AffineTransform.createScale(0).rotate(0.5).getScaleX()).toBe(0);
            expect(AffineTransform.createScale(0, 40).rotate(1.3).getScaleX()).toBe(0);
        });
    });

    describe("scaleY", () => {
        it("scales the matrix by given Y scale factor", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.scaleY(10);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                 1,  2,
                30, 40,
                 5,  6
            ]);
        });
    });

    describe("getScaleY", () => {
        it("returns the vertical scaling factor of the matrix", () => {
            const matrix = new AffineTransform();
            matrix.translate(10, 20);
            matrix.scale(1, 10);
            expect(matrix.getScaleY()).toBeCloseTo(10);
            matrix.scale(1, 0.5);
            expect(matrix.getScaleY()).toBeCloseTo(5);
            matrix.rotate(radians(78.93));
            expect(matrix.getScaleY()).toBeCloseTo(5);
        });
        it("returns vertical scaling for every rotation angle", () => {
            for (let i = -360; i <= 360; i++) {
                const matrix = AffineTransform.createScale(41, 12).rotate(radians(i));
                expect(matrix.getScaleY()).toBeCloseTo(12);
            }
        });
        it("returns correct Y scale when X scale is 0", () => {
            expect(AffineTransform.createScale(0, 10).rotate(1.3).getScaleY()).toBeCloseTo(10);
        });
        it("returns 0 for scale 0", () => {
            expect(AffineTransform.createScale(0).rotate(0.5).getScaleY()).toBe(0);
            expect(AffineTransform.createScale(40, 0).rotate(1.3).getScaleY()).toBe(0);
        });
    });

    describe("setScale", () => {
        it("sets scale matrix with common scale factor", () => {
            const m = new AffineTransform(7, 2, 3, 4, 5, 6);
            const result = m.setScale(20);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                20, 0,
                0, 20,
                0, 0
            ]);
        });
        it("sets scale matrix with individual scale factors", () => {
            const m = new AffineTransform(8, 2, 3, 4, 5, 6);
            const result = m.setScale(20, 30);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                20, 0,
                0, 30,
                0, 0
            ]);
        });
    });

    describe("createScale", () => {
        it("creates scale matrix with common scale factor", () => {
            const m = AffineTransform.createScale(20);
            expect(m.toJSON()).toEqualCloseTo([
                20, 0,
                0, 20,
                0, 0
            ]);
        });
        it("creates scale matrix with individual scale factors", () => {
            const m = AffineTransform.createScale(20, 30);
            expect(m.toJSON()).toEqualCloseTo([
                20, 0,
                0, 30,
                0, 0
            ]);
        });
    });

    describe("rotate", () => {
        it("rotates the matrix", () => {
            const m = new AffineTransform(1, 2, 3, 4, 5, 6);
            const result = m.rotate(0.5);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                2.315859079360962, 3.6728672981262207,
                2.153322219848633, 2.5514791011810303,
                5, 6
            ]);
        });
    });

    describe("getRotation", () => {
        it("returns the rotation of the matrix in radians", () => {
            const matrix = new AffineTransform();
            expect(matrix.getRotation()).toBe(0);
            matrix.rotate(radians(20));
            expect(degrees(matrix.getRotation())).toBeCloseTo(20);
            matrix.rotate(radians(-40));
            expect(degrees(matrix.getRotation())).toBeCloseTo(-20);
            matrix.translate(10, -30);
            expect(degrees(matrix.getRotation())).toBeCloseTo(-20);
            matrix.scale(3);
            expect(degrees(matrix.getRotation())).toBeCloseTo(-20);
            matrix.scale(0.1);
            expect(degrees(matrix.getRotation())).toBeCloseTo(-20);
            matrix.scale(10);
            expect(degrees(matrix.getRotation())).toBeCloseTo(-20);
            matrix.rotate(radians(180));
            expect(degrees(matrix.getRotation())).toBeCloseTo(160);
            matrix.rotate(radians(180));
            expect(degrees(matrix.getRotation())).toBeCloseTo(-20);
        });
        it("returns the rotation for any angle", () => {
            for (let i = -360; i < 360; i++) {
                const m = new AffineTransform().translate(10, 20).scale(2, 3).rotate(radians(i));
                expect(normalizeDegrees(degrees(m.getRotation()))).toBeCloseTo(normalizeDegrees(i));
            }
        });
        it("returns correct rotation when Y scale is 0", () => {
            for (let i = 0; i < 360; i++) {
                const m = new AffineTransform().translate(10, 20).scale(1, 0).rotate(radians(i));
                expect(normalizeDegrees(degrees(m.getRotation()))).toBeCloseTo(i);
            }
        });
        it("returns correct rotation when X scale is 0", () => {
            for (let i = 0; i < 360; i++) {
                const m = new AffineTransform().translate(10, 20).scale(0, 1).rotate(radians(i));
                expect(normalizeDegrees(degrees(m.getRotation()))).toBeCloseTo(i);
            }
        });
        it("returns 0 when scale is 0", () => {
            for (let i = 0; i < 360; i++) {
                const m = new AffineTransform().translate(10, 20).scale(0).rotate(radians(i));
                expect(m.getRotation()).toBe(0);
            }
        });
    });

    describe("setRotation", () => {
        it("sets rotation matrix", () => {
            const m = new AffineTransform(7, 2, 3, 4, 5, 6);
            const result = m.setRotation(0.5);
            expect(result).toBe(m);
            expect(result.toJSON()).toEqualCloseTo([
                0.8775825500488281, 0.4794255495071411,
                -0.4794255495071411, 0.8775825500488281,
                0, 0
            ]);
        });
    });

    describe("createRotation", () => {
        it("creates rotation matrix", () => {
            const m = AffineTransform.createRotation(0.5);
            expect(m.toJSON()).toEqualCloseTo([
                0.8775825500488281, 0.4794255495071411,
                -0.4794255495071411, 0.8775825500488281,
                0, 0
            ]);
        });
    });

    if (isBrowser()) {
        describe("fromDOMMatrix", () => {
            it("creates matrix from a DOMMatrix", () => {
                const domMatrix = new DOMMatrix([ 2, 3, 4, 5, 6, 7 ]);
                const matrix = AffineTransform.fromDOMMatrix(domMatrix);
                expect(matrix.toJSON()).toEqual([ 2, 3, 4, 5, 6, 7 ]);
            });
            it("throws exception when DOMMatrix is not a 2D matrix", () => {
                const domMatrix = new DOMMatrix([ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ]);
                expect(() => AffineTransform.fromDOMMatrix(domMatrix)).toThrowWithMessage(IllegalArgumentException,
                    "Can only create Matrix3 from 2D DOMMatrix");
            });
        });
        describe("toDOMMatrix", () => {
            it("creates DOMMatrix from matrix", () => {
                const matrix = new AffineTransform(2, 3, 4, 5, 6, 7);
                const domMatrix = matrix.toDOMMatrix();
                expect(domMatrix.toFloat32Array()).toEqual(
                    new Float32Array([ 2, 3, 0, 0, 4, 5, 0, 0, 0, 0, 1, 0, 6, 7, 0, 1 ]));
                expect(domMatrix.is2D).toBe(true);
            });
        });
    }

    if (hasCanvasSupport()) {
        describe("setCanvasTransform", () => {
            it("sets the transformation matrix of a canvas", () => {
                const m = new AffineTransform(2, 3, 4, 5, 6, 7);
                const canvas = createCanvas(100, 100);
                const ctx = getRenderingContext(canvas, "2d");
                ctx.setTransform(3, 123, 4598, 12, 59, 39);
                m.setCanvasTransform(ctx);
                const m2 = ctx.getTransform();
                expect(m2.a).toBeCloseTo(m[0]);
                expect(m2.b).toBeCloseTo(m[1]);
                expect(m2.c).toBeCloseTo(m[2]);
                expect(m2.d).toBeCloseTo(m[3]);
                expect(m2.e).toBeCloseTo(m[4]);
                expect(m2.f).toBeCloseTo(m[5]);
            });
        });
        describe("transformCanvas", () => {
            it("transforms the transformation matrix of a canvas", () => {
                const m = new AffineTransform(2, 3, 4, 5, 6, 7);
                const canvas = createCanvas(100, 100);
                const ctx = getRenderingContext(canvas, "2d");
                ctx.setTransform(3, 123, 4598, 12, 59, 39);
                m.transformCanvas(ctx);
                const m2 = ctx.getTransform();
                expect(m2.a).toBeCloseTo(13800);
                expect(m2.b).toBeCloseTo(282);
                expect(m2.c).toBeCloseTo(23002);
                expect(m2.d).toBeCloseTo(552);
                expect(m2.e).toBeCloseTo(32263);
                expect(m2.f).toBeCloseTo(861);
            });
        });
    }
});
