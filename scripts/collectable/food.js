//@ts-check
import { CANVAS_WIDTH, STAMINA_FOOD_BOOST } from "../constants.js";
import { Collidable, collidableType } from "../obstacles/collidable.js";

const FOOD_SIZE = 32;
let foodImages;
await fetch("images/food.json")
	.then((response) => response.json())
	.then((json) => {
		foodImages = json;
	});

console.log(foodImages);

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

		this.randomImage =
			foodImages.frames[
				Math.floor(Math.random() * foodImages.frames.length)
			];

		/** @type {HTMLImageElement} */ //@ts-ignore
		this.image = document.getElementById("food");

		this.scaledWidth = FOOD_SIZE;
		this.scaledHeight = FOOD_SIZE;

		if (this.randomImage.frame.w > this.randomImage.frame.h) {
			this.scaledHeight =
				(this.randomImage.frame.h / this.randomImage.frame.w) *
				FOOD_SIZE;
		} else {
			this.scaledWidth =
				(this.randomImage.frame.w / this.randomImage.frame.h) *
				FOOD_SIZE;
		}

		this.h = this.scaledHeight;
		this.w = this.scaledWidth;
	}

	draw() {
		this.ctx.drawImage(
			this.image, // the image we want to draw
			this.randomImage.frame.x, // x coord of where to start our clip
			this.randomImage.frame.y, // y coord of where to start our clip
			this.randomImage.frame.w, // x coord of where to end our clip
			this.randomImage.frame.h, // y coord of where to end our clip
			this.x, // this the x coord of where to place the image
			this.y, // this the y coord of where to place the image
			this.scaledWidth, // the width of the image
			this.scaledHeight // the height of the image
		);
	}
}
