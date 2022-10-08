//@ts-check
import { game } from "../game.js";

export class Particle {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} r
	 * @param {string} color
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(x, y, r, color, ctx) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;
		this.ctx = ctx;

		this.yChange = (Math.random() * 5 + 0.2) * -1;
		this.rChange = Math.random() * 0.5 + 1;

		this.isVisible = true;
		this.opacity = 1;
		this.opacityChange = 0.05;
	}

	update() {
		this.x -= game.gameSpeed;
		this.y += this.yChange;
		this.r += this.rChange;

		this.opacity -= this.opacityChange;
		if (this.opacity < 0) this.opacity = 0;

		this.isVisible = this.x + this.r > 0 || this.opacity > 0;
	}

	draw() {
		this.ctx.save();
		this.ctx.globalAlpha = this.opacity;
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
		this.ctx.fill();
		this.ctx.restore();
	}
}
