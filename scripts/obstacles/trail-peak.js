//@ts-check
import { CANVAS_WIDTH } from "../constants.js";
import { Collidable, collidableType } from "./collidable.js";

export const PEAK_WIDTH = 5;
export const MAX_PEAK_HEIGHT = 200;
export const MIN_PEAK_HEIGHT = 50;

export class TrailPeak extends Collidable {
	/**
	 * @param {Number} h
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(h, ctx) {
		super(collidableType.Peak, CANVAS_WIDTH, 0, h, PEAK_WIDTH, "blue", ctx);
		this.limitsPlayerHeight = true;
		this.staminaImpact = -10;
	}
}
