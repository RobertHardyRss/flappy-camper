//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw "ctx is null or undefined!";

canvas.width = 800;
canvas.height = 600;

const MAX_TOP_OBSTACLE_HEIGHT = 200;
const MIN_TOP_OBSTACLE_HEIGHT = 50;
const MAX_BOTTOM_OBSTACLE_HEIGHT = 340;
const MIN_BOTTOM_OBSTACLE_HEIGHT = 50;

const TOP_OBSTACLE_WIDTH = 2;
const BOTTOM_OBSTACLE_WIDTH_MIN = 100;
const BOTTOM_OBSTACLE_WIDTH_MAX = canvas.width / 2;

let gameSpeed = 6;

class Obstacle {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} h
	 * @param {Number} w
	 * @param {String} color
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(x, y, h, w, color, ctx) {
		this.ctx = ctx;
		this.h = h;
		this.w = w;

		this.x = x;
		this.y = y;

		this.isVisible = true;

		this.color = color;
	}

	update() {
		this.x = this.x - gameSpeed;
		this.isVisible = this.x + this.w > 0;
	}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

class TopObstacle extends Obstacle {
	/**
	 * @param {Number} h
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(h, ctx) {
		super(canvas.width, 0, h, TOP_OBSTACLE_WIDTH, "blue", ctx);
	}
}

class BottomObstacle extends Obstacle {
	/**
	 * @param {Number} h
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(h, ctx) {
		super(
			canvas.width,
			canvas.height - h,
			h,
			Math.random() * BOTTOM_OBSTACLE_WIDTH_MAX +
				BOTTOM_OBSTACLE_WIDTH_MIN,
			"green",
			ctx
		);
	}
}

class ObstacleManager {
	constructor(ctx) {
		this.ctx = ctx;
		this.topObstacles = [];
		this.bottoms = [];
		this.minTopObs = canvas.width / TOP_OBSTACLE_WIDTH + 2;
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
		this.topObstacles.forEach((b) => {
			b.update();
		});

		this.bottoms.forEach((b) => {
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
	}

	draw() {
		this.topObstacles.forEach((b) => {
			b.draw();
		});

		this.bottoms.forEach((b) => {
			b.draw();
		});
	}
}

let manager = new ObstacleManager(ctx);
manager.init();

function animate() {
	// clear the screen
	ctx?.clearRect(0, 0, canvas.width, canvas.height);

	manager.update();
	manager.draw();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
