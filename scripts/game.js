import { ctx, EVENTS } from "./constants.js";

const START_SPEED = 5;

class Game {
	constructor(ctx) {
		this.ctx = ctx;
		this.gameSpeed = START_SPEED;

		window.addEventListener(EVENTS.increaseGameSpeed, () => {
			this.gameSpeed += 1;
			console.log("increase speed", this.gameSpeed);
		});
	}

	reset() {
		this.gameSpeed = START_SPEED;
	}
}

export const game = new Game(ctx);
