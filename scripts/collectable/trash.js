//@ts-check
import { CANVAS_WIDTH, KARMA_TRASH_BOOST } from "../constants.js";
import { Collidable, collidableType } from "../obstacles/collidable.js";
import { TrashDust } from "../particles/trash-dust.js";

const TRASH_SIZE = 64;
let trashImages;
await fetch("../../images/trash.json")
	.then((response) => response.json())
	.then((json) => {
		trashImages = json;
	});

console.log(trashImages);

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
		this.randomImage =
			trashImages.frames[
				Math.floor(Math.random() * trashImages.frames.length)
			];

		/** @type {HTMLImageElement} */ //@ts-ignore
		this.image = document.getElementById("trash");

		this.scaledWidth = TRASH_SIZE;
		this.scaledHeight = TRASH_SIZE;

		if (this.randomImage.frame.w > this.randomImage.frame.h) {
			this.scaledHeight =
				(this.randomImage.frame.h / this.randomImage.frame.w) *
				TRASH_SIZE;
		} else {
			this.scaledWidth =
				(this.randomImage.frame.w / this.randomImage.frame.h) *
				TRASH_SIZE;
		}

		this.h = this.scaledHeight;
		this.w = this.scaledWidth;

		this.particles = [];
		this.lastParticle = 0;
		this.particlesSpawnTime = 125;
	}

	/**
	 * @param {number} timeElapsed
	 */
	update(timeElapsed) {
		super.update(timeElapsed);

		this.lastParticle += timeElapsed;
		if (this.lastParticle >= this.particlesSpawnTime) {
			this.particles.push(new TrashDust(this));
			this.lastParticle = 0;
		}
		this.particles.forEach((p) => p.update());
	}

	draw() {
		// super.draw();
		this.particles.forEach((p) => p.draw());
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
