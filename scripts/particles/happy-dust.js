//@ts-check
import { Player } from "../player.js";
import { Particle } from "./particle.js";

export class HappyDust extends Particle {
	/**
	 * @param {Player} player
	 */
	constructor(player) {
		super(player.x, player.y + player.h, 5, "pink", player.ctx);
		this.color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
	}
}
