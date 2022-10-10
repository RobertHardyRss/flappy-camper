//@ts-check
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const LOWEST_REACHABLE_POINT = CANVAS_HEIGHT - 25;

/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

/** @type {CanvasRenderingContext2D} */
//@ts-ignore
export const ctx = canvas.getContext("2d");
if (!ctx) throw "ctx is null or undefined!";

export const EVENTS = {
	onTrail: "fc_ontrail",
	offTrail: "fc_offtrail",
	karmaChange: "fc_karma",
	staminaChange: "fc_stamina",
	gameOver: "fc_gameover",
};

// Game scoring contants
export const KARMA_TRASH_BOOST = 10;
export const KARMA_OFF_TRAIL = -5;
export const KARMA_ON_TRAIL = 0.2;
export const STAMINA_FOOD_BOOST = 50;
export const STAMINA_OFF_TRAIL = -1;
export const STAMINA_HIT_PEAK = -10;
export const STAMINA_ON_TRAIL = 0.1;
