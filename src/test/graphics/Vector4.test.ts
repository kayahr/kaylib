/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { Matrix4 } from "../../main/graphics/Matrix4";
import { Vector2 } from "../../main/graphics/Vector2";
import { Vector3 } from "../../main/graphics/Vector3";
import { Vector4 } from "../../main/graphics/Vector4";

describe("Vector4", () => {
    describe("constructor", () => {
        it("initializes vector with 0 if no argument is given", () => {
            const vector = new Vector4();
            expect(vector.x).toBe(0);
            expect(vector.y).toBe(0);
            expect(vector.z).toBe(0);
            expect(vector.w).toBe(0);
        });
        it("initializes vector to given numeric values", () => {
            const vector = new Vector4(4, 5, 6, 7);
            expect(vector.x).toBe(4);
            expect(vector.y).toBe(5);
            expect(vector.z).toBe(6);
            expect(vector.w).toBe(7);
        });
        it("initializes vector to given single numeric value", () => {
            const vector = new Vector4(8);
            expect(vector.x).toBe(8);
            expect(vector.y).toBe(8);
            expect(vector.z).toBe(8);
            expect(vector.w).toBe(8);
        });
        it("initializes vector with 2D vector as first argument", () => {
            const vector = new Vector4(new Vector2(10, 20), 3, 4);
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(3);
            expect(vector.w).toBe(4);
        });
        it("initializes vector with 2D vector as second argument", () => {
            const vector = new Vector4(1, new Vector2(20, 30), 4);
            expect(vector.x).toBe(1);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(4);
        });
        it("initializes vector with 2D vector as third argument", () => {
            const vector = new Vector4(1, 2, new Vector2(30, 40));
            expect(vector.x).toBe(1);
            expect(vector.y).toBe(2);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(40);
        });
        it("initializes vector with two 2D vectors", () => {
            const vector = new Vector4(new Vector2(10, 20), new Vector2(30, 40));
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(40);
        });
        it("initializes vector with 3D vector as first argument", () => {
            const vector = new Vector4(new Vector3(10, 20, 30), 4);
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(4);
        });
        it("initializes vector with 3D vector as second argument", () => {
            const vector = new Vector4(1, new Vector3(20, 30, 40));
            expect(vector.x).toBe(1);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(40);
        });
        it("initializes vector with 4D vector", () => {
            const vector = new Vector4(new Vector4(10, 20, 30, 40));
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(40);
        });
        it("initializes vector from a buffer without offset", () => {
            const array = new Float32Array(4);
            const vector = new Vector4(array.buffer);
            vector.set(1, 2, 3, 4);
            expect(Array.from(array)).toEqual([ 1, 2, 3, 4 ]);
        });
        it("initializes vector from a buffer with offset", () => {
            const array = new Float32Array(6);
            const vector = new Vector4(array.buffer, 4);
            vector.set(1, 2, 3, 4);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 3, 4, 0 ]);
        });
    });

    describe("set", () => {
        it("sets vector to given numeric values", () => {
            const vector = new Vector4().set(4, 5, 6, 7);
            expect(vector.x).toBe(4);
            expect(vector.y).toBe(5);
            expect(vector.z).toBe(6);
            expect(vector.w).toBe(7);
        });
        it("sets vector to given single numeric value", () => {
            const vector = new Vector4().set(8);
            expect(vector.x).toBe(8);
            expect(vector.y).toBe(8);
            expect(vector.z).toBe(8);
            expect(vector.w).toBe(8);
        });
        it("sets vector with 2D vector as first argument", () => {
            const vector = new Vector4().set(new Vector2(10, 20), 3, 4);
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(3);
            expect(vector.w).toBe(4);
        });
        it("sets vector with 2D vector as second argument", () => {
            const vector = new Vector4().set(1, new Vector2(20, 30), 4);
            expect(vector.x).toBe(1);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(4);
        });
        it("sets vector with 2D vector as third argument", () => {
            const vector = new Vector4().set(1, 2, new Vector2(30, 40));
            expect(vector.x).toBe(1);
            expect(vector.y).toBe(2);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(40);
        });
        it("sets vector with two 2D vectors", () => {
            const vector = new Vector4().set(new Vector2(10, 20), new Vector2(30, 40));
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(40);
        });
        it("sets vector with 3D vector as first argument", () => {
            const vector = new Vector4().set(new Vector3(10, 20, 30), 4);
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(4);
        });
        it("sets vector with 3D vector as second argument", () => {
            const vector = new Vector4().set(1, new Vector3(20, 30, 40));
            expect(vector.x).toBe(1);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(40);
        });
        it("sets vector with 4D vector", () => {
            const vector = new Vector4().set(new Vector4(10, 20, 30, 40));
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
            expect(vector.z).toBe(30);
            expect(vector.w).toBe(40);
        });
    });

    describe("clone", () => {
        it("returns new vector", () => {
            const vector = new Vector4(6, 7, 8, 9);
            const clone = vector.clone();
            expect(clone).toBeInstanceOf(Vector4);
            expect(clone.x).toBe(6);
            expect(clone.y).toBe(7);
            expect(clone.z).toBe(8);
            expect(clone.w).toBe(9);
            expect(clone).not.toBe(vector);
        });
    });

    describe("toJSON()", () => {
        it("returns array with the vector components", () => {
            expect(new Vector4(0, -6, 1, 2.123456789).toJSON()).toEqual([ 0, -6, 1, 2.1234567165374756 ]);
        });
    });

    describe("fromJSON", () => {
        it("constructs vector from component array", () => {
            const v = Vector4.fromJSON([ 2, 3, 4, 5 ]);
            expect(v).toBeInstanceOf(Vector4);
            expect(v.x).toBe(2);
            expect(v.y).toBe(3);
            expect(v.z).toBe(4);
            expect(v.w).toBe(5);
        });
    });

    describe("toString", () => {
        it("returns string with components rounded to 5 maximum fractional digits", () => {
            const v = new Vector4(1.1234567, 2, -3.4567890, 4.143);
            expect(v.toString()).toBe("[ 1.12346, 2, -3.45679, 4.143 ]");
        });
        it("returns string with components rounded to specified maximum fractional digits", () => {
            const v = new Vector4(1.1234567, 2, -3.4567890, 4.14);
            expect(v.toString(2)).toBe("[ 1.12, 2, -3.46, 4.14 ]");
        });
    });

    describe("equals", () => {
        it("correctly implements the equality contract", () => {
            expect(new Vector4(1, 2, 3, 4)).toBeEquatable([ new Vector4(1, 2, 3, 4) ], [
                new Vector4(0, 2, 3, 4),
                new Vector4(1, 0, 3, 4),
                new Vector4(1, 2, 0, 4),
                new Vector4(1, 2, 3, 0)
            ]);
        });
    });

    describe("xyzw getters", () => {
        it("reads the vector components", () => {
            const v = new Vector4(4, 3, 2, 1);
            expect(v.x).toBe(4);
            expect(v.y).toBe(3);
            expect(v.z).toBe(2);
            expect(v.w).toBe(1);
        });
    });

    describe("xyzw setters", () => {
        it("sets the vector components", () => {
            const v = new Vector4();
            v.x = 2;
            v.y = 4;
            v.z = 6;
            v.w = 8;
            expect(v.toJSON()).toEqual([ 2, 4, 6, 8 ]);
        });
    });

    describe("neg", () => {
        it("returns negated vector", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.negate();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ -1, -2, -3, -4 ]);
        });
    });

    describe("add", () => {
        it("returns component-wise sum of vector and scalar", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.add(5);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 6, 7, 8, 9 ]);
        });
        it("returns component-wise sum of two vectors", () => {
            const v1 = new Vector4(1, 2, 3, 4);
            const v2 = new Vector4(3, 4, 5, 6);
            const result = v1.add(v2);
            expect(result.toJSON()).toEqual([ 4, 6, 8, 10 ]);
        });
    });

    describe("sub", () => {
        it("returns component-wise difference of vector and scalar", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.sub(5);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ -4, -3, -2, -1 ]);
        });
        it("returns component-wise difference of two vectors", () => {
            const v1 = new Vector4(1, 2, 3, 4);
            const v2 = new Vector4(5, 7, 9, 11);
            const result = v1.sub(v2);
            expect(result.toJSON()).toEqual([ -4, -5, -6, -7 ]);
        });
    });

    describe("compDiv", () => {
        it("returns component-wise division of vector and scalar", () => {
            const v = new Vector4(20, 10, 30, 60);
            const result = v.compDiv(2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 10, 5, 15, 30 ]);
        });
        it("returns component-wise division of two vectors", () => {
            const v1 = new Vector4(10, 12, 14, 33);
            const v2 = new Vector4(2, 3, 7, 11);
            const result = v1.compDiv(v2);
            expect(result.toJSON()).toEqual([ 5, 4, 2, 3 ]);
        });
    });

    describe("compMul", () => {
        it("returns component-wise multiplication of vector and scalar", () => {
            const v = new Vector4(20, 10, 5, 6);
            const result = v.compMul(2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 40, 20, 10, 12 ]);
        });
        it("returns component-wise multiplication of two vectors", () => {
            const v1 = new Vector4(10, 12, 15, 11);
            const v2 = new Vector4(2, 3, 4, 5);
            const result = v1.compMul(v2);
            expect(result.toJSON()).toEqual([ 20, 36, 60, 55 ]);
        });
        /*
        it("returns linear algebra multiplication with matrix", () => {
            const v = new Vector4(2, 3, 4, 5);
            const m = new Matrix4(6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21);
            const result = v.mul(m);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 110, 166, 222, 278 ]);
        });
        */
    });

    describe("getLength", () => {
        it("returns the length of the vector", () => {
            expect(new Vector4(-2, 3, 4, 5).getLength()).toBeCloseTo(7.34847);
        });
    });

    describe("getSquareLength", () => {
        it("returns the square length of the vector", () => {
            expect(new Vector4(-2, 3, 4, 5).getSquareLength()).toBeCloseTo(54);
        });
    });

    describe("getDistance", () => {
        it("returns the distance between two vectors", () => {
            expect(new Vector4(2, -5, 50, 107).getDistance(new Vector4(-9, 12, 3, -40))).toBeCloseTo(155.653);
        });
    });

    describe("getSquareDistance", () => {
        it("returns the square distance between two vectors", () => {
            expect(new Vector4(2, -5, 50, 107).getSquareDistance(new Vector4(-9, 12, 3, -40))).toBeCloseTo(24228);
        });
    });

    describe("dot", () => {
        it("returns the dot product", () => {
            expect(new Vector4(1, 2, 3, 4).dot(new Vector4(5, 6, 7, 8))).toBe(70);
        });
    });

    describe("normalize", () => {
        it("normalizes the vector", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.normalize();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.182574, 0.365148, 0.547723, 0.730297 ]);
        });
    });

    describe("reflect", () => {
        it("returns reflection of vector at plane of normal vector", () => {
            const normal = new Vector4(5, 6, 7, 8).normalize();
            const v = new Vector4(1, 2, 3, 4);
            const result = v.reflect(normal);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -3.02299, -2.82759, -2.63218, -2.43678 ]);
        });
    });

    describe("refract", () => {
        it("returns refraction vector", () => {
            const normal = new Vector4(-29, -11, 20, -11).normalize();
            const v = new Vector4(3, 32, 1, 31);
            const eta = 4;
            const result = v.refract(normal, eta);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 11.9284, 127.973, 4.04937, 123.973 ]);
            expect(new Vector4(20, 12, 23, 6).refract(new Vector4(-0.330352, -0.594633, 0.409636, 0.607847), 34)
                .toJSON()).toEqual([ 0, 0, 0, 0 ]);
        });
    });

    describe("radians", () => {
        it("converts all vector components from degrees to radians", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.radians();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.0174533, 0.0349066, 0.0523599, 0.0698132 ]);
        });
    });

    describe("degrees", () => {
        it("converts all vector components from radians to degrees", () => {
            const v = new Vector4(0.0174533, 0.0349066, 0.0523599, 0.0698132);
            const result = v.degrees();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 2, 3, 4 ]);
        });
    });

    describe("sin", () => {
        it("calculates sine for all components", () => {
            const v = new Vector4(0.2, 0.9, 0.5, 0.1);
            const result = v.sin();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.198669, 0.783327, 0.479426, 0.0998334 ]);
        });
    });

    describe("cos", () => {
        it("calculates cosine for all components", () => {
            const v = new Vector4(0.2, 0.9, 0.5, 0.1);
            const result = v.cos();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.980067, 0.62161, 0.877583, 0.995004 ]);
        });
    });

    describe("tan", () => {
        it("calculates tangent for all components", () => {
            const v = new Vector4(0.2, 0.9, 0.5, 0.1);
            const result = v.tan();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.20271, 1.26016, 0.546302, 0.100335 ]);
        });
    });

    describe("asin", () => {
        it("calculates arc sine for all components", () => {
            const v = new Vector4(0.198669, 0.783327, 0.479426, 0.0998334);
            const result = v.asin();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5, 0.1 ]);
        });
    });

    describe("acos", () => {
        it("calculates arc cosine for all components", () => {
            const v = new Vector4(0.980067, 0.62161, 0.877583, 0.995004);
            const result = v.acos();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5, 0.0999999 ]);
        });
    });

    describe("atan", () => {
        it("calculates arc tangent for all components", () => {
            const v = new Vector4(0.20271, 1.26016, 0.546302, 0.100335);
            const result = v.atan();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5, 0.1 ]);
        });
    });

    describe("atan2", () => {
        it("calculates atan2 for all components with vector as argument", () => {
            const v1 = new Vector4(1, 2, 3, 4);
            const v2 = new Vector4(4, 5, 6, 7);
            const result = v1.atan2(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 0.244979, 0.380506, 0.463648, 0.519146 ]);
        });
        it("calculates atan2 for all components with number as argument", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.atan2(3);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.321751, 0.588007, 0.7854, 0.9273 ]);
        });
    });

    describe("sinh", () => {
        it("calculates hyperbolic sine for all components", () => {
            const v = new Vector4(0.2, 0.9, 0.5, 0.1);
            const result = v.sinh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.201336, 1.02652, 0.521095, 0.100167 ]);
        });
    });

    describe("cosh", () => {
        it("calculates hyperbolic cosine for all components", () => {
            const v = new Vector4(0.2, 0.9, 0.5, 0.1);
            const result = v.cosh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1.02007, 1.43309, 1.12763, 1.005 ]);
        });
    });

    describe("tanh", () => {
        it("calculates hyperbolic tangent for all components", () => {
            const v = new Vector4(0.2, 0.9, 0.5, 0.1);
            const result = v.tanh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.197375, 0.716298, 0.462117, 0.099668 ]);
        });
    });

    describe("asinh", () => {
        it("calculates hyperbolic arc sine for all components", () => {
            const v = new Vector4(0.201336, 1.02652, 0.521095, 0.100167);
            const result = v.asinh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5, 0.1 ]);
        });
    });

    describe("acosh", () => {
        it("calculates hyperbolic arc cosine for all components", () => {
            const v = new Vector4(1.02007, 1.43309, 1.12763, 1.005);
            const result = v.acosh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5, 0.1 ]);
        });
    });

    describe("atanh", () => {
        it("calculates hyperbolic arc tangent for all components", () => {
            const v = new Vector4(0.197375, 0.716298, 0.462117, 0.099668);
            const result = v.atanh();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9, 0.5, 0.1 ]);
        });
    });

    describe("pow", () => {
        it("calculates the base to the exponent power for all components with vector as argument", () => {
            const v1 = new Vector4(2, 3, 4, 5);
            const v2 = new Vector4(3, 2, 1, 4);
            const result = v1.pow(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 8, 9, 4, 625 ]);
        });
        it("calculates the base to the exponent power for all components with number as argument", () => {
            const v = new Vector4(2, 3, 4, 5);
            const result = v.pow(4);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 16, 81, 256, 625 ]);
        });
    });

    describe("exp", () => {
        it("calculates e^x for all components", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.exp();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2.71828, 7.38906, 20.086, 54.5981 ]);
        });
    });

    describe("log", () => {
        it("calculates the natural logarithm for all components", () => {
            const v = new Vector4(0.2, 0.9, 0.5, 0.1);
            const result = v.log();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1.60944, -0.105361, -0.693147, -2.30259 ]);
        });
    });

    describe("exp2", () => {
        it("calculates 2^x for all components", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.exp2();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2, 4, 8, 16 ]);
        });
    });

    describe("log2", () => {
        it("calculates the base 2 logarithm for all components", () => {
            const v = new Vector4(0.2, 0.9, 0.5, 0.1);
            const result = v.log2();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2.32193, -0.152003, -1, -3.32193 ]);
        });
    });

    describe("sqrt", () => {
        it("calculates the square root for all components", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.sqrt();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 1.41421, 1.73205, 2 ]);
        });
    });

    describe("inverseSqrt", () => {
        it("calculates the inverse square root for all components", () => {
            const v = new Vector4(1, 2, 3, 4);
            const result = v.inverseSqrt();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 0.707107, 0.57735, 0.5 ]);
        });
    });

    describe("abs", () => {
        it("calculates the absolute values for all components", () => {
            const v = new Vector4(-1.5, 2.2, -1.3, 3.4);
            const result = v.abs();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1.5, 2.2, 1.3, 3.4 ]);
        });
    });

    describe("sign", () => {
        it("calculates the sign for all components", () => {
            const v = new Vector4(-1.5, 2.2, -1.3, 3.4);
            const result = v.sign();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, 1, -1, 1 ]);
        });
    });

    describe("floor", () => {
        it("floors all components", () => {
            const v = new Vector4(-1.5, -1.6, -1.4, -0.5);
            const result = v.floor();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2, -2, -2, -1 ]);
        });
    });

    describe("ceil", () => {
        it("ceils all components", () => {
            const v = new Vector4(-1.5, -1.6, -1.4, -0.5);
            const result = v.ceil();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, -1, -1, -0 ]);
        });
    });

    describe("round", () => {
        it("rounds all components", () => {
            const v = new Vector4(1.5, -1.6, 1.4, -0.5);
            const result = v.round();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2, -2, 1, 0 ]);
        });
    });

    describe("roundEven", () => {
        it("rounds all components to even numbers", () => {
            const v = new Vector4(-1.5, -1.6, -1.4, -0.5);
            const result = v.roundEven();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2, -2, -1, 0 ]);
        });
    });

    describe("trunc", () => {
        it("truncates all components", () => {
            const v = new Vector4(-1.5, -1.6, -1.4, -0.5);
            const result = v.trunc();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, -1, -1, -0 ]);
        });
    });

    describe("fract", () => {
        it("replaces all components with their fractional parts", () => {
            const v = new Vector4(-1.5, -1.6, -1.4, -0.5);
            const result = v.fract();
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.5, 0.4, 0.6, 0.5 ]);
        });
    });

    describe("mod", () => {
        it("calculates the modulus of all components with vector as argument", () => {
            const v1 = new Vector4(167, 151, 200, 301);
            const v2 = new Vector4(145, 133, 194, 294);
            const result = v1.mod(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 22, 18, 6, 7 ]);
        });
        it("calculates the modulus of all components with number as argument", () => {
            const v = new Vector4(167, 151, 361, 512);
            const result = v.mod(145);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 22, 6, 71, 77 ]);
        });
    });

    describe("modf", () => {
        it("returns separate integer and fractional parts", () => {
            const v = new Vector4(-9.6441, 41.423, -0.001, 4.9191);
            const i = new Vector4();
            const result = v.modf(i);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -0.6441, 0.423, -0.001, 0.9191 ]);
            expect(i.toJSON()).toEqualCloseTo([ -9, 41, 0, 4 ]);
        });
    });

    describe("min", () => {
        it("returns the minimum components from two vectors", () => {
            const v1 = new Vector4(10, 20, 30, 40);
            const v2 = new Vector4(5, 45, 100, 34);
            const result = v1.min(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 5, 20, 30, 34 ]);
        });
        it("returns the minimum components from vector and number argument", () => {
            const v = new Vector4(10, 20, 30, 4);
            const result = v.min(15);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 10, 15, 15, 4 ]);
        });
    });

    describe("max", () => {
        it("returns the maximum components from two vectors", () => {
            const v1 = new Vector4(10, 20, 30, 40);
            const v2 = new Vector4(5, 45, 100, 34);
            const result = v1.max(v2);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 10, 45, 100, 40 ]);
        });
        it("returns the maximum components from vector and number argument", () => {
            const v = new Vector4(10, 20, 30, 4);
            const result = v.max(15);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 20, 30, 15 ]);
        });
    });

    describe("clamp", () => {
        it("clamps the vector components by min and max vector", () => {
            const v = new Vector4(10, 20, 30, 40);
            const min = new Vector4(15, 10, 40, 20);
            const max = new Vector4(30, 18, 50, 30);
            const result = v.clamp(min, max);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 18, 40, 30 ]);
        });
        it("clamps the vector components by min and max number", () => {
            const v = new Vector4(10, 20, 30, 40);
            const min = 11;
            const max = 39;
            const result = v.clamp(min, max);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 11, 20, 30, 39 ]);
        });
        it("clamps the vector components by min vector and max number", () => {
            const v = new Vector4(10, 20, 30, 40);
            const min = new Vector4(15, 10, 17, 1);
            const max = 19;
            const result = v.clamp(min, max);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 19, 19, 19 ]);
        });
        it("clamps the vector components by min number and max vector", () => {
            const v = new Vector4(10, 20, 30, 40);
            const min = 15;
            const max = new Vector4(16, 17, 40, 39);
            const result = v.clamp(min, max);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 17, 30, 39 ]);
        });
    });

    describe("mix", () => {
        it("mixes the vector component with another vector by a blend vector", () => {
            const v1 = new Vector4(10, 20, 30, -40);
            const v2 = new Vector4(15, 30, 40, -60);
            const blend = new Vector4(0.5, 0.8, 0.1, 0.2);
            const result = v1.mix(v2, blend);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 12.5, 28, 31, -44 ]);
        });
        it("mixes the vector component with a target number and a blend vector", () => {
            const v = new Vector4(1, 10, 30, 5);
            const n = 20;
            const blend = new Vector4(0.25, 0.75, 0.5, 0.1);
            const result = v.mix(n, blend);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 5.75, 17.5, 25, 6.5 ]);
        });
        it("mixes the vector component with a vector using a numeric blend value", () => {
            const v1 = new Vector4(-10, -20, -30, -40);
            const v2 = new Vector4(10, 20, 30, 40);
            const blend = 0.75;
            const result = v1.mix(v2, blend);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 5, 10, 15, 20 ]);
        });
        it("mixes the vector component with a target number and a numeric blend value", () => {
            const v = new Vector4(-10, -20, -30, -40);
            const n = 10;
            const blend = 0.5;
            const result = v.mix(n, blend);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0, -5, -10, -15 ]);
        });
    });

    describe("step", () => {
        it("returns 0 if lower or 1 if higher than edge vector for each component", () => {
            const v = new Vector4(2, 3, 4, 5);
            const edge = new Vector4(3, 2, 1, -1);
            const result = v.step(edge);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 1, 1 ]);
        });
        it("returns 0 if lower or 1 if higher than edge value for each component", () => {
            const v = new Vector4(3, 2, 1, -1);
            const result = v.step(2.5);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 1, 0, 0, 0 ]);
            expect(new Vector4(2, 3, 4, 5).step(2.5).toJSON()).toEqual([ 0, 1, 1, 1 ]);
        });
    });

    describe("smoothStep", () => {
        it("returns 0 if lower than 1st edge vector or 1 if higher than 2nd edge vector for each component", () => {
            const v = new Vector4(2, 3, 4, 5);
            const edge1 = new Vector4(3, 1, 5, 3);
            const edge2 = new Vector4(5, 2, 6, 4);
            const result = v.smoothStep(edge1, edge2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 0, 1 ]);
        });
        it("returns 0 if lower than 1st edge value or 1 if higher than 2nd edge vector for each component", () => {
            const v = new Vector4(2, 3, 4, 5);
            const edge1 = 2.5;
            const edge2 = new Vector4(5, 2.6, 3.9, 4);
            const result = v.smoothStep(edge1, edge2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 1, 1 ]);
            expect(new Vector4(6, 2.4, 2.3, -100).smoothStep(edge1, edge2).toJSON()).toEqual([ 1, 0, 0, 0 ]);
        });
        it("returns 0 if lower than 1st edge vector or 1 if higher than 2nd edge value for each component", () => {
            const v = new Vector4(2, 5, 8, 12);
            const edge1 = new Vector4(3, 1, 7, 8);
            const edge2 = 4;
            const result = v.smoothStep(edge1, edge2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 1, 1 ]);
            expect(new Vector4(6, 0.5, -20, -300).smoothStep(edge1, edge2).toJSON()).toEqual([ 1, 0, 0, 0 ]);
        });
        it("returns 0 if lower than 1st edge value or 1 if higher than 2nd edge value for each component", () => {
            const v = new Vector4(2, 5, 8, 12);
            const edge1 = 3;
            const edge2 = 4;
            const result = v.smoothStep(edge1, edge2);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1, 1, 1 ]);
            expect(new Vector4(5, 2, -1, 2.9).smoothStep(edge1, edge2).toJSON()).toEqual([ 1, 0, 0, 0 ]);
        });
        it("returns components between 0 and 1 if between 1st and 2nd edge vector", () => {
            expect(new Vector4(1, 2, 3, 3.5).smoothStep(0, 4).toJSON()).toEqualCloseTo(
                [ 0.15625, 0.5, 0.84375, 0.95703125 ]);
            expect(new Vector4(0, 1, -1, -1.9).smoothStep(-2, 2).toJSON()).toEqualCloseTo(
                [ 0.5, 0.84375, 0.15625, 0.00184375 ]);
        });
    });

    describe("mul", () => {
        it("multiplies vector by the given matrix", () => {
            const v = new Vector4(2, 3, 4, 5);
            const m = new Matrix4(6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21);
            const result = v.mul(m);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 188, 202, 216, 230 ]);
        });
    });

    describe("transposeMul", () => {
        it("multiplies vector by the transpose of the given matrix", () => {
            const v = new Vector4(2, 3, 4, 5);
            const m = new Matrix4(6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21);
            const result = v.transposeMul(m);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 110, 166, 222, 278 ]);
        });
    });

    describe("div", () => {
        it("multiplies vector by the inverse of the given matrix", () => {
            const v = new Vector4(2, 3, 4, 5);
            const m = new Matrix4(20, 18, 16, 14, 12, 10, 7, 6, 8, 9, 11, 13, 15, 17, 19, 21);
            const result = v.div(m);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -0.157143, 0, 0, 0.342857 ]);
        });
    });

    describe("transposeDiv", () => {
        it("multiplies vector by the inverted transpose of the given matrix", () => {
            const v = new Vector4(2, 3, 4, 5);
            const m = new Matrix4(20, 18, 16, 14, 12, 10, 7, 6, 8, 9, 11, 13, 15, 17, 19, 21);
            const result = v.transposeDiv(m);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.6, 0.2, -2.6, 2 ]);
        });
    });
});
