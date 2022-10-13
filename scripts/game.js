import { ctx, EVENTS } from "./constants.js";

class Game {
	constructor(ctx) {
		this.ctx = ctx;
		this.gameSpeed = 5;

		window.addEventListener(EVENTS.increaseGameSpeed, () => {
			this.gameSpeed += 1;
			console.log("increase speed", this.gameSpeed);
		});
	}
}

export const game = new Game(ctx);
