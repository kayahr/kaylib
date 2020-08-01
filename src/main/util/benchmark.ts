/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { permute } from "./array";
import { formatNumber } from "./string";
import { sleep } from "./time";

export interface BenchmarkCandidate {
    /** The benchmark candidate name. */
    name: string;

    /**
     * The function implementing the benchmark candidate. This method is executed as fast as possible during the
     * benchmark duration to measure how many operations per seconds it can execute. The function is allowed to
     * return a value which is simply ignored.
     */
    func: () => unknown;
}

export interface BenchmarkOptions {
    /** The test duration in seconds. Defaults to 10 seconds. */
    duration?: number;

    /** Set to true to output benchmark results to the console. Defaults to false. */
    print?: boolean;
}

export interface BenchmarkResult {
    /** The benchmark candidate name. */
    name: string;

    /** The number of operations per second. */
    opsPerSecond: number;

    /** The speed in percent relative to the fastest candidate. */
    percent: number;
}

/** Convert benchmark results to a text table string ready to be printed to the console. */
function resultsToString(this: BenchmarkResult[]): string {
    const sorted = this.slice().sort((a, b) => b.percent - a.percent);
    const names = sorted.map(result => result.name);
    const ops = sorted.map(result => `${formatNumber(Math.round(result.opsPerSecond),
        { useGrouping: true })}`);
    const percents = sorted.map(result => `${result.percent} %`);
    const namesLen = names.reduce((len, name) => Math.max(len, name.length), 9);
    const opsLen = ops.reduce((len, opsPerSecond) => Math.max(len, opsPerSecond.length), 10);
    const percentLen = percents.reduce((len, percent) => Math.max(len, percent.length), 8);
    let output = `╔═${"═".repeat(namesLen)}═╤═${"═".repeat(opsLen)}═╤═${"═".repeat(percentLen)}═╗\n`;
    output += `║ ${"Candidate".padEnd(namesLen)} │ ${"Ops/second".padStart(opsLen)} │ `
        + `${"Relation".padStart(percentLen)} ║\n`;
    output += `╟─${"─".repeat(namesLen)}─┼─${"─".repeat(opsLen)}─┼─${"─".repeat(percentLen)}─╢\n`;
    for (let i = 0; i < sorted.length; i++) {
        output += `║ ${names[i].padEnd(namesLen)} │ ${ops[i].padStart(opsLen)} │ `
            + `${percents[i].padStart(percentLen)} ║\n`;
    }
    output += `╚═${"═".repeat(namesLen)}═╧═${"═".repeat(opsLen)}═╧═${"═".repeat(percentLen)}═╝\n`;
    return output;
}

/**
 * Continuously benchmarks the given candidates until the returned cancel function is called.
 *
 * @param candidates - The candidates to benchmark.
 * @param onResults  - Callback called with new benchmark results.
 * @return The cancel function which must be called to stop benchmarking.
 */
export function benchmark(candidates: BenchmarkCandidate[], onResults: (results: BenchmarkResult[]) => void):
        () => void {
    // Dummy variable to assign the result from each candidate call to. This prevents the runtime to optimize
    // a call when its return value would not be used.
    let dummy: unknown = null;

    // Initialize the benchmark results
    const results: BenchmarkResult[] = candidates.map(v => ({
        name: v.name,
        opsPerSecond: 10,
        percent: 0
    }));

    // Determine the permuted candidate indices. A permutation of all candidates is used to ensure that the
    // candidates are benchmarked in any possible order.
    const permutations = permute(candidates.map((v, i) => i));

    let cancel = false;

    // Iterate over all benchmark candidate permutations
    setTimeout(async () => {
        while (true) {
            for (const indices of permutations) {
                // Iterate over the candidate indexes for the current permutation
                for (const index of indices) {
                    // Stop benchmarking when cancel flag is set
                    if (cancel) {
                        return;
                    }

                    const candidate = candidates[index];
                    const candidateResults = results[index];
                    const func = candidate.func;
                    const start = Date.now();
                    let time = 0;
                    let ops = 0;
                    do {
                        for (let i = 0; i < candidateResults.opsPerSecond / 10; ++i) {
                            dummy = func();
                            ++ops;
                        }
                        time = Date.now() - start;
                    } while (time < 10);
                    candidateResults.opsPerSecond = Math.round((ops * 100 / time) * 10);

                    // Use the dummy value in some way to prevent compiler warnings and maybe to prevent the runtime to
                    // optimize it (and the benchmark candidate calls) away.
                    if (dummy != null) {
                        dummy = null;
                    }

                    await sleep();
                }

                // Prepare more result statistics and pass it to callback
                const fastest = results.reduce((fastest, result) => Math.max(fastest, result.opsPerSecond), 0);
                for (const result of results) {
                    result.percent = Math.round(100 * result.opsPerSecond / fastest);
                }
                onResults(Object.assign(JSON.parse(JSON.stringify(results)), { toString: resultsToString }));
            }
        }
    }, 0);

    // Return the cancel function
    return () => { cancel = true; };
}
