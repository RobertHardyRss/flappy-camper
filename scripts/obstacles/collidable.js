//@ts-check
import { game } from "../game.js";

export class Collidable {
	/**
	 * @param {number} type
	 * @param {number} x
	 * @param {number} y
	 * @param {number} h
	 * @param {number} w
	 * @param {string} color
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(type, x, y, h, w, color, ctx) {
		this.type = type;
		this.ctx = ctx;
		this.h = h;
		this.w = w;

		this.x = x;
		this.y = y;

		this.isVisible = true;
		this.color = color;

		this.limitsPlayerHeight = false;
		this.karmaImpact = 0;
		this.staminaImpact = 0;
		this.isCollectable = false;
		this.isCollected = false;
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

export const collidableType = {
	Peak: 0,
	Forest: 1,
	Trash: 2,
	TrashCan: 3,
	Food: 4,
};
