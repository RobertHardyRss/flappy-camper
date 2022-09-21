//@ts-check
import { ctx, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { ObstacleManager } from "./obstacles/obstacle-manager.js";

let manager = new ObstacleManager(ctx);
manager.init();

function animate() {
	// clear the screen
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	manager.update();
	manager.draw();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
