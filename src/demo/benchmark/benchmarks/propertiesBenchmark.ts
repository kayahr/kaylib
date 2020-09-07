/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { BenchmarkCandidate } from "../../../main/util/benchmark";

const symbolProp = Symbol("symbolProp");

const weakMap = new WeakMap<Test, number>();

class Test {
    private [symbolProp]: number = 0;
    #hashProp: number = 0;
    private _underlineProp: number = 0;
    private javaStyleProp: number = 0;

    public constructor(v: number) {
        this[symbolProp] = v;
        this.#hashProp = v;
        this._underlineProp = v;
        this.javaStyleProp = v;
    }

    public get symbolProp(): number {
        return this[symbolProp];
    }

    public set symbolProp(v: number) {
        this[symbolProp] = v;
    }

    public get hashProp(): number {
        return this.#hashProp;
    }

    public set hashProp(v: number) {
        this.#hashProp = v;
    }

    public get underlineProp(): number {
        return this._underlineProp;
    }

    public set underlineProp(v: number) {
        this._underlineProp = v;
    }

    public get weakMapProp(): number {
        return weakMap.get(this) as number;
    }

    public set weakMapProp(v: number) {
        weakMap.set(this, v);
    }

    public getJavaStyleProp(): number {
        return this.javaStyleProp;
    }

    public setJavaStyleProp(v: number): void {
        this.javaStyleProp = v;
    }
}

const objects: Test[] = [];
for (let i = 0; i < 100000; i++) {
    objects.push(new Test(i));
}
const o = objects[objects.length >> 1];

export const propertiesBenchmark: BenchmarkCandidate[] = [
    {
        "name": "symbolProp",
        "func": (): number => {
            o.symbolProp = o.symbolProp + 1;
            return o.symbolProp;
        }
    },
    {
        "name": "hashProp",
        "func": (): number => {
            o.hashProp = o.hashProp + 1;
            return o.hashProp;
        }
    },
    {
        "name": "underlineProp",
        "func": (): number => {
            o.underlineProp = o.underlineProp + 1;
            return o.underlineProp;
        }
    },
    {
        "name": "weakMapProp",
        "func": (): number => {
            o.weakMapProp = o.weakMapProp + 1;
            return o.weakMapProp;
        }
    },
    {
        "name": "javaStyleProp",
        "func": (): number => {
            o.setJavaStyleProp(o.getJavaStyleProp() + 1);
            return o.getJavaStyleProp();
        }
    }
];
