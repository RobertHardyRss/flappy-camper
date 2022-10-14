//@ts-check
import { PathBackground } from "./background-images/path-background.js";
import { CollisionManager } from "./collision-manager.js";
import {
	ctx,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	EVENTS,
	canvas,
} from "./constants.js";
import { game } from "./game.js";
import { ObstacleManager } from "./obstacles/obstacle-manager.js";
import { Player } from "./player.js";
import { GameOverScene } from "./scenes/game-over.js";
import { StartScene } from "./scenes/start.js";
import { Scoreboard } from "./scoreboard.js";

let manager = new ObstacleManager(ctx);
manager.init();

let path = new PathBackground(ctx);
let score = new Scoreboard(ctx);
let p = new Player(ctx, score);
let collisions = new CollisionManager(p, manager);

let start = new StartScene(ctx);
start.draw();

let currentTime = 0;
/**
 * @param {number} timestamp
 */
function gameLoop(timestamp) {
	let timeElapsed = timestamp - currentTime;
	currentTime = timestamp;

	// clear the screen
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	path.update();
	manager.update(timeElapsed);
	p.update(timeElapsed);
	collisions.update(timeElapsed);
	score.update(timeElapsed);

	path.draw();
	manager.draw();
	p.draw();
	score.draw();

	if (score.trailKarma > 0) {
		requestAnimationFrame(gameLoop);
	} else {
		let gameOver = new GameOverScene(ctx, score);
		gameOver.draw();
	}
}

window.addEventListener(EVENTS.startGame, () => {
	requestAnimationFrame(gameLoop);
});

window.addEventListener(EVENTS.restartGame, () => {
	game.reset();

	manager = new ObstacleManager(ctx);
	manager.init();

	path = new PathBackground(ctx);
	score = new Scoreboard(ctx);
	p = new Player(ctx, score);
	collisions = new CollisionManager(p, manager);

	requestAnimationFrame(gameLoop);
});
