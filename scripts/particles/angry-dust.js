//@ts-check
import { Player } from "../player.js";
import { Particle } from "./particle.js";

export class AngryDust extends Particle {
	/**
	 * @param {Player} player
	 */
	constructor(player) {
		super(player.x, player.y + player.h, 5, "black", player.ctx);
		this.color = Math.random() > 0.7 ? "maroon" : "black";
	}
}
