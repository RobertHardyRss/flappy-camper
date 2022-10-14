//@ts-check

import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, EVENTS } from "../constants.js";

export class StartScene {
	/**
	 * @param {CanvasRenderingContext2D} ctx     */
	constructor(ctx) {
		this.ctx = ctx;

		canvas.addEventListener(
			"click",
			() => {
				window.dispatchEvent(new Event(EVENTS.startGame));
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
		backgroundGradient.addColorStop(1, "DeepSkyBlue");

		this.ctx.save();
		this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		this.ctx.fillStyle = backgroundGradient;
		this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 0;
		this.ctx.shadowBlur = 20;
		this.ctx.shadowColor = "white";
		this.ctx.fillStyle = "black";
		this.ctx.strokeStyle = "brown";
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";

		let text = "Flappy Camper";
		this.ctx.font = "80px driftwood";
		this.ctx.fillText(text, CANVAS_WIDTH / 2, 100);
		this.ctx.strokeText(text, CANVAS_WIDTH / 2, 100);

		text = "Click to Start";
		this.ctx.font = "60px driftwood";
		this.ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);
		this.ctx.strokeText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);

		let instructionFontSize = 30;
		let instructionOffset = instructionFontSize + 10;
		let instructionY = 350;
		this.ctx.fillStyle = "black";
		this.ctx.font = `${instructionFontSize}px rocko`;

		text = "Press space, up arrow or w to flap.";
		this.ctx.fillText(text, CANVAS_WIDTH / 2, instructionY);
		instructionY += instructionOffset;

		text = "STAY ON THE TRAIL IF YOU CAN!";
		this.ctx.fillText(text, CANVAS_WIDTH / 2, instructionY);
		instructionY += instructionOffset;

		text = "If you can't collect trash, click on it to tag it.";
		this.ctx.fillText(text, CANVAS_WIDTH / 2, instructionY);
		instructionY += instructionOffset;

		text = "Collect as much trash as possible!";
		this.ctx.fillText(text, CANVAS_WIDTH / 2, instructionY);
		instructionY += instructionOffset;

		text = "Food also gives you points";
		this.ctx.fillText(text, CANVAS_WIDTH / 2, instructionY);
		instructionY += instructionOffset;

		this.ctx.restore();
	}
}
