/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { benchmark, BenchmarkCandidate, BenchmarkResult } from "../../main/util/benchmark";
import { formatNumber } from "../../main/util/string";
import * as benchmarks from "./benchmarks";

const buttons = document.querySelector("#benchmarks") as HTMLDivElement;
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const width = canvas.width;
const height = canvas.height;
const padding = 50;
const arrowSize = 10;
const graphWidth = width - padding * 2;
const graphHeight = height - padding * 2;
const verticalSteps = 11;
const verticalStepSize = Math.round(graphHeight / verticalSteps);

const colors = [ "green", "blue", "brown", "cyan", "magenta", "red", "gray" ];

const maxResults = 10;
let resultsHistory: BenchmarkResult[][] = [];

function drawGraph(): void {
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";

    // Set graph origin
    ctx.translate(padding, height - padding);

    // Draw vertical graph arrow
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -graphHeight);
    ctx.lineTo(-arrowSize / 2, -graphHeight + arrowSize);
    ctx.moveTo(0, -graphHeight);
    ctx.lineTo(arrowSize / 2, -graphHeight + arrowSize);
    ctx.stroke();

    // Draw horizontal graph arrow
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(graphWidth, 0);
    ctx.lineTo(graphWidth - arrowSize, -arrowSize / 2);
    ctx.moveTo(graphWidth, 0);
    ctx.lineTo(graphWidth - arrowSize, arrowSize / 2);
    ctx.stroke();

    // Draw vertical helper lines
    ctx.beginPath();
    for (let y = 1; y < verticalSteps; y++) {
        ctx.moveTo(0, -y * verticalStepSize);
        ctx.lineTo(graphWidth, -y * verticalStepSize);
    }
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.stroke();

    // Draw line labels
    let labelWidth = 0;
    for (let y = 1; y < verticalSteps; y++) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        const text = `${y * 10} %`;
        const width = ctx.measureText(text).width;
        ctx.fillText(text, graphWidth - width, -y * verticalStepSize - 3);
        labelWidth = Math.max(labelWidth, width);
    }

    ctx.font = "14px sans-serif";

    // Draw result labels
    if (resultsHistory.length > 1) {
        const results = resultsHistory[0];
        const textWidth = results.reduce((textWidth, result) => textWidth + ctx.measureText(result.name).width + 40, 0);
        let x = (width - textWidth) / 2;
        results.forEach((result, index) => {
            ctx.fillStyle = colors[index];
            ctx.fillText(result.name, x + 20, 20);
            x += ctx.measureText(result.name).width + 20;
        });
        const maxOpsPerSecond = Math.max(...results.map(result => result.opsPerSecond));
        const maxOpsPerSecondString = formatNumber(maxOpsPerSecond, { useGrouping: true }) + " ops/second";
        const maxOpsWidth = ctx.measureText(maxOpsPerSecondString).width;
        ctx.fillStyle = "black";
        ctx.fillText(maxOpsPerSecondString, graphWidth - maxOpsWidth, -graphHeight);
    }

    const remainingGraphWidth = graphWidth - labelWidth - 10;
    const maxValue = Math.max(...resultsHistory.flat().flatMap((result: BenchmarkResult) => result.opsPerSecond));
    const lastResult = Math.min(resultsHistory.length, maxResults) - 1;
    for (let resultsIndex = 0; resultsIndex <= lastResult; resultsIndex++) {
        const currentResults = resultsHistory[resultsIndex];
        currentResults.forEach((result, resultIndex) => {
            const percent = 100 * result.opsPerSecond / maxValue;
            ctx.beginPath();
            const x = remainingGraphWidth - resultsIndex * (remainingGraphWidth / (maxResults - 1));
            const y = -verticalStepSize * (verticalSteps - 1) * percent / 100;
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = colors[resultIndex];
            ctx.fill();
            if (resultsIndex < lastResult) {
                const previousPercent = 100 * resultsHistory[resultsIndex + 1][resultIndex].opsPerSecond / maxValue;
                ctx.beginPath();
                const previousX = remainingGraphWidth - (resultsIndex + 1) * (remainingGraphWidth / (maxResults - 1));
                const previousY = -verticalStepSize * (verticalSteps - 1) * previousPercent / 100;
                ctx.moveTo(previousX, previousY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = colors[resultIndex];
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }

    ctx.restore();
}

drawGraph();

for (const benchmarkName of Object.keys(benchmarks)) {
    const candidates = (benchmarks as unknown as Record<string, BenchmarkCandidate[]>)[benchmarkName];
    const button = document.createElement("button");
    button.onclick = () => {
        start(candidates);
    };
    button.appendChild(document.createTextNode(benchmarkName.replace("Benchmark", "")));
    buttons.appendChild(button);
}

let stop: (() => void) | null = null;

function start(candidates: BenchmarkCandidate[]): void {
    if (stop != null) {
        stop();
        stop = null;
    }
    resultsHistory = [];
    stop = benchmark(candidates, results => {
        if (resultsHistory.length > maxResults) {
            resultsHistory.pop();
        }
        resultsHistory.unshift(results);
        drawGraph();
    });
}

(document.querySelector("#stop") as HTMLButtonElement).onclick = () => { if (stop != null) { stop(); } };
