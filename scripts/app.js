//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
if (ctx == null) throw "ctx is undefined!";

canvas.width = 800;
canvas.height = 600;

const MAX_TOP_OBSTACLE_HEIGHT = 200;
let gameSpeed = 10;

class Obstacle {
	/**
	 * @param {Number} h
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(h, ctx) {
		this.ctx = ctx;
		this.h = h;
		this.w = 10;

		this.x = canvas.width;
		this.y = 0;

		this.color = "blue";
	}

	update() {
		this.x = this.x - gameSpeed * -1;
	}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

let o = new Obstacle(MAX_TOP_OBSTACLE_HEIGHT, ctx);

function animate() {
	// clear the screen
	ctx?.clearRect(0, 0, canvas.width, canvas.height);

	o.update();
	o.draw();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
