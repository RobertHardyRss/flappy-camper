//@ts-check
import { ctx, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { ObstacleManager } from "./obstacles/obstacle-manager.js";

class Player {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;

		this.h = 32;
		this.w = this.h * 2;

		this.x = 150;
		this.y = CANVAS_HEIGHT / 2 + this.h / 2;

		this.weight = 1;
		this.vy = 0; //  the current velocity of y
		this.vyMax = 5;
		this.maxY = CANVAS_HEIGHT - 25 - this.h;

		this.wireUpEvents();
	}

	update() {
		this.y += this.vy * this.weight;
		this.y = Math.min(this.y, this.maxY);
		this.vy += 0.1;

		if (Math.abs(this.vy) > this.vyMax) {
			if (this.vy > 0) {
				this.vy = this.vyMax;
			} else {
				this.vy = this.vyMax * -1;
			}
		}
	}

	draw() {
		this.ctx.fillStyle = "red";
		this.ctx.fillRect(this.x, this.y, this.w, this.h);
	}

	flap() {
		this.vy -= 2;
	}

	wireUpEvents() {
		window.addEventListener("keypress", (ev) => {
			console.log(ev);
			if (ev.code === "Space") {
				this.flap();
			}
		});
	}
}

let manager = new ObstacleManager(ctx);
manager.init();

let p = new Player(ctx);

function animate() {
	// clear the screen
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	manager.update();
	manager.draw();

	p.update();
	p.draw();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
