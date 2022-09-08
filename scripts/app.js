//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw "ctx is null or undefined!";

canvas.width = 800;
canvas.height = 600;

const MAX_TOP_OBSTACLE_HEIGHT = 200;
const TOP_OBSTACLE_WIDTH = 10;
let gameSpeed = 10;

class Obstacle {
	/**
	 * @param {Number} h
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(h, ctx) {
		this.ctx = ctx;
		this.h = h;
		this.w = TOP_OBSTACLE_WIDTH;

		this.x = canvas.width;
		this.y = 0;

		this.isVisible = true;

		this.color = "blue";
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

class ObstacleManager {
	constructor(ctx) {
		this.ctx = ctx;
		this.topObstacles = [];
		this.minTopObs = canvas.width / TOP_OBSTACLE_WIDTH + 2;
		this.topObsState = {
			isGoingUp: false,
			stepCount: 0,
			stepLimit: 5,
			stepSize: 10,
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
			let o = new Obstacle(MAX_TOP_OBSTACLE_HEIGHT, this.ctx);
			o.x = currentX;
			this.topObstacles.push(o);
			currentX += TOP_OBSTACLE_WIDTH;
		}

		this.topObsState.recalc();
	}

	update() {
		this.topObstacles.forEach((b) => {
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

			this.topObsState.stepCount++;

			let o = new Obstacle(nextH, this.ctx);
			o.x = nextX;
			this.topObstacles.push(o);
		}
	}

	draw() {
		this.topObstacles.forEach((b) => {
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
