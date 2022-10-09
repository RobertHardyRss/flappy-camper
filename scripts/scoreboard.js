//@ts-check

import { CANVAS_WIDTH, EVENTS } from "./constants.js";
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

		this.#wireUpEvents();
	}

	update(timeElapsed) {
		this.xDistance += game.gameSpeed;
	}

	draw() {
		this.#drawDistanceTraveled();
		this.#drawKarma();
		this.#drawStamina();
	}

	#drawDistanceTraveled() {
		const distance = `${this.#getDistanceTraveled()} miles`;
		const x = CANVAS_WIDTH - 20;
		const y = 40;
		this.ctx.save();
		this.ctx.strokeStyle = "black";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "right";
		this.ctx.font = "20px fantasy";
		this.ctx.strokeText(distance, x, y);
		this.ctx.fillText(distance, x, y);
		this.ctx.restore();
	}

	#getDistanceTraveled() {
		return (this.xDistance / (CANVAS_WIDTH * 4)).toFixed(2);
	}

	#drawKarma() {
		const distance = `${this.trailKarma} trail karma`;
		const x = CANVAS_WIDTH - 20;
		const y = 60;
		this.ctx.save();
		this.ctx.strokeStyle = "black";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "right";
		this.ctx.font = "20px fantasy";
		this.ctx.strokeText(distance, x, y);
		this.ctx.fillText(distance, x, y);
		this.ctx.restore();
	}

	#drawStamina() {
		const distance = `${this.stamina} stamina`;
		const x = CANVAS_WIDTH - 20;
		const y = 80;
		this.ctx.save();
		this.ctx.strokeStyle = "black";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "right";
		this.ctx.font = "20px fantasy";
		this.ctx.strokeText(distance, x, y);
		this.ctx.fillText(distance, x, y);
		this.ctx.restore();
	}

	updateStamina(amount) {
		this.stamina += amount;
		this.stamina = Math.max(
			Math.min(this.stamina, MAX_STAMINA),
			MIN_STAMINA
		);
	}

	updateKarma(amount) {
		this.trailKarma += amount;
		this.trailKarma = Math.max(
			Math.min(this.trailKarma, MAX_KARMA),
			MIN_KARMA
		);
	}

	#wireUpEvents() {
		window.addEventListener(EVENTS.karmaChange, (ev) => {});

		window.addEventListener(EVENTS.staminaChange, (ev) => {});

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
