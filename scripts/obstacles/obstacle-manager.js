//@ts-check
import { CANVAS_WIDTH } from "../constants.js";
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

export class ObstacleManager {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;
		this.topObstacles = [];
		this.bottoms = [];
		this.minTopObs = CANVAS_WIDTH / PEAK_WIDTH + 2;
		this.topObsState = {
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
	}

	init() {
		let currentX = 0;
		while (this.topObstacles.length < this.minTopObs) {
			let o = new TrailPeak(MAX_PEAK_HEIGHT, this.ctx);
			o.x = currentX;
			this.topObstacles.push(o);
			currentX += PEAK_WIDTH;
		}

		this.topObsState.recalc();

		currentX = 0;
		for (let n = 0; n < 8; n++) {
			let o = new Forest(MIN_FOREST_HEIGHT, this.ctx);
			o.w = FOREST_WIDTH_MIN;
			o.x = currentX;
			this.bottoms.push(o);
			currentX += o.w;
		}
	}

	/**
	 * @param {number} timeElapsed
	 */
	update(timeElapsed) {
		[...this.topObstacles, ...this.bottoms].forEach((b) => {
			b.update();
		});

		this.topObstacles = this.topObstacles.filter((o) => o.isVisible);

		while (this.topObstacles.length < this.minTopObs) {
			// if we have reached our step limit, recalculate
			if (this.topObsState.stepCount >= this.topObsState.stepLimit) {
				this.topObsState.recalc();
			}

			let lastObs = this.topObstacles[this.topObstacles.length - 1];
			let nextX = lastObs.x + PEAK_WIDTH;
			let nextH = this.topObsState.isGoingUp
				? lastObs.h + this.topObsState.stepSize
				: lastObs.h - this.topObsState.stepSize;

			if (nextH > MAX_PEAK_HEIGHT) {
				nextH = MAX_PEAK_HEIGHT;
				this.topObsState.recalc();
			} else if (nextH < MIN_PEAK_HEIGHT) {
				nextH = MIN_PEAK_HEIGHT;
				this.topObsState.recalc();
			}

			this.topObsState.stepCount++;

			let o = new TrailPeak(nextH, this.ctx);
			o.x = nextX;
			this.topObstacles.push(o);
		}

		this.bottoms = this.bottoms.filter((o) => o.isVisible);
		let lastBottom = this.bottoms[this.bottoms.length - 1];
		if (lastBottom.x <= CANVAS_WIDTH) {
			let h =
				Math.random() * (MAX_FOREST_HEIGHT - MIN_FOREST_HEIGHT) +
				MIN_FOREST_HEIGHT;

			let o = new Forest(h, this.ctx);
			o.x = lastBottom.x + lastBottom.w;
			this.bottoms.push(o);
		}
	}

	draw() {
		[...this.topObstacles, ...this.bottoms].forEach((b) => {
			b.draw();
		});
	}
}
