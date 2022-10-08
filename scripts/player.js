//@ts-check
import { CANVAS_HEIGHT, EVENTS } from "./constants.js";
import { MIN_PEAK_HEIGHT } from "./obstacles/trail-peak.js";
import { HappyDust } from "./particles/happy-dust.js";

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

		this.image = {
			/** @type {HTMLImageElement} */ //@ts-ignore
			src: document.getElementById("player-run"),
			fps: 15,
			frames: [
				{ x: 0, y: 0 },
				{ x: 641, y: 0 },
				{ x: 1282, y: 0 },
				{ x: 0, y: 542 },
				{ x: 641, y: 542 },
				{ x: 1282, y: 542 },
				{ x: 0, y: 1084 },
				{ x: 641, y: 1084 },
			],
			currentFrame: 0,
			lastFrameChange: 0,
			xOffset: -33,
			yOffset: -65,
			next: function (/** @type {number} */ timeElapsed) {
				this.lastFrameChange += timeElapsed;
				if (this.lastFrameChange < 1000 / this.fps) return;
				this.lastFrameChange = 0;

				this.currentFrame++;
				if (this.currentFrame >= this.frames.length) {
					this.currentFrame = 0;
				}
			},
		};

		this.wireUpEvents();
		this.color = "red";
	}

	/**
	 * @param {number} timeElapsed
	 */
	update(timeElapsed) {
		this.y += this.vy;
		this.y = Math.max(Math.min(this.y, this.maxY), this.minY);
		this.vy += 0.1;

		this.dust.push(new HappyDust(this));
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
		// this.ctx.fillStyle = "red";
		// this.ctx.fillRect(this.x, this.y, this.w, this.h);

		this.ctx.drawImage(
			this.image.src, // the image we want to draw
			this.image.frames[this.image.currentFrame].x, // x coord of where to start our clip
			this.image.frames[this.image.currentFrame].y, // y coord of where to start our clip
			641, // x coord of where to end our clip
			542, // y coord of where to end our clip
			this.x + this.image.xOffset, // this the x coord of where to place the image
			this.y + this.image.yOffset, // this the y coord of where to place the image
			100, // the width of the image
			100 // the height of the image
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

	wireUpEvents() {
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
				this.color = "red";
			}
		);

		window.addEventListener(
			EVENTS.offTrail,
			(/** @type {CustomEventInit} */ e) => {
				//console.log("Off Trail", e);
				this.minY = e.detail.lowestTopHeight - this.h;
				this.color = "black";
			}
		);
	}
}
