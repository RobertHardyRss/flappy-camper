//@ts-check
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants.js";
import { Obstacle } from "./obstacle.js";

export const BOTTOM_OBSTACLE_WIDTH_MIN = 100;
export const BOTTOM_OBSTACLE_WIDTH_MAX = CANVAS_WIDTH / 2;
export const MAX_BOTTOM_OBSTACLE_HEIGHT = 340;
export const MIN_BOTTOM_OBSTACLE_HEIGHT = 50;

export class BottomObstacle extends Obstacle {
	/**
	 * @param {Number} h
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(h, ctx) {
		super(
			CANVAS_WIDTH,
			CANVAS_HEIGHT - h,
			h,
			Math.floor(
				Math.random() * BOTTOM_OBSTACLE_WIDTH_MAX +
					BOTTOM_OBSTACLE_WIDTH_MIN
			),
			"green",
			ctx
		);
	}
}
