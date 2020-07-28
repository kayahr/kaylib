/*
 * Copyright (C) 2020 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { IllegalArgumentException } from "../util/exception";
import { toLowerDashCase, toUpperSnakeCase } from "../util/string";

export enum Direction {
    CENTER = 0,
    NORTH = 1,
    EAST = 2,
    SOUTH = 4,
    WEST = 8,
    NORTH_EAST = NORTH | EAST,
    SOUTH_EAST = SOUTH | EAST,
    SOUTH_WEST = SOUTH | WEST,
    NORTH_WEST = NORTH | WEST
}

export namespace Direction {
    /**
     * Serializes the given direction to a string.
     *
     * @param direction - The direction to serialize.
     * @return The serialized direction.
     */
    export function toJSON(direction: Direction): string {
        return toLowerDashCase(Direction[direction]);
    }

    /**
     * Deserializes a direction string into a direction.
     *
     * @param json - The serialized direction.
     * @return The deserialized direction.
     */
    export function fromJSON(json: string): Direction {
        const direction = Direction[toUpperSnakeCase(json) as keyof typeof Direction] as Direction;
        if (direction == null) {
            throw new IllegalArgumentException("Invalid direction JSON: " + json);
        }
        return direction;
    }

    /**
     * Checks if direction is a corner (North-east, north-west, south-east or south-west).
     *
     * @param direction - The direction to check.
     * @return True if direction is a corner, false if not.
     */
    export function isCorner(direction: Direction): boolean {
        return direction === Direction.NORTH_EAST
            || direction === Direction.SOUTH_EAST
            || direction === Direction.SOUTH_WEST
            || direction === Direction.NORTH_WEST;
    }

    /**
     * Checks if direction is an edge (North, south, west or east).
     *
     * @param direction - The direction to check.
     * @return True if direction is an edge, false if not.
     */
    export function isEdge(direction: Direction): boolean {
        return direction === Direction.NORTH
            || direction === Direction.EAST
            || direction === Direction.SOUTH
            || direction === Direction.WEST;
    }

    /**
     * Converts direction into an angle starting at north and going in 45 degrees step in clock-wise direction.
     *
     * @param direction - The direction.
     * @param unit      - Optional unit to multiply the direction with. Defaults to 1, so 1 means 45 degrees, 2
     *                    means 90 degrees and so on. Specify 45 to get a real angle in degrees, specify Math.PI / 4
     *                    to get a real angle in radians.
     * @return The direction angle.
     */
    export function toAngle(direction: Direction, unit: number = 1): number {
        switch (direction) {
            case Direction.NORTH:
                return 0;
            case Direction.NORTH_EAST:
                return 1 * unit;
            case Direction.EAST:
                return 2 * unit;
            case Direction.SOUTH_EAST:
                return 3 * unit;
            case Direction.SOUTH:
                return 4 * unit;
            case Direction.SOUTH_WEST:
                return 5 * unit;
            case Direction.WEST:
                return 6 * unit;
            case Direction.NORTH_WEST:
                return 7 * unit;
            default:
                throw new IllegalArgumentException("Direction has no angle: " + (Direction[direction] ?? direction));
        }
    }

    /**
     * Converts angle into direction.
     *
     * @param angle - The angle
     * @param unit  - Optional unit of the angle. Defaults to 1, so 1 means 45 degrees, 2
     *                means 90 degrees and so on. Specify 45 if angle is a real angle in degrees, specify Math.PI / 4
     *                if it is a real angle in radians.
     * @return The angle direction.
     */
    export function fromAngle(angle: number, unit: number = 1): Direction {
        switch (((Math.round(angle / unit) % 8) + 8) % 8) {
            case 1:
                return Direction.NORTH_EAST;
            case 2:
                return Direction.EAST;
            case 3:
                return Direction.SOUTH_EAST;
            case 4:
                return Direction.SOUTH;
            case 5:
                return Direction.SOUTH_WEST;
            case 6:
                return Direction.WEST;
            case 7:
                return Direction.NORTH_WEST;
            default:
                return Direction.NORTH;
        }
    }
}
