/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { getRenderingContext } from "../../main/graphics/canvas";
import { Polygon2 } from "../../main/graphics/Polygon2";
import { Vector2 } from "../../main/graphics/Vector2";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = getRenderingContext(canvas, "2d");

const polygon = new Polygon2(
    new Vector2(50, 60),
    new Vector2(100, 80),
    new Vector2(450, 90),
    new Vector2(200, 240),
    new Vector2(480, 480),
    new Vector2(200, 460),
    new Vector2(50, 200)
);

function draw(): void {
    ctx.beginPath();
    polygon.draw(ctx);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#ccc";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    polygon.drawNormals(ctx, 10);
    ctx.strokeStyle = "blue";
    ctx.stroke();

    ctx.beginPath();
    polygon.drawVertexNormals(ctx, 10);
    ctx.strokeStyle = "green";
    ctx.stroke();
}

draw();
