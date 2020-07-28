import { Equatable, isEqual } from "../lang/Equatable";
import { Serializable } from "../lang/Serializable";
import { cacheResult } from "../util/cache";
import { Point } from "./Point";
import { PointLike } from "./PointLike";
import { RectLike } from "./RectLike";
import { Size, SizeJSON } from "./Size";
import { SizeLike } from "./SizeLike";

export interface RectJSON extends SizeJSON {
    left: number;
    top: number;
}

export class Rect implements RectLike, SizeLike, Serializable<RectJSON>, Equatable {
    public constructor(
        private readonly left: number,
        private readonly top: number,
        private readonly width: number,
        private readonly height: number
    ) {}

    public static fromRect(rect: RectLike): Rect {
        return new Rect(rect.getLeft(), rect.getTop(), rect.getWidth(), rect.getHeight());
    }

    public static fromPoints(topLeft: PointLike, bottomRight: PointLike): Rect {
        return new Rect(topLeft.getX(), topLeft.getY(), bottomRight.getX() - topLeft.getX(), bottomRight.getY()
            - topLeft.getY());
    }

    public static fromSize(size: Size, topLeft: Point = Point.NULL): Rect {
        return new Rect(topLeft.getX(), topLeft.getY(), size.getWidth(), size.getHeight());
    }

    /** @inheritDoc */
    public toJSON(): RectJSON {
        return {
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height
        };
    }

    public static fromJSON(json: RectJSON): Rect {
        return new Rect(json.left, json.top, json.width, json.height);
    }

    /** @inheritDoc */
    public equals(other: unknown): boolean {
        return isEqual(this, other, other => this.left === other.left && this.top === other.top
            && this.width === other.width && this.height === other.height
        );
    }

    /** @inheritDoc */
    public getLeft(): number {
        return this.left;
    }

    /** @inheritDoc */
    public getTop(): number {
        return this.top;
    }

    /** @inheritDoc */
    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getBottom(): number {
        return this.top + this.height;
    }

    public getRight(): number {
        return this.left + this.width;
    }

    @cacheResult
    public getTopLeft(): Point {
        return new Point(this.left, this.top);
    }

    @cacheResult
    public getTopRight(): Point {
        return new Point(this.left + this.width, this.top);
    }

    @cacheResult
    public getBottomRight(): Point {
        return new Point(this.left + this.width, this.top + this.height);
    }

    @cacheResult
    public getBottomLeft(): Point {
        return new Point(this.left, this.top + this.height);
    }

    @cacheResult
    public getCenter(): Point {
        return new Point(this.left + this.width / 2, this.top + this.height / 2);
    }

    public getCenterX(): number {
        return this.left + this.width / 2;
    }

    public getCenterY(): number {
        return this.top + this.height / 2;
    }

    @cacheResult
    public getSize(): Size {
        return new Size(this.width, this.height);
    }

    public isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    public isNull(): boolean {
        return this.width === 0 && this.height === 0;
    }

    public isValid(): boolean {
        return this.width >= 0 && this.height >= 0;
    }

    public contains(x: number, y: number, width: number = 0, height: number = 0): boolean {
        const left = this.left;
        const top = this.top;
        const right = this.getRight();
        const bottom = this.getBottom();
        return x >= left && x + width <= right && y >= top && y + height <= bottom;
    }

    public containsPoint(point: PointLike): boolean {
        return this.contains(point.getX(), point.getY());
    }

    public containsRect(rect: RectLike): boolean {
        return this.contains(rect.getLeft(), rect.getTop(), rect.getWidth(), rect.getHeight());
    }

    public transpose(): Rect {
        return new Rect(this.left, this.top, this.height, this.width);
    }

    /* TODO
    moveBy(left, top);
    moveByPoint(point);

    moveTo(x, y, anchor);
    moveToPoint(point, anchor);

    resizeTo(width, height, anchor)
    resizeBy(width, height, anchor)

    setSize(size, anchor);
    addSize(size, anchor);
    subSize(size, anchor);

    addInsets(size);
    subInsets(size);
    */
}
