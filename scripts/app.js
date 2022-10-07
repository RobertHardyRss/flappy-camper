//@ts-check
import { ctx, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { game } from "./game.js";
import { ObstacleManager } from "./obstacles/obstacle-manager.js";

// 1923 x 1626
// 641 X 542 for each frame

class Player {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;

		this.h = 32;
		this.w = 32;

		this.x = 150;
		this.y = CANVAS_HEIGHT / 2 + this.h / 2;

		this.vy = 0; //  the current velocity of y
		this.vyMax = 5;
		this.maxY = CANVAS_HEIGHT - 25 - this.h;

		this.dust = [];

		this.image = {
			/** @type {HTMLImageElement} */ //@ts-ignore
			src: document.getElementById("player-run"),
			fps: 15,
			frames: [
				{ x: 0, y: 0 },
				{ x: 641, y: 0 },
				{ x: 1282, y: 0 },
				{ x: 0, y: 542 },
				{ x: 641, y: 542 },
				{ x: 1282, y: 542 },
				{ x: 0, y: 1084 },
				{ x: 641, y: 1084 },
			],
			currentFrame: 0,
			lastFrameChange: 0,
			xOffset: -33,
			yOffset: -65,
			next: function (timeElapsed) {
				this.lastFrameChange += timeElapsed;
				if (this.lastFrameChange < 1000 / this.fps) return;
				this.lastFrameChange = 0;

				this.currentFrame++;
				if (this.currentFrame >= this.frames.length) {
					this.currentFrame = 0;
				}
			},
		};

		this.wireUpEvents();
	}

	/**
	 * @param {number} timeElapsed
	 */
	update(timeElapsed) {
		this.y += this.vy;
		this.y = Math.min(this.y, this.maxY);
		this.vy += 0.1;

		this.dust.push(new HappyDust(this));
		this.dust.forEach((p) => {
			p.update();
		});
		this.dust = this.dust.filter((p) => p.isVisible);

		if (Math.abs(this.vy) > this.vyMax) {
			if (this.vy > 0) {
				this.vy = this.vyMax;
			} else {
				this.vy = this.vyMax * -1;
			}
		}

		this.image.next(timeElapsed);
	}

	draw() {
		// this.ctx.fillStyle = "red";
		// this.ctx.fillRect(this.x, this.y, this.w, this.h);

		this.ctx.drawImage(
			this.image.src, // the image we want to draw
			this.image.frames[this.image.currentFrame].x, // x coord of where to start our clip
			this.image.frames[this.image.currentFrame].y, // y coord of where to start our clip
			641, // x coord of where to end our clip
			542, // y coord of where to end our clip
			this.x + this.image.xOffset, // this the x coord of where to place the image
			this.y + this.image.yOffset, // this the y coord of where to place the image
			100, // the width of the image
			100 // the height of the image
		);

		this.dust.forEach((p) => {
			p.draw();
		});
	}

	flap() {
		if (this.vy > 0) {
			this.vy = 0;
		}

		this.vy -= 2;
	}

	wireUpEvents() {
		window.addEventListener("keydown", (ev) => {
			console.log(ev);

			switch (ev.code) {
				case "Space":
				case "ArrowUp":
				case "KeyW":
					this.flap();
					break;
			}
		});
	}
}

class Particle {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} r
	 * @param {string} color
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(x, y, r, color, ctx) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;
		this.ctx = ctx;

		this.yChange = (Math.random() * 5 + 0.2) * -1;
		this.rChange = Math.random() * 0.5 + 1;

		this.isVisible = true;
		this.opacity = 1;
		this.opacityChange = 0.05;
	}

	update() {
		this.x -= game.gameSpeed;
		this.y += this.yChange;
		this.r += this.rChange;

		this.opacity -= this.opacityChange;
		if (this.opacity < 0) this.opacity = 0;

		this.isVisible = this.x + this.r > 0 || this.opacity > 0;
	}

	draw() {
		this.ctx.save();
		this.ctx.globalAlpha = this.opacity;
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
		this.ctx.fill();
		this.ctx.restore();
	}
}

class HappyDust extends Particle {
	/**
	 * @param {Player} player
	 */
	constructor(player) {
		super(player.x, player.y + player.h, 2, "pink", player.ctx);
		this.color = "hsl(" + Math.floor(Math.random() * 360) + ", 100%, 50%)";
	}
}

let manager = new ObstacleManager(ctx);
manager.init();

let p = new Player(ctx);
let currentTime = 0;

/**
 * @param {number} timestamp
 */
function animate(timestamp) {
	let timeElapsed = timestamp - currentTime;
	currentTime = timestamp;

	// clear the screen
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	manager.update();
	manager.draw();

	p.update(timeElapsed);
	p.draw();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
