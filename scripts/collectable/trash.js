//@ts-check
import { CANVAS_WIDTH, KARMA_TRASH_BOOST } from "../constants.js";
import { Collidable, collidableType } from "../obstacles/collidable.js";

const TRASH_SIZE = 32;

export class Trash extends Collidable {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		super(
			collidableType.Trash,
			CANVAS_WIDTH + TRASH_SIZE, // set x to just off the right of the screen
			0, // y will be changed based on where we can place the trash
			TRASH_SIZE,
			TRASH_SIZE,
			"maroon",
			ctx
		);
		this.isCollectable = true;
		this.karmaImpact = KARMA_TRASH_BOOST;
	}
}
