//@ts-check
import { CANVAS_HEIGHT, EVENTS } from "./constants.js";
import { game } from "./game.js";
import { MIN_PEAK_HEIGHT } from "./obstacles/trail-peak.js";
import { AngryDust } from "./particles/angry-dust.js";
import { HappyDust } from "./particles/happy-dust.js";
import { SpriteHelper } from "./utilities/sprite-helper.js";

export class Player {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;

		this.h = 32;
		this.w = 32;

		this.x = 150;
		this.y = CANVAS_HEIGHT / 2 + this.h / 2;

		this.vy = 0; //  the current velocity of y
		this.vyMax = 5;
		this.maxY = CANVAS_HEIGHT - 25 - this.h;
		this.minY = MIN_PEAK_HEIGHT;

		this.dust = [];

		this.image = this.#setupImage();
		this.#wireUpEvents();

		this.isOnTrail = true;
	}

	/**
	 * @param {number} timeElapsed
	 */
	update(timeElapsed) {
		this.y += this.vy;
		this.y = Math.max(Math.min(this.y, this.maxY), this.minY);
		this.vy += 0.1;

		this.dust.push(
			this.isOnTrail ? new HappyDust(this) : new AngryDust(this)
		);
		this.dust.forEach((p) => {
			p.update();
		});
		this.dust = this.dust.filter((p) => p.isVisible);

		if (Math.abs(this.vy) > this.vyMax) {
			if (this.vy > 0) {
				this.vy = this.vyMax;
			} else {
				this.vy = this.vyMax * -1;
			}
		}

		this.image.next(timeElapsed);
	}

	draw() {
		// collision box
		// this.ctx.fillStyle = "red";
		// this.ctx.fillRect(this.x, this.y, this.w, this.h);

		let currentFrame = this.image.getCurrentFrame();
		this.ctx.drawImage(
			this.image.src, // the image we want to draw
			currentFrame.x, // x coord of where to start our clip
			currentFrame.y, // y coord of where to start our clip
			this.image.spriteWidth, // x coord of where to end our clip
			this.image.spriteHeight, // y coord of where to end our clip
			this.x + this.image.xOffset, // this the x coord of where to place the image
			this.y + this.image.yOffset, // this the y coord of where to place the image
			this.image.scaledWidth, // the width of the image
			this.image.scaledHeight // the height of the image
		);

		this.dust.forEach((p) => {
			p.draw();
		});
	}

	flap() {
		if (this.vy > 0) {
			this.vy = 0;
		}

		this.vy -= 2;
	}

	#wireUpEvents() {
		window.addEventListener("keydown", (ev) => {
			// console.log(ev);

			switch (ev.code) {
				case "Space":
				case "ArrowUp":
				case "KeyW":
					this.flap();
					break;
			}
		});

		window.addEventListener(
			EVENTS.onTrail,
			(/** @type {CustomEventInit} */ e) => {
				// console.log("On trail", e);
				this.minY = e.detail.lowestTopHeight - this.h;
				this.isOnTrail = true;
			}
		);

		window.addEventListener(
			EVENTS.offTrail,
			(/** @type {CustomEventInit} */ e) => {
				//console.log("Off Trail", e);
				this.minY = e.detail.lowestTopHeight - this.h;
				this.isOnTrail = false;
			}
		);
	}

	#setupImage() {
		const image = new SpriteHelper(
			document.getElementById("player-run"), // image
			15, // fps
			8, // frame count
			3, // columns
			3, // rows
			641, // sprite width
			542, // sprite height
			100 // scale to width
		);
		image.xOffset = -30;
		image.yOffset = -50;

		return image;
	}
}
