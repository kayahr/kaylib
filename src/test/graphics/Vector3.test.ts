/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { Matrix3 } from "../../main/graphics/Matrix3";
import { Vector2 } from "../../main/graphics/Vector2";
import { Vector3 } from "../../main/graphics/Vector3";

describe("Vector3", () => {
    describe("constructor", () => {
        it("initializes vector with 0 if no argument is given", () => {
            const vector = new Vector3();
            expect(vector.x).toBe(0);
            expect(vector.y).toBe(0);
            expect(vector.z).toBe(0);
        });
        it("initializes vector to given numeric values", () => {
            const vector = new Vector3(4, 5, 6);
            expect(vector.x).toBe(4);
            expect(vector.y).toBe(5);
            expect(vector.z).toBe(6);
        });
        it("initializes vector from a buffer without offset", () => {
            const array = new Float32Array(3);
            const vector = new Vector3(array.buffer);
            vector.setComponents(1, 2, 3);
            expect(Array.from(array)).toEqual([ 1, 2, 3 ]);
        });
        it("initializes vector from a buffer with offset", () => {
            const array = new Float32Array(5);
            const vector = new Vector3(array.buffer, 4);
            vector.setComponents(1, 2, 3);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 0 ]);
        });
    });

    describe("fromVector", () => {
        it("initializes vector with 2D vector as first argument", () => {
            const vector = Vector3.fromVector(new Vector2(10, 20), 3);
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(3);
        });
        it("initializes vector with 2D vector as second argument", () => {
            const vector = Vector3.fromVector(1, new Vector2(20, 30));
            expect(vector.x).toBe(1);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
        });
        it("initializes vector with 3D vector", () => {
            const vector = Vector3.fromVector(new Vector3(10, 20, 30));
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
        });
    });

    describe("setComponents", () => {
        it("sets vector to given numeric values", () => {
            const vector = new Vector3().setComponents(4, 5, 6);
            expect(vector.x).toBe(4);
            expect(vector.y).toBe(5);
            expect(vector.z).toBe(6);
        });
    });

    describe("setVector", () => {
        it("sets vector with 2D vector as first argument", () => {
            const vector = new Vector3().setVector(new Vector2(10, 20), 3);
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(3);
        });
        it("sets vector with 2D vector as second argument", () => {
            const vector = new Vector3().setVector(1, new Vector2(20, 30));
            expect(vector.x).toBe(1);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
        });
        it("sets vector with 3D vector", () => {
            const vector = new Vector3().setVector(new Vector3(10, 20, 30));
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
        });
    });

    describe("clone", () => {
        it("returns new vector", () => {
            const vector = new Vector3(6, 7, 8);
            const clone = vector.clone();
            expect(clone).toBeInstanceOf(Vector3);
            expect(clone.x).toBe(6);
            expect(clone.y).toBe(7);
            expect(clone.z).toBe(8);
            expect(clone).not.toBe(vector);
        });
    });

    describe("toJSON()", () => {
        it("returns array with the vector components", () => {
            expect(new Vector3(-6, 1, 2.123456789).toJSON()).toEqual([ -6, 1, 2.1234567165374756 ]);
        });
    });

    describe("fromJSON", () => {
        it("constructs vector from component array", () => {
            const v = Vector3.fromJSON([ 2, 3, 4 ]);
            expect(v).toBeInstanceOf(Vector3);
            expect(v.x).toBe(2);
            expect(v.y).toBe(3);
            expect(v.z).toBe(4);
        });
    });

    describe("toString", () => {
        it("returns string with components rounded to 5 maximum fractional digits", () => {
            const v = new Vector3(1.1234567, 2, -3.4567890);
            expect(v.toString()).toBe("[ 1.12346, 2, -3.45679 ]");
        });
        it("returns string with components rounded to specified maximum fractional digits", () => {
            const v = new Vector3(1.1234567, 2, -3.4567890);
            expect(v.toString(2)).toBe("[ 1.12, 2, -3.46 ]");
        });
    });

    describe("equals", () => {
        it("correctly implements the equality contract", () => {
            expect(new Vector3(1, 2, 3)).toBeEquatable([ new Vector3(1, 2, 3) ], [
                new Vector3(0, 2, 3),
                new Vector3(1, 0, 3),
                new Vector3(1, 2, 0)
            ]);
        });
    });

    describe("xyz getters", () => {
        it("reads the vector components", () => {
            const v = new Vector3(4, 3, 2);
            expect(v.x).toBe(4);
            expect(v.y).toBe(3);
            expect(v.z).toBe(2);
        });
    });

    describe("xyz setters", () => {
        it("sets the vector components", () => {
            const v = new Vector3();
            v.x = 2;
            v.y = 4;
            v.z = 6;
            expect(v.toJSON()).toEqual([ 2, 4, 6 ]);
        });
    });

    describe("negate", () => {
        it("returns negated vector", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.negate();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ -1, -2, -3 ]);
        });
    });

    describe("reset", () => {
        it("resets all vector components to 0", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.reset();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 0, 0 ]);
        });
    });

    describe("add", () => {
        it("returns component-wise sum of vector and scalar", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.add(5);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 6, 7, 8 ]);
        });
        it("returns component-wise sum of two vectors", () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(3, 4, 5);
            const result = v1.add(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqual([ 4, 6, 8 ]);
        });
    });

    describe("sub", () => {
        it("returns component-wise difference of vector and scalar", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.sub(5);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ -4, -3, -2 ]);
        });
        it("returns component-wise difference of two vectors", () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(3, 4, 5);
            const result = v1.sub(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqual([ -2, -2, -2 ]);
        });
    });

    describe("div", () => {
        it("returns component-wise division of vector and scalar", () => {
            const v = new Vector3(20, 10, 30);
            const result = v.compDiv(2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 10, 5, 15 ]);
        });
        it("returns component-wise division of two vectors", () => {
            const v1 = new Vector3(10, 12, 14);
            const v2 = new Vector3(2, 3, 7);
            const result = v1.compDiv(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqual([ 5, 4, 2 ]);
        });
    });

    describe("compMul", () => {
        it("multiplies components of vector with given scalar", () => {
            const v = new Vector3(20, 10, 5);
            const result = v.compMul(2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 40, 20, 10 ]);
        });
        it("multiplies vector with given vector component-wise", () => {
            const v1 = new Vector3(10, 12, 15);
            const v2 = new Vector3(2, 3, 4);
            const result = v1.compMul(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqual([ 20, 36, 60 ]);
        });
    });

    describe("mul", () => {
        it("multiplies vector by the given matrix", () => {
            const v = new Vector3(2, 3, 4);
            const m = new Matrix3(5, 6, 7, 8, 9, 10, 11, 12, 13);
            const result = v.mul(m);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 56, 83, 110 ]);
        });
    });

    describe("transposeMul", () => {
        it("multiplies vector by the transpose of the given matrix", () => {
            const v = new Vector3(2, 3, 4);
            const m = new Matrix3(5, 6, 7, 8, 9, 10, 11, 12, 13);
            const result = v.transposeMul(m);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 78, 87, 96 ]);
        });
    });

    describe("div", () => {
        it("multiplies vector by the inverse of the given matrix", () => {
            const v = new Vector3(54, 47, 38);
            const m = new Matrix3(1, 9, 2, 8, 3, 6, 7, 5, 4);
            const result = v.div(m);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 2, 3, 4 ]);
        });
    });

    describe("transposeDiv", () => {
        it("multiplies vector by the inverted transpose of the given matrix", () => {
            const v = new Vector3(37, 49, 45);
            const m = new Matrix3(1, 9, 2, 8, 3, 6, 7, 5, 4);
            const result = v.transposeDiv(m);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 2, 3, 4 ]);
        });
    });

    describe("getLength", () => {
        it("returns the length of the vector", () => {
            expect(new Vector3(-2, 3, 4).getLength()).toBeCloseTo(5.38516);
        });
    });

    describe("getSquareLength", () => {
        it("returns the square length of the vector", () => {
            expect(new Vector3(-2, 3, 4).getSquareLength()).toBeCloseTo(29);
        });
    });

    describe("getDistance", () => {
        it("returns the distance between two vectors", () => {
            expect(new Vector3(2, -5, 50).getDistance(new Vector3(-9, 12, 3))).toBeCloseTo(51.1762);
        });
    });

    describe("getSquareDistance", () => {
        it("returns the square distance between two vectors", () => {
            expect(new Vector3(2, -5, 50).getSquareDistance(new Vector3(-9, 12, 3))).toBeCloseTo(2619);
        });
    });

    describe("cross", () => {
        it("returns the cross product", () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(4, 5, 6);
            const result = v1.cross(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqual([ -3, 6, -3 ]);
        });
    });

    describe("dot", () => {
        it("returns the dot product", () => {
            expect(new Vector3(1, 2, 3).dot(new Vector3(4, 5, 6))).toBe(32);
        });
    });

    describe("normalize", () => {
        it("normalizes the vector", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.normalize();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.267261, 0.534522, 0.801784 ]);
        });
    });

    describe("reflect", () => {
        it("returns reflection of vector at plane of normal vector", () => {
            const normal = new Vector3(4, 5, 6).normalize();
            const v = new Vector3(1, 2, 3);
            const result = v.reflect(normal);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2.32468, -2.15584, -1.98701 ]);
        });
    });

    describe("refract", () => {
        it("returns refraction vector", () => {
            const normal = new Vector3(43, 19, 37).normalize();
            const v = new Vector3(8, 22, -33);
            const eta = -20;
            const result = v.refract(normal, eta);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -379.648, -537.054, 471 ]);
            expect(new Vector3(27, 36, 33).refract(new Vector3(-0.261156, 0.748647, -0.609364), 36).toJSON()).toEqual(
                [ 0, 0, 0 ]);
        });
    });

    describe("radians", () => {
        it("converts all vector components from degrees to radians", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.radians();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.0174533, 0.0349066, 0.0523599 ]);
        });
    });

    describe("degrees", () => {
        it("converts all vector components from radians to degrees", () => {
            const v = new Vector3(0.0174533, 0.0349066, 0.0523599);
            const result = v.degrees();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 2, 3 ]);
        });
    });

    describe("sin", () => {
        it("calculates sine for all components", () => {
            const v = new Vector3(0.2, 0.9, 0.5);
            const result = v.sin();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.198669, 0.783327, 0.479426 ]);
        });
    });

    describe("cos", () => {
        it("calculates cosine for all components", () => {
            const v = new Vector3(0.2, 0.9, 0.5);
            const result = v.cos();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.980067, 0.62161, 0.877583 ]);
        });
    });

    describe("tan", () => {
        it("calculates tangent for all components", () => {
            const v = new Vector3(0.2, 0.9, 0.5);
            const result = v.tan();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.20271, 1.26016, 0.546302 ]);
        });
    });

    describe("asin", () => {
        it("calculates arc sine for all components", () => {
            const v = new Vector3(0.198669, 0.783327, 0.479426);
            const result = v.asin();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5 ]);
        });
    });

    describe("acos", () => {
        it("calculates arc cosine for all components", () => {
            const v = new Vector3(0.980067, 0.62161, 0.877583);
            const result = v.acos();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5 ]);
        });
    });

    describe("atan", () => {
        it("calculates arc tangent for all components", () => {
            const v = new Vector3(0.20271, 1.26016, 0.546302);
            const result = v.atan();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5 ]);
        });
    });

    describe("atan2", () => {
        it("calculates atan2 for all components with vector as argument", () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(4, 5, 6);
            const result = v1.atan2(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 0.244979, 0.380506, 0.463648 ]);
        });
        it("calculates atan2 for all components with number as argument", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.atan2(3);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.321751, 0.588007, 0.7854 ]);
        });
    });

    describe("sinh", () => {
        it("calculates hyperbolic sine for all components", () => {
            const v = new Vector3(0.2, 0.9, 0.5);
            const result = v.sinh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.201336, 1.02652, 0.521095 ]);
        });
    });

    describe("cosh", () => {
        it("calculates hyperbolic cosine for all components", () => {
            const v = new Vector3(0.2, 0.9, 0.5);
            const result = v.cosh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1.02007, 1.43309, 1.12763 ]);
        });
    });

    describe("tanh", () => {
        it("calculates hyperbolic tangent for all components", () => {
            const v = new Vector3(0.2, 0.9, 0.5);
            const result = v.tanh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.197375, 0.716298, 0.462117 ]);
        });
    });

    describe("asinh", () => {
        it("calculates hyperbolic arc sine for all components", () => {
            const v = new Vector3(0.201336, 1.02652, 0.521095);
            const result = v.asinh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5 ]);
        });
    });

    describe("acosh", () => {
        it("calculates hyperbolic arc cosine for all components", () => {
            const v = new Vector3(1.02007, 1.43309, 1.12763);
            const result = v.acosh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5 ]);
        });
    });

    describe("atanh", () => {
        it("calculates hyperbolic arc tangent for all components", () => {
            const v = new Vector3(0.197375, 0.716298, 0.462117);
            const result = v.atanh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5 ]);
        });
    });

    describe("pow", () => {
        it("calculates the base to the exponent power for all components with vector as argument", () => {
            const v1 = new Vector3(2, 3, 4);
            const v2 = new Vector3(3, 2, 1);
            const result = v1.pow(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 8, 9, 4 ]);
        });
        it("calculates the base to the exponent power for all components with number as argument", () => {
            const v = new Vector3(2, 3, 4);
            const result = v.pow(4);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 16, 81, 256 ]);
        });
    });

    describe("exp", () => {
        it("calculates e^x for all components", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.exp();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2.71828, 7.38906, 20.086 ]);
        });
    });

    describe("log", () => {
        it("calculates the natural logarithm for all components", () => {
            const v = new Vector3(0.2, 0.9, 0.5);
            const result = v.log();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1.60944, -0.105361, -0.693147 ]);
        });
    });

    describe("exp2", () => {
        it("calculates 2^x for all components", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.exp2();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2, 4, 8 ]);
        });
    });

    describe("log2", () => {
        it("calculates the base 2 logarithm for all components", () => {
            const v = new Vector3(0.2, 0.9, 0.5);
            const result = v.log2();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2.32193, -0.152003, -1 ]);
        });
    });

    describe("sqrt", () => {
        it("calculates the square root for all components", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.sqrt();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 1.41421, 1.73205 ]);
        });
    });

    describe("inverseSqrt", () => {
        it("calculates the inverse square root for all components", () => {
            const v = new Vector3(1, 2, 3);
            const result = v.inverseSqrt();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 0.707107, 0.57735 ]);
        });
    });

    describe("abs", () => {
        it("calculates the absolute values for all components", () => {
            const v = new Vector3(-1.5, 2.2, -1.3);
            const result = v.abs();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1.5, 2.2, 1.3 ]);
        });
    });

    describe("sign", () => {
        it("calculates the sign for all components", () => {
            const v = new Vector3(-1.5, 2.2, -1.3);
            const result = v.sign();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, 1, -1 ]);
        });
    });

    describe("floor", () => {
        it("floors all components", () => {
            const v = new Vector3(-1.5, -1.6, -1.4);
            const result = v.floor();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2, -2, -2 ]);
        });
    });

    describe("ceil", () => {
        it("ceils all components", () => {
            const v = new Vector3(-1.5, -1.6, -1.4);
            const result = v.ceil();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, -1, -1 ]);
        });
    });

    describe("round", () => {
        it("rounds all components", () => {
            const v = new Vector3(1.5, -1.6, 1.4);
            const result = v.round();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2, -2, 1 ]);
        });
    });

    describe("roundEven", () => {
        it("rounds all components to even numbers", () => {
            const v = new Vector3(-1.5, -1.6, -1.4);
            const result = v.roundEven();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2, -2, -1 ]);
        });
    });

    describe("trunc", () => {
        it("truncates all components", () => {
            const v = new Vector3(-1.5, -1.6, -1.4);
            const result = v.trunc();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, -1, -1 ]);
        });
    });

    describe("fract", () => {
        it("replaces all components with their fractional parts", () => {
            const v = new Vector3(-1.5, -1.6, -1.4);
            const result = v.fract();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.5, 0.4, 0.6 ]);
        });
    });

    describe("mod", () => {
        it("calculates the modulus of all components with vector as argument", () => {
            const v1 = new Vector3(167, 151, 200);
            const v2 = new Vector3(145, 133, 194);
            const result = v1.mod(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 22, 18, 6 ]);
        });
        it("calculates the modulus of all components with number as argument", () => {
            const v = new Vector3(167, 151, 361);
            const result = v.mod(145);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 22, 6, 71 ]);
        });
    });

    describe("modf", () => {
        it("returns separate integer and fractional parts", () => {
            const v = new Vector3(-9.6441, 41.423, -0.001);
            const i = new Vector3();
            const result = v.modf(i);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -0.6441, 0.423, -0.001 ]);
            expect(i.toJSON()).toEqualCloseTo([ -9, 41, 0 ]);
        });
    });

    describe("min", () => {
        it("returns the minimum components from two vectors", () => {
            const v1 = new Vector3(10, 20, 30);
            const v2 = new Vector3(5, 45, 100);
            const result = v1.min(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 5, 20, 30 ]);
        });
        it("returns the minimum components from vector and number argument", () => {
            const v = new Vector3(10, 20, 30);
            const result = v.min(15);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 10, 15, 15 ]);
        });
    });

    describe("max", () => {
        it("returns the maximum components from two vectors", () => {
            const v1 = new Vector3(10, 20, 30);
            const v2 = new Vector3(5, 45, 100);
            const result = v1.max(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 10, 45, 100 ]);
        });
        it("returns the maximum components from vector and number argument", () => {
            const v = new Vector3(10, 20, 30);
            const result = v.max(15);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 20, 30 ]);
        });
    });

    describe("clamp", () => {
        it("clamps the vector components by min and max vector", () => {
            const v = new Vector3(10, 20, 30);
            const min = new Vector3(15, 10, 40);
            const max = new Vector3(30, 18, 50);
            const result = v.clamp(min, max);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 18, 40 ]);
        });
        it("clamps the vector components by min and max number", () => {
            const v = new Vector3(10, 20, 40);
            const min = 11;
            const max = 39;
            const result = v.clamp(min, max);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 11, 20, 39 ]);
        });
        it("clamps the vector components by min vector and max number", () => {
            const v = new Vector3(10, 20, 30);
            const min = new Vector3(15, 10, 17);
            const max = 19;
            const result = v.clamp(min, max);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 19, 19 ]);
        });
        it("clamps the vector components by min number and max vector", () => {
            const v = new Vector3(10, 20, 30);
            const min = 15;
            const max = new Vector3(16, 17, 40);
            const result = v.clamp(min, max);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 17, 30 ]);
        });
    });

    describe("mix", () => {
        it("mixes the vector component with another vector by a blend vector", () => {
            const v1 = new Vector3(10, 20, 30);
            const v2 = new Vector3(15, 30, 40);
            const blend = new Vector3(0.5, 0.8, 0.1);
            const result = v1.mix(v2, blend);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 12.5, 28, 31 ]);
        });
        it("mixes the vector component with a target number and a blend vector", () => {
            const v = new Vector3(1, 10, 30);
            const n = 20;
            const blend = new Vector3(0.25, 0.75, 0.5);
            const result = v.mix(n, blend);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 5.75, 17.5, 25 ]);
        });
        it("mixes the vector component with a vector using a numeric blend value", () => {
            const v1 = new Vector3(-10, -20, -30);
            const v2 = new Vector3(10, 20, 30);
            const blend = 0.75;
            const result = v1.mix(v2, blend);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 5, 10, 15 ]);
        });
        it("mixes the vector component with a target number and a numeric blend value", () => {
            const v = new Vector3(-10, -20, -30);
            const n = 10;
            const blend = 0.5;
            const result = v.mix(n, blend);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0, -5, -10 ]);
        });
    });

    describe("step", () => {
        it("returns 0 if lower or 1 if higher than edge vector for each component", () => {
            const v = new Vector3(2, 3, 4);
            const edge = new Vector3(3, 2, 1);
            const result = v.step(edge);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 1 ]);
        });
        it("returns 0 if lower or 1 if higher than edge value for each component", () => {
            const v = new Vector3(3, 2, 1);
            const result = v.step(2.5);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 1, 0, 0 ]);
            expect(new Vector3(2, 3, 4).step(2.5).toJSON()).toEqual([ 0, 1, 1 ]);
        });
    });

    describe("smoothStep", () => {
        it("returns 0 if lower than 1st edge vector or 1 if higher than 2nd edge vector for each component", () => {
            const v = new Vector3(2, 3, 4);
            const edge1 = new Vector3(3, 1, 5);
            const edge2 = new Vector3(5, 2, 6);
            const result = v.smoothStep(edge1, edge2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 0 ]);
        });
        it("returns 0 if lower than 1st edge value or 1 if higher than 2nd edge vector for each component", () => {
            const v = new Vector3(2, 3, 4);
            const edge1 = 2.5;
            const edge2 = new Vector3(5, 2.6, 3.9);
            const result = v.smoothStep(edge1, edge2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 1 ]);
            expect(new Vector3(6, 2.4, 2.3).smoothStep(edge1, edge2).toJSON()).toEqual([ 1, 0, 0 ]);
        });
        it("returns 0 if lower than 1st edge vector or 1 if higher than 2nd edge value for each component", () => {
            const v = new Vector3(2, 5, 8);
            const edge1 = new Vector3(3, 1, 7);
            const edge2 = 4;
            const result = v.smoothStep(edge1, edge2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 1 ]);
            expect(new Vector3(6, 0.5, -20).smoothStep(edge1, edge2).toJSON()).toEqual([ 1, 0, 0 ]);
        });
        it("returns 0 if lower than 1st edge value or 1 if higher than 2nd edge value for each component", () => {
            const v = new Vector3(2, 5, 8);
            const edge1 = 3;
            const edge2 = 4;
            const result = v.smoothStep(edge1, edge2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 1 ]);
            expect(new Vector3(5, 2, -1).smoothStep(edge1, edge2).toJSON()).toEqual([ 1, 0, 0 ]);
        });
        it("returns components between 0 and 1 if between 1st and 2nd edge vector", () => {
            expect(new Vector3(1, 2, 3).smoothStep(0, 4).toJSON()).toEqual([ 0.15625, 0.5, 0.84375 ]);
            expect(new Vector3(0, 1, -1).smoothStep(-2, 2).toJSON()).toEqual([ 0.5, 0.84375, 0.15625 ]);
        });
    });
});
