import { Point } from "../../../main/geom/Point";
import { BenchmarkCandidate } from "../../../main/util/benchmark";
import { cacheResult } from "../../../main/util/cache";

class Test {
    private cachedPoint: Point | null = null;

    public constructor(public readonly x: number, public readonly y: number) {}

    public uncached(): Point {
        return new Point(this.x, this.y);
    }

    @cacheResult
    public cacheByDecorator(): Point {
        return new Point(this.x, this.y);
    }

    public cacheManually(): Point {
        return this.cachedPoint ?? (this.cachedPoint = new Point(this.x, this.y));
    }
}

const test = new Test(1, 2);

export const resultCacheBenchmark: BenchmarkCandidate[] = [
    {
        "name": "resultCache decorator",
        "func": (): Point => test.cacheByDecorator()
    },
    {
        "name": "manually cached",
        "func": (): Point => test.cacheManually()
    },
    {
        "name": "uncached",
        "func": (): Point => test.uncached()
    }
];
