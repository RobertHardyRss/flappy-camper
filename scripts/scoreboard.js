//@ts-check

import { CANVAS_WIDTH, EVENTS, KARMA_TRASH_BOOST } from "./constants.js";
import { game } from "./game.js";

const MIN_STAMINA = 0;
const MAX_STAMINA = 100;
const MIN_KARMA = 0;
const MAX_KARMA = 100;

export class Scoreboard {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;
		this.xDistance = 0;
		this.trailKarma = 50;
		this.stamina = 100;

		this.trashCollected = 0;
		this.foodCollected = 0;

		this.karmaMeter = {
			x: 10,
			y: 10,
			w: 300,
			h: 25,
		};
		this.karmaGradient = this.#getKarmaGradient();

		this.staminaMeter = {
			x: CANVAS_WIDTH - 10 - 300,
			y: 10,
			w: 300,
			h: 25,
		};
		this.staminaGradient = this.#getStaminaGradient();

		this.gameSpeedIncreaseInterval = CANVAS_WIDTH * 4 * 2;
		this.lastGameSpeedIncrease = 0;

		this.#wireUpEvents();
	}

	update(timeElapsed) {
		this.xDistance += game.gameSpeed;
		this.lastGameSpeedIncrease += game.gameSpeed;

		if (this.lastGameSpeedIncrease >= this.gameSpeedIncreaseInterval) {
			this.lastGameSpeedIncrease = 0;
			let event = new Event(EVENTS.increaseGameSpeed);
			window.dispatchEvent(event);
		}
	}

	draw() {
		this.#drawDistanceTraveled();
		this.#drawKarma();
		this.#drawStamina();
	}

	#drawDistanceTraveled() {
		this.ctx.save();
		this.ctx.globalAlpha = 0.8;
		const distance = `${this.getDistanceTraveled()} MILES`;
		const fontHeight = 20;
		const x = CANVAS_WIDTH / 2;
		const y = fontHeight + 10;
		this.ctx.strokeStyle = "black";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "center";
		this.ctx.font = `${fontHeight}px rocko`;
		this.ctx.strokeText(distance, x, y);
		this.ctx.fillText(distance, x, y);
		this.ctx.restore();
	}

	getDistanceTraveled() {
		return (this.xDistance / (CANVAS_WIDTH * 4)).toFixed(2);
	}

	getTotalScore() {
		let score = (
			(this.foodCollected + +this.getDistanceTraveled()) *
			(this.trashCollected * KARMA_TRASH_BOOST)
		).toFixed(0);
		return score;
	}

	#getKarmaGradient() {
		let gradient = this.ctx.createLinearGradient(
			this.karmaMeter.x,
			0,
			this.karmaMeter.w,
			0
		);
		gradient.addColorStop(0, "red");
		gradient.addColorStop(0.5, "yellow");
		gradient.addColorStop(1, "green");
		return gradient;
	}

	#getStaminaGradient() {
		let gradient = this.ctx.createLinearGradient(
			this.staminaMeter.x,
			0,
			this.staminaMeter.w + this.staminaMeter.x,
			0
		);
		gradient.addColorStop(0, "red");
		gradient.addColorStop(0.25, "purple");
		gradient.addColorStop(1, "purple");
		return gradient;
	}

	#drawKarma() {
		this.ctx.save();
		this.ctx.fillStyle = "silver";

		this.ctx.fillRect(
			this.karmaMeter.x,
			this.karmaMeter.y,
			this.karmaMeter.w,
			this.karmaMeter.h
		);

		this.ctx.fillStyle = this.karmaGradient;
		this.ctx.fillRect(
			this.karmaMeter.x,
			this.karmaMeter.y,
			this.karmaMeter.w * (this.trailKarma / 100),
			this.karmaMeter.h
		);

		this.ctx.globalAlpha = 0.7;
		const text = `TRAIL KARMA: ${this.trailKarma.toFixed(0)}`;
		const fontHeight = 20;
		const x = this.karmaMeter.x + this.karmaMeter.w / 2;
		const y = this.karmaMeter.y + fontHeight;
		this.ctx.strokeStyle = "black";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "center";
		this.ctx.font = `${fontHeight}px rocko`;
		this.ctx.strokeText(text, x, y);
		this.ctx.fillText(text, x, y);

		this.ctx.restore();
	}

	#drawStamina() {
		this.ctx.save();
		this.ctx.fillStyle = "silver";
		this.ctx.fillRect(
			this.staminaMeter.x,
			this.staminaMeter.y,
			this.staminaMeter.w,
			this.staminaMeter.h
		);

		this.ctx.fillStyle = this.staminaGradient;
		this.ctx.fillRect(
			this.staminaMeter.x,
			this.staminaMeter.y,
			this.staminaMeter.w * (this.stamina / 100),
			this.staminaMeter.h
		);

		this.ctx.globalAlpha = 0.7;
		const staminaText = `STAMINA: ${this.stamina.toFixed(0)}`;
		const fontHeight = 20;
		const x = this.staminaMeter.x + this.staminaMeter.w / 2;
		const y = this.staminaMeter.y + fontHeight;
		this.ctx.strokeStyle = "black";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "center";
		this.ctx.font = `${fontHeight}px rocko`;
		this.ctx.strokeText(staminaText, x, y);
		this.ctx.fillText(staminaText, x, y);

		this.ctx.restore();
	}

	/**
	 * @param {number} amount
	 */
	updateStamina(amount) {
		this.stamina += amount;
		this.stamina = Math.max(
			Math.min(this.stamina, MAX_STAMINA),
			MIN_STAMINA
		);
	}

	/**
	 * @param {number} amount
	 */
	updateKarma(amount) {
		this.trailKarma += amount;
		this.trailKarma = Math.max(
			Math.min(this.trailKarma, MAX_KARMA),
			MIN_KARMA
		);
	}

	#wireUpEvents() {
		window.addEventListener(
			EVENTS.karmaChange,
			(/** @type {CustomEventInit} */ e) => {
				//console.log(EVENTS.karmaChange, e.detail);
				this.updateKarma(e.detail);
				this.trashCollected++;
			}
		);

		window.addEventListener(
			EVENTS.staminaChange,
			(/** @type {CustomEventInit} */ e) => {
				//console.log(EVENTS.staminaChange, e.detail);
				this.updateStamina(e.detail);
				this.foodCollected++;
			}
		);

		window.addEventListener(
			EVENTS.onTrail,
			(/** @type {CustomEventInit} */ e) => {
				this.updateStamina(e.detail.staminaImpact);
				this.updateKarma(e.detail.karmaImpact);
			}
		);

		window.addEventListener(
			EVENTS.offTrail,
			(/** @type {CustomEventInit} */ e) => {
				this.updateStamina(e.detail.staminaImpact);
				this.updateKarma(e.detail.karmaImpact);
			}
		);
	}
}
