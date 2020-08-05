/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { Matrix4 } from "../../main/graphics/Matrix4";
import { Vector4 } from "../../main/graphics/Vector4";

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
        it("initializes matrix from four vectors", () => {
            const m = new Matrix4(
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
        it("initializes matrix from a buffer without offset", () => {
            const array = new Float32Array(16);
            const m = new Matrix4(array.buffer);
            m.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            expect(Array.from(array)).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]);
        });
        it("initializes matrix from a buffer with offset", () => {
            const array = new Float32Array(18);
            const vector = new Matrix4(array.buffer, 4);
            vector.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 0 ]);
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
});
