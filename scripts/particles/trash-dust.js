//@ts-check
import { Trash } from "../collectable/trash.js";
import { Particle } from "./particle.js";

export class TrashDust extends Particle {
	/**
	 * @param {Trash} trash
	 */
	constructor(trash) {
		super(trash.x + trash.w / 2, trash.y, 1, "olive", trash.ctx);
		this.color = Math.random() > 0.7 ? "olive" : "lime";

		this.yChange = (Math.random() * 1 + 2) * -1;
		this.rChange = Math.random() * 0.3 + 0.2;
		this.x = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 20 + this.x;

		this.opacityChange = 0.02;
	}
}
