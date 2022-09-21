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
	}

	update() {}

	draw() {
		this.ctx.fillStyle = "red";
		this.ctx.fillRect(this.x, this.y, this.w, this.h);
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
