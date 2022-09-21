//@ts-check
import { CANVAS_WIDTH } from "../constants.js";
import { Obstacle } from "./obstacle.js";

export const TOP_OBSTACLE_WIDTH = 2;
export const MAX_TOP_OBSTACLE_HEIGHT = 200;
export const MIN_TOP_OBSTACLE_HEIGHT = 50;

export class TopObstacle extends Obstacle {
	/**
	 * @param {Number} h
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(h, ctx) {
		super(CANVAS_WIDTH, 0, h, TOP_OBSTACLE_WIDTH, "blue", ctx);
	}
}
