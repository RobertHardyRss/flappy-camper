//@ts-check
import {
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	KARMA_OFF_TRAIL,
	STAMINA_OFF_TRAIL,
} from "../constants.js";
import { Collidable, collidableType } from "./collidable.js";

export const FOREST_WIDTH_MIN = 100;
const FOREST_WIDTH_MAX = CANVAS_WIDTH / 2;
export const MAX_FOREST_HEIGHT = 340;
export const MIN_FOREST_HEIGHT = 50;

export class Forest extends Collidable {
	/**
	 * @param {Number} h
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(h, ctx) {
		super(
			collidableType.Forest,
			CANVAS_WIDTH,
			CANVAS_HEIGHT - h,
			h,
			Math.floor(Math.random() * FOREST_WIDTH_MAX + FOREST_WIDTH_MIN),
			"green",
			ctx
		);
		this.karmaImpact = KARMA_OFF_TRAIL;
		this.staminaImpact = STAMINA_OFF_TRAIL;
	}
}
