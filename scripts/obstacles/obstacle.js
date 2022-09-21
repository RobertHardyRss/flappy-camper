//@ts-check
import { game } from "../game.js";

export class Obstacle {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} h
	 * @param {Number} w
	 * @param {String} color
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(x, y, h, w, color, ctx) {
		this.ctx = ctx;
		this.h = h;
		this.w = w;

		this.x = x;
		this.y = y;

		this.isVisible = true;

		this.color = color;
	}

	update() {
		this.x = this.x - game.gameSpeed;
		this.isVisible = this.x + this.w > 0;
	}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
