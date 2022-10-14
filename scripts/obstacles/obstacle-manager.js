//@ts-check
import {
	canvas,
	CANVAS_WIDTH,
	EVENTS,
	KARMA_MISSED_TRASH_PENALTY,
	LOWEST_REACHABLE_POINT,
} from "../constants.js";
import {
	MAX_PEAK_HEIGHT,
	MIN_PEAK_HEIGHT,
	TrailPeak,
	PEAK_WIDTH,
} from "./trail-peak.js";
import {
	Forest,
	FOREST_WIDTH_MIN,
	MAX_FOREST_HEIGHT,
	MIN_FOREST_HEIGHT,
} from "./forest.js";
import { Trash } from "../collectable/trash.js";
import { Collidable } from "./collidable.js";
import { Food } from "../collectable/food.js";

export class ObstacleManager {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;
		this.peaks = [];
		this.forests = [];
		this.minPeaks = CANVAS_WIDTH / PEAK_WIDTH + 20;
		this.peakState = {
			isGoingUp: false,
			stepCount: 0,
			stepLimit: 5,
			stepSize: PEAK_WIDTH,
			recalc: function () {
				this.isGoingUp = !this.isGoingUp;
				this.stepLimit = Math.random() * 17 + 3;
				this.stepCount = 0;
			},
		};

		this.trash = [];
		this.nextTrashTime = 1000;
		this.lastTrashTime = 0;
		this.food = [];
		this.nextFoodTime = 3000;
		this.lastFoodTime = 0;
	}

	init() {
		let currentX = 0;
		while (this.peaks.length < this.minPeaks) {
			let o = new TrailPeak(MAX_PEAK_HEIGHT, this.ctx);
			o.x = currentX;
			this.peaks.push(o);
			currentX += PEAK_WIDTH;
		}

		this.peakState.recalc();

		currentX = 0;
		for (let n = 0; n < 8; n++) {
			let o = new Forest(MIN_FOREST_HEIGHT, this.ctx);
			o.w = FOREST_WIDTH_MIN;
			o.x = currentX;
			this.forests.push(o);
			currentX += o.w;
		}

		canvas.addEventListener("click", (ev) => {
			// console.log(ev);
			const x = ev.offsetX;
			const y = ev.offsetY;
			const buffer = 20;
			this.trash.forEach((t) => {
				if (
					x >= t.x - buffer &&
					x <= t.x + t.w + buffer &&
					y >= t.y - buffer &&
					y <= t.y + t.h + buffer
				) {
					t.isTagged = true;
					console.log("trash tagged!");
				} else {
					console.log(
						"trash missed!",
						x,
						y,
						t.x,
						t.y,
						t.x + t.w,
						t.y + t.h
					);
				}
			});
		});
	}

	/**
	 * @param {number} timeElapsed
	 */
	update(timeElapsed) {
		[...this.peaks, ...this.forests, ...this.food, ...this.trash].forEach(
			(b) => {
				b.update(timeElapsed);
			}
		);

		this.updateTrash(timeElapsed);
		this.updateFood(timeElapsed);
		this.updatePeaks();
		this.updateForests();
	}

	/**
	 * @param {number} timeElapsed
	 */
	updateTrash(timeElapsed) {
		this.trash
			.filter((o) => !o.isVisible && !o.isCollected && !o.isTagged)
			.forEach((t) => {
				// send a missed trash karma penalty for
				// every piece of trash that is not tagged and is
				// off screen
				let event = new CustomEvent(EVENTS.karmaChange, {
					detail: KARMA_MISSED_TRASH_PENALTY,
				});
				window.dispatchEvent(event);
			});
		this.trash = this.trash.filter((o) => o.isVisible && !o.isCollected);

		this.lastTrashTime += timeElapsed;
		if (this.lastTrashTime < this.nextTrashTime) return;
		this.lastTrashTime = 0;

		this.nextTrashTime = Math.floor(Math.random() * 2000 + 1000);

		const trash = new Trash(this.ctx);
		trash.y = this.setCollectablePlacement(trash);

		// console.log(trash);
		this.trash.push(trash);
	}

	/**
	 * @param {number} timeElapsed
	 */
	updateFood(timeElapsed) {
		this.food = this.food.filter((o) => o.isVisible && !o.isCollected);

		this.lastFoodTime += timeElapsed;
		if (this.lastFoodTime < this.nextFoodTime) return;
		this.lastFoodTime = 0;

		this.nextFoodTime = Math.floor(Math.random() * 5000 + 10 * 1000);

		const food = new Food(this.ctx);
		food.y = this.setCollectablePlacement(food);

		// console.log(food);
		this.food.push(food);
	}

	/**
	 * @param {Collidable} c
	 */
	setCollectablePlacement(c) {
		// filter all peaks above the collectable, then then get the
		// tallest one and that will set our minumum y placement
		const minY = this.peaks
			.filter(
				(p) =>
					(p.x >= c.x && p.x <= c.x + c.w) ||
					(p.x + p.w >= c.x && p.x + p.w <= c.x + c.w)
			)
			.map((p) => p.h)
			.reduce((a, b) => {
				return a > b ? a : b;
			});

		let y = Math.random() * (LOWEST_REACHABLE_POINT - c.h - minY) + minY;
		return y;
	}

	updateForests() {
		this.forests = this.forests.filter((o) => o.isVisible);
		let lastBottom = this.forests[this.forests.length - 1];
		if (lastBottom.x <= CANVAS_WIDTH) {
			let h =
				Math.random() * (MAX_FOREST_HEIGHT - MIN_FOREST_HEIGHT) +
				MIN_FOREST_HEIGHT;

			let o = new Forest(h, this.ctx);
			o.x = lastBottom.x + lastBottom.w;
			this.forests.push(o);
		}
	}

	updatePeaks() {
		this.peaks = this.peaks.filter((o) => o.isVisible);

		while (this.peaks.length < this.minPeaks) {
			// if we have reached our step limit, recalculate
			if (this.peakState.stepCount >= this.peakState.stepLimit) {
				this.peakState.recalc();
			}

			let lastObs = this.peaks[this.peaks.length - 1];
			let nextX = lastObs.x + PEAK_WIDTH;
			let nextH = this.peakState.isGoingUp
				? lastObs.h + this.peakState.stepSize
				: lastObs.h - this.peakState.stepSize;

			if (nextH > MAX_PEAK_HEIGHT) {
				nextH = MAX_PEAK_HEIGHT;
				this.peakState.recalc();
			} else if (nextH < MIN_PEAK_HEIGHT) {
				nextH = MIN_PEAK_HEIGHT;
				this.peakState.recalc();
			}

			this.peakState.stepCount++;

			let o = new TrailPeak(nextH, this.ctx);
			o.x = nextX;
			this.peaks.push(o);
		}
	}

	draw() {
		[...this.peaks, ...this.forests, ...this.food, ...this.trash].forEach(
			(b) => {
				b.draw();
			}
		);
	}
}
