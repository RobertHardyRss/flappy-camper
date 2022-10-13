//@ts-check

import { game } from "../game.js";

export class BackgroundImage {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {HTMLImageElement} image
	 */
	constructor(ctx, image) {
		this.ctx = ctx;
		this.image = image;
		this.h = image.height;
		this.w = image.width;
		this.x = 0;
		this.y = 0;
		this.speedRatio = 1;
	}

	update() {
		this.x -= game.gameSpeed * this.speedRatio;
		if (this.x <= this.w * -1) this.x = 0;
	}

	draw() {
		this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
		this.ctx.drawImage(this.image, this.x + this.w, this.y, this.w, this.h);
	}
}
