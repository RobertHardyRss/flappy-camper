//@ts-check
import { CollisionManager } from "./collision-manager.js";
import { ctx, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { ObstacleManager } from "./obstacles/obstacle-manager.js";
import { Player } from "./player.js";
import { Scoreboard } from "./scoreboard.js";

let manager = new ObstacleManager(ctx);
manager.init();

let p = new Player(ctx);
let currentTime = 0;

let collisions = new CollisionManager(p, manager);

let score = new Scoreboard(ctx);

/**
 * @param {number} timestamp
 */
function gameLoop(timestamp) {
	let timeElapsed = timestamp - currentTime;
	currentTime = timestamp;

	// clear the screen
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	manager.update(timeElapsed);
	p.update(timeElapsed);
	collisions.update(timeElapsed);
	score.update(timeElapsed);

	manager.draw();
	p.draw();
	score.draw();

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
