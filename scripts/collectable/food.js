//@ts-check
import { CANVAS_WIDTH, STAMINA_FOOD_BOOST } from "../constants.js";
import { Collidable, collidableType } from "../obstacles/collidable.js";

const FOOD_SIZE = 32;

export class Food extends Collidable {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		super(
			collidableType.Food,
			CANVAS_WIDTH + FOOD_SIZE, // set x to just off the right of the screen
			0, // y will be changed based on where we can place the trash
			FOOD_SIZE,
			FOOD_SIZE,
			"lime",
			ctx
		);
		this.isCollectable = true;
		this.staminaImpact = STAMINA_FOOD_BOOST;
	}
}
