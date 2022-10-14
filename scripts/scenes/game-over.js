//@ts-check

import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, EVENTS } from "../constants.js";
import { Scoreboard } from "../scoreboard.js";

export class GameOverScene {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Scoreboard} sb
	 */
	constructor(ctx, sb) {
		this.ctx = ctx;
		this.sb = sb;

		canvas.addEventListener(
			"click",
			() => {
				window.dispatchEvent(new Event(EVENTS.restartGame));
			},
			{ once: true }
		);
	}

	draw() {
		let backgroundGradient = this.ctx.createLinearGradient(
			0,
			0,
			0,
			CANVAS_HEIGHT
		);
		backgroundGradient.addColorStop(0, "DarkBlue");
		backgroundGradient.addColorStop(1, "DarkGreen");

		this.ctx.save();
		this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		this.ctx.fillStyle = backgroundGradient;
		this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 0;
		this.ctx.shadowBlur = 5;
		this.ctx.shadowColor = "white";

		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";

		let text = "Game Over!";
		this.ctx.fillStyle = "black";
		this.ctx.strokeStyle = "brown";
		this.ctx.font = "80px driftwood";
		this.ctx.fillText(text, CANVAS_WIDTH / 2, 80 + 10);
		this.ctx.strokeText(text, CANVAS_WIDTH / 2, 80 + 10);

		this.ctx.fillStyle = "black";
		this.ctx.strokeStyle = "black";
		let scoreFontSize = 40;
		this.ctx.font = `${scoreFontSize}px rocko`;

		text = `Distance Traveled: ${this.sb.getDistanceTraveled()} miles`;
		this.ctx.fillText(
			text,
			CANVAS_WIDTH / 2,
			300 - (scoreFontSize * 2 + 10)
		);
		this.ctx.strokeText(
			text,
			CANVAS_WIDTH / 2,
			300 - (scoreFontSize * 2 + 10)
		);
		text = `Trash Collected: ${this.sb.trashCollected}`;
		this.ctx.fillText(text, CANVAS_WIDTH / 2, 300 - (scoreFontSize + 10));
		this.ctx.strokeText(text, CANVAS_WIDTH / 2, 300 - (scoreFontSize + 10));
		text = `Food Collected: ${this.sb.foodCollected}`;
		this.ctx.fillText(text, CANVAS_WIDTH / 2, 300);
		this.ctx.strokeText(text, CANVAS_WIDTH / 2, 300);

		this.ctx.font = `80px rocko`;
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		text = `SCORE: ${this.sb.getTotalScore()}`;
		this.ctx.fillText(text, CANVAS_WIDTH / 2, 400);
		this.ctx.strokeText(text, CANVAS_WIDTH / 2, 400);

		text = "Click to Try Again";
		this.ctx.fillStyle = "black";
		this.ctx.strokeStyle = "brown";
		this.ctx.font = "60px driftwood";
		this.ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
		this.ctx.strokeText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
		this.ctx.restore();

		/** @type {HTMLElement} */ //@ts-ignore
		const screenShotLink = document.getElementById("screenshot");
		screenShotLink.setAttribute(
			"download",
			`flappy-camper-${new Date().toISOString()}.png`
		);
		screenShotLink.setAttribute(
			"href",
			canvas
				.toDataURL("image/png")
				.replace("image/png", "image/octet-stream")
		);
	}
}
