import { ctx } from "./constants.js";

class Game {
	constructor(ctx) {
		this.ctx = ctx;
		this.gameSpeed = 5;
	}
}

export const game = new Game(ctx);
