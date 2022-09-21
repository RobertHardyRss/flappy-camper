//@ts-check
import { CANVAS_WIDTH } from "../constants.js";
import {
	MAX_TOP_OBSTACLE_HEIGHT,
	MIN_TOP_OBSTACLE_HEIGHT,
	TopObstacle,
	TOP_OBSTACLE_WIDTH,
} from "./top-obstacle.js";
import {
	BottomObstacle,
	BOTTOM_OBSTACLE_WIDTH_MIN,
	MAX_BOTTOM_OBSTACLE_HEIGHT,
	MIN_BOTTOM_OBSTACLE_HEIGHT,
} from "./bottom-obstacle.js";

export class ObstacleManager {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;
		this.topObstacles = [];
		this.bottoms = [];
		this.minTopObs = CANVAS_WIDTH / TOP_OBSTACLE_WIDTH + 2;
		this.topObsState = {
			isGoingUp: false,
			stepCount: 0,
			stepLimit: 5,
			stepSize: TOP_OBSTACLE_WIDTH,
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
			let o = new TopObstacle(MAX_TOP_OBSTACLE_HEIGHT, this.ctx);
			o.x = currentX;
			this.topObstacles.push(o);
			currentX += TOP_OBSTACLE_WIDTH;
		}

		this.topObsState.recalc();

		currentX = 0;
		for (let n = 0; n < 8; n++) {
			let o = new BottomObstacle(MIN_BOTTOM_OBSTACLE_HEIGHT, this.ctx);
			o.w = BOTTOM_OBSTACLE_WIDTH_MIN;
			o.x = currentX;
			this.bottoms.push(o);
			currentX += o.w;
		}
	}

	update() {
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
			let nextX = lastObs.x + TOP_OBSTACLE_WIDTH;
			let nextH = this.topObsState.isGoingUp
				? lastObs.h + this.topObsState.stepSize
				: lastObs.h - this.topObsState.stepSize;

			if (nextH > MAX_TOP_OBSTACLE_HEIGHT) {
				nextH = MAX_TOP_OBSTACLE_HEIGHT;
				this.topObsState.recalc();
			} else if (nextH < MIN_TOP_OBSTACLE_HEIGHT) {
				nextH = MIN_TOP_OBSTACLE_HEIGHT;
				this.topObsState.recalc();
			}

			this.topObsState.stepCount++;

			let o = new TopObstacle(nextH, this.ctx);
			o.x = nextX;
			this.topObstacles.push(o);
		}

		this.bottoms = this.bottoms.filter((o) => o.isVisible);
		let lastBottom = this.bottoms[this.bottoms.length - 1];
		if (lastBottom.x <= CANVAS_WIDTH) {
			let h =
				Math.random() *
					(MAX_BOTTOM_OBSTACLE_HEIGHT - MIN_BOTTOM_OBSTACLE_HEIGHT) +
				MIN_BOTTOM_OBSTACLE_HEIGHT;

			let o = new BottomObstacle(h, this.ctx);
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
