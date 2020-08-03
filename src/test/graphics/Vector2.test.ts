/*
 * Copyright (C) 2019 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "@kayahr/jest-matchers";

import { Matrix2 } from "../../main/graphics/Matrix2";
import { Vector2 } from "../../main/graphics/Vector2";

describe("Vector2", () => {
    describe("constructor", () => {
        it("initializes vector with 0 if no argument is given", () => {
            const vector = new Vector2();
            expect(vector.x).toBe(0);
            expect(vector.y).toBe(0);
        });
        it("initializes vector to given numeric values", () => {
            const vector = new Vector2(4, 5);
            expect(vector.x).toBe(4);
            expect(vector.y).toBe(5);
        });
        it("initializes vector to given single numeric value", () => {
            const vector = new Vector2(8);
            expect(vector.x).toBe(8);
            expect(vector.y).toBe(8);
        });
        it("initializes vector with 2D vector", () => {
            const vector = new Vector2(new Vector2(10, 20));
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
        });
        it("initializes vector from a buffer without offset", () => {
            const array = new Float32Array(2);
            const vector = new Vector2(array.buffer);
            vector.set(1, 2);
            expect(Array.from(array)).toEqual([ 1, 2 ]);
        });
        it("initializes vector from a buffer with offset", () => {
            const array = new Float32Array(4);
            const vector = new Vector2(array.buffer, 4);
            vector.set(1, 2);
            expect(Array.from(array)).toEqual([ 0, 1, 2, 0 ]);
        });
    });

    describe("set", () => {
        it("sets vector to given numeric values", () => {
            const vector = new Vector2().set(4, 5);
            expect(vector.x).toBe(4);
            expect(vector.y).toBe(5);
        });
        it("sets vector to given single numeric value", () => {
            const vector = new Vector2().set(8);
            expect(vector.x).toBe(8);
            expect(vector.y).toBe(8);
        });
        it("sets vector with 2D vector", () => {
            const vector = new Vector2().set(new Vector2(10, 20));
            expect(vector.x).toBe(10);
            expect(vector.y).toBe(20);
        });
    });

    describe("clone", () => {
        it("returns new vector", () => {
            const vector = new Vector2(6, 7);
            const clone = vector.clone();
            expect(clone).toBeInstanceOf(Vector2);
            expect(clone.x).toBe(6);
            expect(clone.y).toBe(7);
            expect(clone).not.toBe(vector);
        });
    });

    describe("toJSON()", () => {
        it("returns array with the vector components", () => {
            expect(new Vector2(1, 2.123456789).toJSON()).toEqual([ 1, 2.1234567165374756 ]);
        });
        it("returns array with the vector components with given number of fraction digits", () => {
            expect(new Vector2(1.1234567, -2.827634687).toJSON(2)).toEqual([ 1.12, -2.83 ]);
        });
    });

    describe("fromJSON", () => {
        it("constructs vector from component array", () => {
            const v = Vector2.fromJSON([ 2, 3 ]);
            expect(v).toBeInstanceOf(Vector2);
            expect(v.x).toBe(2);
            expect(v.y).toBe(3);
        });
    });

    describe("toString", () => {
        it("returns string with components rounded to 5 maximum fractional digits", () => {
            const v = new Vector2(1.1234567, 2);
            expect(v.toString()).toBe("[ 1.12346, 2 ]");
        });
        it("returns string with components rounded to specified maximum fractional digits", () => {
            const v = new Vector2(1.1234567, 2);
            expect(v.toString(2)).toBe("[ 1.12, 2 ]");
        });
    });

    describe("equals", () => {
        it("correctly implements the equality contract", () => {
            expect(new Vector2(1, 2)).toBeEquatable([ new Vector2(1, 2) ], [
                new Vector2(1, 3),
                new Vector2(3, 2)
            ]);
        });
        it("supports reducing precision for equality check", () => {
            expect(new Vector2(1.23456, -2.34567).equals(new Vector2(1.231, -2.349), 2)).toBe(true);
            expect(new Vector2(1.23456, -2.34567).equals(new Vector2(1.231, -2.349), 3)).toBe(false);
        });
    });

    describe("xy getters", () => {
        it("reads the vector components", () => {
            const v = new Vector2(4, 3);
            expect(v.x).toBe(4);
            expect(v.y).toBe(3);
        });
    });

    describe("xy setters", () => {
        it("sets the vector components", () => {
            const v = new Vector2();
            v.x = 2;
            v.y = 4;
            expect(v.toJSON()).toEqual([ 2, 4 ]);
        });
    });

    describe("negate", () => {
        it("negates the vector", () => {
            const v = new Vector2(1, 2);
            const result = v.negate();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ -1, -2 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(1, 2);
            const result = v.negate(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ -1, -2 ]);
        });
    });

    describe("add", () => {
        it("component-wise adds a scalar to the vector", () => {
            const v = new Vector2(1, 2);
            const result = v.add(5);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 6, 7 ]);
        });
        it("component-wise adds a vector to the vector", () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            const result = v1.add(v2);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqual([ 4, 6 ]);
        });
        it("can use source as result when adding scalar", () => {
            const v = new Vector2(1, 2);
            const result = v.add(5, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 6, 7 ]);
        });
        it("can use source as result when adding vector", () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            const result = v1.add(v2, v1);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqual([ 4, 6 ]);
        });
        it("can use summand vector as result", () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            const result = v1.add(v2, v2);
            expect(result).toBe(v2);
            expect(v1.toJSON()).toEqual([ 1, 2 ]);
            expect(result.toJSON()).toEqual([ 4, 6 ]);
        });
    });

    describe("sub", () => {
        it("component-wise subtracts a scalar from the vector", () => {
            const v = new Vector2(1, 2);
            const result = v.sub(5);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ -4, -3 ]);
        });
        it("component-wise subtracts a vector from the vector", () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            const result = v1.sub(v2);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqual([ -2, -2 ]);
        });
        it("can use source as result when subtracting scalar", () => {
            const v = new Vector2(1, 2);
            const result = v.sub(5, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ -4, -3 ]);
        });
        it("can use source as result when subtracting vector", () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            const result = v1.sub(v2, v1);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqual([ -2, -2 ]);
        });
        it("can use subtrahend vector as result", () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            const result = v1.sub(v2, v2);
            expect(result).toBe(v2);
            expect(result.toJSON()).toEqual([ -2, -2 ]);
            expect(v1.toJSON()).toEqual([ 1, 2 ]);
        });
    });

    describe("compDiv", () => {
        it("component-wise divides the vector by a scalar", () => {
            const v = new Vector2(20, 10);
            const result = v.compDiv(2);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 10, 5 ]);
        });
        it("component-wise divides the vector by a vector", () => {
            const v1 = new Vector2(10, 12);
            const v2 = new Vector2(2, 3);
            const result = v1.compDiv(v2);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqual([ 5, 4 ]);
        });
        it("can use source as result when dividing by scalar", () => {
            const v = new Vector2(20, 10);
            const result = v.compDiv(2, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 10, 5 ]);
        });
        it("can use source as result when dividing by vector", () => {
            const v1 = new Vector2(10, 12);
            const v2 = new Vector2(2, 3);
            const result = v1.compDiv(v2, v1);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqual([ 5, 4 ]);
        });
        it("can use divisor vector as result", () => {
            const v1 = new Vector2(10, 12);
            const v2 = new Vector2(2, 3);
            const result = v1.compDiv(v2, v2);
            expect(result).toBe(v2);
            expect(result.toJSON()).toEqual([ 5, 4 ]);
            expect(v1.toJSON()).toEqual([ 10, 12 ]);
        });
    });

    describe("compMul", () => {
        it("component-wise multiplies the vector by a scalar", () => {
            const v = new Vector2(20, 10);
            const result = v.compMul(2);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 40, 20 ]);
        });
        it("component-wise multiplies the vector by a vector", () => {
            const v1 = new Vector2(10, 12);
            const v2 = new Vector2(2, 3);
            const result = v1.compMul(v2);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqual([ 20, 36 ]);
        });
        it("can use source as result when multiplying by scalar", () => {
            const v = new Vector2(20, 10);
            const result = v.compMul(2, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 40, 20 ]);
        });
        it("can use source as result when multiplying by vector", () => {
            const v1 = new Vector2(10, 12);
            const v2 = new Vector2(2, 3);
            const result = v1.compMul(v2, v1);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqual([ 20, 36 ]);
        });
        it("can use factor vector as result", () => {
            const v1 = new Vector2(10, 12);
            const v2 = new Vector2(2, 3);
            const result = v1.compMul(v2, v2);
            expect(result).toBe(v2);
            expect(result.toJSON()).toEqual([ 20, 36 ]);
            expect(v1.toJSON()).toEqual([ 10, 12 ]);
        });
    });

    describe("getLength", () => {
        it("returns the length of the vector", () => {
            expect(new Vector2(-2, 3).getLength()).toBeCloseTo(3.60555);
        });
    });

    describe("getSquareLength", () => {
        it("returns the square length of the vector", () => {
            expect(new Vector2(-2, 3).getSquareLength()).toBeCloseTo(13);
        });
    });

    describe("getDistance", () => {
        it("returns the distance between two vectors", () => {
            expect(new Vector2(2, -5).getDistance(new Vector2(-9, 12))).toBeCloseTo(20.2485);
        });
    });

    describe("getSquareDistance", () => {
        it("returns the square distance between two vectors", () => {
            expect(new Vector2(2, -5).getSquareDistance(new Vector2(-9, 12))).toBeCloseTo(410);
        });
    });

    describe("dot", () => {
        it("returns the dot product", () => {
            expect(new Vector2(1, 2).dot(new Vector2(3, 4))).toBe(11);
        });
    });

    describe("normalize", () => {
        it("normalizes the vector", () => {
            const v = new Vector2(1, 2);
            const result = v.normalize();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.447214, 0.894427 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(1, 2);
            const result = v.normalize(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.447214, 0.894427 ]);
        });
    });

    describe("reflect", () => {
        it("reflects the vector at plane of normal vector", () => {
            const normal = new Vector2(3, 4).normalize();
            const v = new Vector2(1, 2);
            const result = v.reflect(normal);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1.64, -1.52 ]);
        });
        it("can use source as result", () => {
            const normal = new Vector2(3, 4).normalize();
            const v = new Vector2(1, 2);
            const result = v.reflect(normal, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1.64, -1.52 ]);
        });
    });

    describe("refract", () => {
        it("refracts the vector at plane of normal vector", () => {
            const normal = new Vector2(3, 4).normalize();
            const v = new Vector2(1, 2);
            const eta = 5;
            const result = v.refract(normal, eta);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -7.50932, -6.67909 ]);
            expect(new Vector2(-9, -10).refract(new Vector2(-0.784046, 0.620703), -18).toJSON()).toEqual([ 0, 0 ]);
        });
        it("can use source as result", () => {
            const normal = new Vector2(3, 4).normalize();
            const v = new Vector2(1, 2);
            const eta = 5;
            const result = v.refract(normal, eta, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -7.50932, -6.67909 ]);
        });
        it("can use normal vector as result", () => {
            const normal = new Vector2(3, 4).normalize();
            const v = new Vector2(1, 2);
            const eta = 5;
            const result = v.refract(normal, eta, normal);
            expect(result).toBe(normal);
            expect(result.toJSON()).toEqualCloseTo([ -7.50932, -6.67909 ]);
            expect(v.toJSON()).toEqualCloseTo([ 1, 2 ]);
        });
    });

    describe("radians", () => {
        it("converts all vector components from degrees to radians", () => {
            const v = new Vector2(1, 2);
            const result = v.radians();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.0174533, 0.0349066 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(1, 2);
            const result = v.radians(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.0174533, 0.0349066 ]);
        });
    });

    describe("degrees", () => {
        it("converts all vector components from radians to degrees", () => {
            const v = new Vector2(0.0174533, 0.0349066);
            const result = v.degrees();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 2 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.0174533, 0.0349066);
            const result = v.degrees(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 2 ]);
        });
    });

    describe("sin", () => {
        it("converts all vector components to their sine values", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.sin();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.198669, 0.783327 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.sin(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.198669, 0.783327 ]);
        });
    });

    describe("cos", () => {
        it("calculates cosine for all components", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.cos();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.980067, 0.62161 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.cos(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.980067, 0.62161 ]);
        });
    });

    describe("tan", () => {
        it("calculates tangent for all components", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.tan();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.20271, 1.26016 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.tan(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.20271, 1.26016 ]);
        });
    });

    describe("asin", () => {
        it("calculates arc sine for all components", () => {
            const v = new Vector2(0.198669, 0.783327);
            const result = v.asin();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.198669, 0.783327);
            const result = v.asin(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
    });

    describe("acos", () => {
        it("calculates arc cosine for all components", () => {
            const v = new Vector2(0.980067, 0.62161);
            const result = v.acos();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.980067, 0.62161);
            const result = v.acos(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
    });

    describe("atan", () => {
        it("calculates arc tangent for all components", () => {
            const v = new Vector2(0.20271, 1.26016);
            const result = v.atan();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.20271, 1.26016);
            const result = v.atan(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
    });

    describe("atan2", () => {
        it("calculates atan2 for all components with vector as argument", () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            const result = v1.atan2(v2);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 0.321751, 0.463648 ]);
        });
        it("calculates atan2 for all components with number as argument", () => {
            const v = new Vector2(1, 2);
            const result = v.atan2(3);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.321751, 0.588007 ]);
        });
        it("can use source as result", () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            const result = v1.atan2(v2, v1);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 0.321751, 0.463648 ]);
            expect(v2.toJSON()).toEqual([ 3, 4 ]);
        });
        it("can use argument vector as result", () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            const result = v1.atan2(v2, v2);
            expect(result).toBe(v2);
            expect(result.toJSON()).toEqualCloseTo([ 0.321751, 0.463648 ]);
            expect(v1.toJSON()).toEqual([ 1, 2 ]);
        });
        it("can use source as result when using number as argument", () => {
            const v = new Vector2(1, 2);
            const result = v.atan2(3, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.321751, 0.588007 ]);
        });
    });

    describe("sinh", () => {
        it("calculates hyperbolic sine for all components", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.sinh();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.201336, 1.02652 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.sinh(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.201336, 1.02652 ]);
        });
    });

    describe("cosh", () => {
        it("calculates hyperbolic cosine for all components", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.cosh();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1.02007, 1.43309 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.cosh(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1.02007, 1.43309 ]);
        });
    });

    describe("tanh", () => {
        it("calculates hyperbolic tangent for all components", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.tanh();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.197375, 0.716298 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.tanh(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.197375, 0.716298 ]);
        });
    });

    describe("asinh", () => {
        it("calculates hyperbolic arc sine for all components", () => {
            const v = new Vector2(0.201336, 1.02652);
            const result = v.asinh();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.201336, 1.02652);
            const result = v.asinh(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
    });

    describe("acosh", () => {
        it("calculates hyperbolic arc cosine for all components", () => {
            const v = new Vector2(1.02007, 1.43309);
            const result = v.acosh();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(1.02007, 1.43309);
            const result = v.acosh(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
    });

    describe("atanh", () => {
        it("calculates hyperbolic arc tangent for all components", () => {
            const v = new Vector2(0.197375, 0.716298);
            const result = v.atanh();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.197375, 0.716298);
            const result = v.atanh(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.2, 0.9 ]);
        });
    });

    describe("pow", () => {
        it("calculates the base to the exponent power for all components with vector as argument", () => {
            const v1 = new Vector2(2, 3);
            const v2 = new Vector2(3, 2);
            const result = v1.pow(v2);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 8, 9 ]);
        });
        it("calculates the base to the exponent power for all components with number as argument", () => {
            const v = new Vector2(2, 3);
            const result = v.pow(4);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 16, 81 ]);
        });
        it("can use source as result", () => {
            const v1 = new Vector2(2, 3);
            const v2 = new Vector2(3, 2);
            const result = v1.pow(v2, v1);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 8, 9 ]);
            expect(v2.toJSON()).toEqual([ 3, 2 ]);
        });
        it("can use vector argument as result", () => {
            const v1 = new Vector2(2, 3);
            const v2 = new Vector2(3, 2);
            const result = v1.pow(v2, v2);
            expect(result).toBe(v2);
            expect(result.toJSON()).toEqualCloseTo([ 8, 9 ]);
            expect(v1.toJSON()).toEqual([ 2, 3 ]);
        });
        it("can use source as result when using number argument", () => {
            const v = new Vector2(2, 3);
            const result = v.pow(4, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 16, 81 ]);
        });
    });

    describe("exp", () => {
        it("calculates e^x for all components", () => {
            const v = new Vector2(1, 2);
            const result = v.exp();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2.71828, 7.38906 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(1, 2);
            const result = v.exp(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2.71828, 7.38906 ]);
        });
    });

    describe("log", () => {
        it("calculates the natural logarithm for all components", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.log();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1.60944, -0.105361 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.log(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1.60944, -0.105361 ]);
        });
    });

    describe("exp2", () => {
        it("calculates 2^x for all components", () => {
            const v = new Vector2(1, 2);
            const result = v.exp2();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2, 4 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(1, 2);
            const result = v.exp2(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2, 4 ]);
        });
    });

    describe("log2", () => {
        it("calculates the base 2 logarithm for all components", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.log2();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2.32193, -0.152003 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(0.2, 0.9);
            const result = v.log2(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2.32193, -0.152003 ]);
        });
    });

    describe("sqrt", () => {
        it("calculates the square root for all components", () => {
            const v = new Vector2(1, 2);
            const result = v.sqrt();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 1.41421 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(1, 2);
            const result = v.sqrt(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 1.41421 ]);
        });
    });

    describe("inverseSqrt", () => {
        it("calculates the inverse square root for all components", () => {
            const v = new Vector2(1, 2);
            const result = v.inverseSqrt();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 0.707107 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(1, 2);
            const result = v.inverseSqrt(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1, 0.707107 ]);
        });
    });

    describe("abs", () => {
        it("calculates the absolute values for all components", () => {
            const v = new Vector2(-1.5, 2.2);
            const result = v.abs();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1.5, 2.2 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(-1.5, 2.2);
            const result = v.abs(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 1.5, 2.2 ]);
        });
    });

    describe("sign", () => {
        it("calculates the sign for all components", () => {
            const v = new Vector2(-1.5, 2.2);
            const result = v.sign();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, 1 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(-1.5, 2.2);
            const result = v.sign(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, 1 ]);
        });
    });

    describe("floor", () => {
        it("floors all components", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.floor();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2, -2 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.floor(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2, -2 ]);
        });
    });

    describe("ceil", () => {
        it("ceils all components", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.ceil();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, -1 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.ceil(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, -1 ]);
        });
    });

    describe("round", () => {
        it("rounds all components", () => {
            const v = new Vector2(1.5, -1.6);
            const result = v.round();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2, -2 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(1.5, -1.6);
            const result = v.round(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 2, -2 ]);
        });
    });

    describe("roundEven", () => {
        it("rounds all components to even numbers", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.roundEven();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2, -2 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.roundEven(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -2, -2 ]);
        });
    });

    describe("trunc", () => {
        it("truncates all components", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.trunc();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, -1 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.trunc(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -1, -1 ]);
        });
    });

    describe("fract", () => {
        it("replaces all components with their fractional parts", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.fract();
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.5, 0.4 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(-1.5, -1.6);
            const result = v.fract(v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0.5, 0.4 ]);
        });
    });

    describe("mod", () => {
        it("calculates the modulus of all components with vector as argument", () => {
            const v1 = new Vector2(167, 151);
            const v2 = new Vector2(145, 133);
            const result = v1.mod(v2);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 22, 18 ]);
        });
        it("calculates the modulus of all components with number as argument", () => {
            const v = new Vector2(167, 151);
            const result = v.mod(145);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 22, 6 ]);
        });
        it("can use source as result", () => {
            const v1 = new Vector2(167, 151);
            const v2 = new Vector2(145, 133);
            const result = v1.mod(v2, v1);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 22, 18 ]);
            expect(v2.toJSON()).toEqual([ 145, 133 ]);
        });
        it("can use vector argument as result", () => {
            const v1 = new Vector2(167, 151);
            const v2 = new Vector2(145, 133);
            const result = v1.mod(v2, v2);
            expect(result).toBe(v2);
            expect(result.toJSON()).toEqualCloseTo([ 22, 18 ]);
            expect(v1.toJSON()).toEqual([ 167, 151 ]);
        });
        it("can use source as result when using number argument", () => {
            const v = new Vector2(167, 151);
            const result = v.mod(145, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 22, 6 ]);
        });
    });

    describe("modf", () => {
        it("returns separate integer and fractional parts", () => {
            const v = new Vector2(-9.6441, 41.423);
            const i = new Vector2();
            const result = v.modf(i);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -0.6441, 0.423 ]);
            expect(i.toJSON()).toEqual([ -9, 41 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(-9.6441, 41.423);
            const i = new Vector2();
            const result = v.modf(i, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ -0.6441, 0.423 ]);
            expect(i.toJSON()).toEqual([ -9, 41 ]);
        });
    });

    describe("min", () => {
        it("returns the minimum components from two vectors", () => {
            const v1 = new Vector2(10, 20);
            const v2 = new Vector2(5, 45);
            const result = v1.min(v2);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 5, 20 ]);
        });
        it("returns the minimum components from vector and number argument", () => {
            const v = new Vector2(10, 20);
            const result = v.min(15);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 10, 15 ]);
        });
        it("can use source as result", () => {
            const v1 = new Vector2(10, 20);
            const v2 = new Vector2(5, 45);
            const result = v1.min(v2, v1);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 5, 20 ]);
            expect(v2.toJSON()).toEqual([ 5, 45 ]);
        });
    });

    describe("max", () => {
        it("returns the maximum components from two vectors", () => {
            const v1 = new Vector2(10, 20);
            const v2 = new Vector2(5, 45);
            const result = v1.max(v2);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 10, 45 ]);
        });
        it("returns the maximum components from vector and number argument", () => {
            const v = new Vector2(10, 20);
            const result = v.max(15);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 20 ]);
        });
        it("can use source as result", () => {
            const v1 = new Vector2(10, 20);
            const v2 = new Vector2(5, 45);
            const result = v1.max(v2, v1);
            expect(result).toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 10, 45 ]);
            expect(v2.toJSON()).toEqual([ 5, 45 ]);
        });
    });

    describe("clamp", () => {
        it("clamps the vector components by min and max vector", () => {
            const v = new Vector2(10, 20);
            const min = new Vector2(15, 10);
            const max = new Vector2(30, 18);
            const result = v.clamp(min, max);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 18 ]);
        });
        it("clamps the vector components by min and max number", () => {
            const v = new Vector2(10, 40);
            const min = 11;
            const max = 39;
            const result = v.clamp(min, max);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 11, 39 ]);
        });
        it("clamps the vector components by min vector and max number", () => {
            const v = new Vector2(10, 20);
            const min = new Vector2(15, 10);
            const max = 19;
            const result = v.clamp(min, max);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 19 ]);
        });
        it("clamps the vector components by min number and max vector", () => {
            const v = new Vector2(10, 20);
            const min = 15;
            const max = new Vector2(16, 17);
            const result = v.clamp(min, max);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 15, 17 ]);
        });
    });

    describe("mix", () => {
        it("mixes the vector component with another vector by a blend vector", () => {
            const v1 = new Vector2(10, 20);
            const v2 = new Vector2(15, 30);
            const blend = new Vector2(0.5, 0.8);
            const result = v1.mix(v2, blend);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 12.5, 28 ]);
        });
        it("mixes the vector component with a target number and a blend vector", () => {
            const v = new Vector2(1, 10);
            const n = 20;
            const blend = new Vector2(0.25, 0.75);
            const result = v.mix(n, blend);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 5.75, 17.5 ]);
        });
        it("mixes the vector component with a vector using a numeric blend value", () => {
            const v1 = new Vector2(-10, -20);
            const v2 = new Vector2(10, 20);
            const blend = 0.75;
            const result = v1.mix(v2, blend);
            expect(result).not.toBe(v1);
            expect(result.toJSON()).toEqualCloseTo([ 5, 10 ]);
        });
        it("mixes the vector component with a target number and a numeric blend value", () => {
            const v = new Vector2(-10, -20);
            const n = 10;
            const blend = 0.5;
            const result = v.mix(n, blend);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqualCloseTo([ 0, -5 ]);
        });
    });

    describe("step", () => {
        it("returns 0 if lower or 1 if higher than edge vector for each component", () => {
            const v = new Vector2(2, 3);
            const edge = new Vector2(3, 2);
            const result = v.step(edge);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1 ]);
        });
        it("returns 0 if lower or 1 if higher than edge value for each component", () => {
            const v = new Vector2(3, 2);
            const result = v.step(2.5);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 1, 0 ]);
            expect(new Vector2(2, 3).step(2.5).toJSON()).toEqual([ 0, 1 ]);
        });
    });

    describe("smoothStep", () => {
        it("returns 0 if lower than 1st edge vector or 1 if higher than 2nd edge vector for each component", () => {
            const v = new Vector2(2, 3);
            const edge1 = new Vector2(3, 1);
            const edge2 = new Vector2(5, 2);
            const result = v.smoothStep(edge1, edge2);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1 ]);
        });
        it("returns 0 if lower than 1st edge value or 1 if higher than 2nd edge vector for each component", () => {
            const v = new Vector2(2, 3);
            const edge1 = 2.5;
            const edge2 = new Vector2(5, 2.6);
            const result = v.smoothStep(edge1, edge2);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1 ]);
            expect(new Vector2(6, 2.4).smoothStep(edge1, edge2).toJSON()).toEqual([ 1, 0 ]);
        });
        it("returns 0 if lower than 1st edge vector or 1 if higher than 2nd edge value for each component", () => {
            const v = new Vector2(2, 5);
            const edge1 = new Vector2(3, 1);
            const edge2 = 4;
            const result = v.smoothStep(edge1, edge2);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1 ]);
            expect(new Vector2(6, 0.5).smoothStep(edge1, edge2).toJSON()).toEqual([ 1, 0 ]);
        });
        it("returns 0 if lower than 1st edge value or 1 if higher than 2nd edge value for each component", () => {
            const v = new Vector2(2, 5);
            const edge1 = 3;
            const edge2 = 4;
            const result = v.smoothStep(edge1, edge2);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 0, 1 ]);
            expect(new Vector2(5, 2).smoothStep(edge1, edge2).toJSON()).toEqual([ 1, 0 ]);
        });
        it("returns components between 0 and 1 if between 1st and 2nd edge vector", () => {
            expect(new Vector2(1, 2).smoothStep(0, 4).toJSON()).toEqualCloseTo([ 0.15625, 0.5 ]);
            expect(new Vector2(0, 1).smoothStep(-2, 2).toJSON()).toEqualCloseTo([ 0.5, 0.84365 ]);
        });
    });

    describe("mul", () => {
        it("multiplies the vector with a 2x2 matrix", () => {
            const v = new Vector2(3, 4);
            const m = new Matrix2(5, 6, 7, 8);
            const result = v.mul(m);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 43, 50 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(3, 4);
            const m = new Matrix2(5, 6, 7, 8);
            const result = v.mul(m, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 43, 50 ]);
        });
    });

    describe("transposeMul", () => {
        it("multiplies the vector with the transpose of the given 2x2 matrix", () => {
            const v = new Vector2(3, 4);
            const m = new Matrix2(5, 6, 7, 8);
            const result = v.transposeMul(m);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 39, 53 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(3, 4);
            const m = new Matrix2(5, 6, 7, 8);
            const result = v.transposeMul(m, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 39, 53 ]);
        });
    });

    describe("div", () => {
        it("multiplies the vector with the inverse of the given 2x2 matrix", () => {
            const v = new Vector2(43, 50);
            const m = new Matrix2(5, 6, 7, 8);
            const result = v.div(m);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ 3, 4 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(43, 50);
            const m = new Matrix2(5, 6, 7, 8);
            const result = v.div(m, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ 3, 4 ]);
        });
    });

    describe("transposeDiv", () => {
        it("multiplies the vector with the transposed inverse of the given 2x2 matrix", () => {
            const v = new Vector2(43, 50);
            const m = new Matrix2(5, 6, 7, 8);
            const result = v.transposeDiv(m);
            expect(result).not.toBe(v);
            expect(result.toJSON()).toEqual([ -22, 25.5 ]);
        });
        it("can use source as result", () => {
            const v = new Vector2(43, 50);
            const m = new Matrix2(5, 6, 7, 8);
            const result = v.transposeDiv(m, v);
            expect(result).toBe(v);
            expect(result.toJSON()).toEqual([ -22, 25.5 ]);
        });
    });
});
