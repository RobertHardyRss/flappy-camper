//@ts-check

import { game } from "../game.js";
import { BackgroundImage } from "./background-image.js";

/** @type {HTMLImageElement} */ //@ts-ignore this is an image
const image = document.getElementById("path-background");

export class PathBackground extends BackgroundImage {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		super(ctx, image);
	}
}
