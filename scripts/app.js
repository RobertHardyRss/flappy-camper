//@ts-check
import { ctx, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { game } from "./game.js";
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

		this.vy = 0; //  the current velocity of y
		this.vyMax = 5;
		this.maxY = CANVAS_HEIGHT - 25 - this.h;

		this.dust = [];

		this.wireUpEvents();
	}

	update() {
		this.y += this.vy;
		this.y = Math.min(this.y, this.maxY);
		this.vy += 0.1;

		this.dust.push(new HappyDust(this));
		this.dust.forEach((p) => {
			p.update();
		});
		this.dust = this.dust.filter((p) => {
			p.isVisible;
		});

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

		this.yChange = (Math.random() * 2 + 0.2) * -1;
		this.rChange = Math.random() * 3 + 1;

		this.isVisible = true;
		this.opacity = 1;
		this.opacityChange = 0.05;
	}

	update() {
		this.x -= game.gameSpeed;
		this.y += this.yChange;
		this.r += this.rChange;
		this.opacity -= this.opacityChange;
		this.isVisible = this.x + this.r > 0 || this.opacity > 0;
	}

	draw() {
		this.ctx.save();
		this.ctx.globalAlpha = 1;
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
