//@ts-check

export class SpriteHelper {
	/**
	 * @param {HTMLElement | HTMLImageElement | null} src - The image src
	 * @param {number} fps - The frames per second for the animation
	 * @param {number} frameCount - The number of frames in the animation
	 * @param {number} cols - The number of frame columns in the image
	 * @param {number} rows - the number of frame rows in the image
	 * @param {number} width - The width of one sprite frame
	 * @param {number} scaleToWidth - the width to scale the image to
	 * @param {number} height - The height of one sprite frame
	 * @param {number} sx - The starting x position in the image for the sprite, defaults to zero
	 * @param {number} sy - The starting y position in the image for the sprite, defaults to zero
	 * @param {number} scol - The starting column in the image for the sprite, defaults to one
	 * @param {number} srow - The starting row in the image for the sprite, defaults to one
	 */
	constructor(
		src,
		fps,
		frameCount,
		cols,
		rows,
		width,
		height,
		scaleToWidth,
		sx = 0,
		sy = 0,
		scol = 1,
		srow = 1
	) {
		if (src == null)
			throw "The image passed to SpriteHelper was null or undefined.  Verify your id's match when getting the image from the HTML.";
		/** @type {HTMLImageElement} */ //@ts-ignore assume we have an image
		this.src = src;
		this.fps = fps;
		this.frameCount = frameCount;
		this.cols = cols;
		this.rows = rows;
		this.spriteWidth = width;
		this.spriteHeight = height;
		this.sx = sx;
		this.sy = sy;
		this.scol = scol;
		this.srow = srow;

		// use these offsets to help position the image
		this.xOffset = 0;
		this.yOffset = 0;

		// provide helpers for the scaled width and height based on the scaleToWidth
		this.scaledWidth = scaleToWidth;
		this.scaledHeight = (height / width) * scaleToWidth;

		// get an array of frame coordinates
		/** @type {Array<FrameCoordinate>} */
		this.frames = this.#calculateFrameCoordinates();

		// the time in milliseconds since the frame changed
		this.lastFrameChange = 0;
		// the index of the current frame coordinates to use for the current frame
		this.currentFrameIndex = 0;
	}

	#calculateFrameCoordinates() {
		let frames = [];
		let x = this.sx;
		let y = this.sy;

		// Loops through the rows and columns of the sprite and calculates the frame
		// x and y cordinates based on the width and height of the sprite frame.
		// Will take into account the starting x and y position within the image
		// as well as the starting row and column.
		for (
			let row = this.srow;
			row <= this.rows && frames.length < this.frameCount;
			row++
		) {
			for (
				let col = this.scol;
				col <= this.cols && frames.length < this.frameCount;
				col++
			) {
				frames.push(new FrameCoordinate(x, y));
				x += this.spriteWidth;
			}
			x = 0;
			y += this.spriteHeight;
		}

		return frames;
	}

	getCurrentFrame() {
		return this.frames[this.currentFrameIndex];
	}

	/**
	 * @param {number} timeElapsed
	 */
	next(timeElapsed) {
		this.lastFrameChange += timeElapsed;
		if (this.lastFrameChange < 1000 / this.fps) return;
		this.lastFrameChange = 0;

		this.currentFrameIndex++;
		if (this.currentFrameIndex >= this.frames.length) {
			this.currentFrameIndex = 0;
		}
	}
}

class FrameCoordinate {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}
