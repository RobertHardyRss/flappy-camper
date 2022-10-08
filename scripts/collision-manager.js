//@ts-check
import { ObstacleManager } from "./obstacles/obstacle-manager.js";
import { EVENTS } from "./constants.js";
import { Player } from "./player.js";
import { Collidable, collidableType } from "./obstacles/collidable.js";

export class CollisionManager {
	/**
	 * @param {Player} player
	 * @param {ObstacleManager} obstacleManager
	 */
	constructor(player, obstacleManager) {
		this.player = player;
		this.om = obstacleManager;

		/** @type {Array<Collidable>} */
		this.collisions = [];

		this.collisionZone = new CollisionZone(player);
		this.lastBroadcast = 0;
		this.broadcastInterval = 250;
	}

	/**
	 * @param {Collidable} o
	 */
	isColliding(o) {
		switch (o.type) {
			case collidableType.Peak:
				// if player is top is above the peak, we are colliding
				if (this.collisionZone.top <= o.y + o.h) {
					return true;
				}
				break;
			case collidableType.Forest:
				// if player bottom is below the forest, we are colliding
				if (this.collisionZone.bottom >= o.y) {
					return true;
				}
				break;
			default:
				return false;
		}
	}

	/**
	 * @param {Collidable} o
	 */
	isInPlayerZone(o) {
		// if o is to the right of the player, not in zone
		if (o.x > this.collisionZone.right) return false;
		// if o is past the player, not in zone
		if (o.x + o.w < this.collisionZone.left) return false;
		// obstacle is withing the palyer's zone and can be collided with
		return true;
	}

	/**
	 * @param {Collidable[]} obstacles
	 */
	getObstaclesOfInterest(obstacles) {
		return obstacles.filter(this.isInPlayerZone, this);
	}

	/**
	 * @param {number} timeElapsed
	 */
	update(timeElapsed) {
		this.collisionZone.update();

		this.lastBroadcast += timeElapsed;
		if (this.lastBroadcast < this.broadcastInterval) return;
		this.lastBroadcast = 0;

		const tops = this.getObstaclesOfInterest(this.om.topObstacles);
		const lowestTopHeight = tops
			.map((c) => c.h)
			.reduce((p, c) => {
				return p > c ? p : c;
			});
		const bottoms = this.getObstaclesOfInterest(this.om.bottoms);

		this.collisions = [...tops, ...bottoms].filter(this.isColliding, this);
		const data = new CollisionEventData();
		data.lowestTopHeight = lowestTopHeight;

		if (!this.collisions.length) {
			// not colliding, so we are on the trail
			this.sendOnTrailEvent(data);
		} else {
			data.isPlayerOnTrail = false;
			data.karmaImpact = this.collisions[0].karmaImpact;
			data.staminaImpact = this.collisions[0].staminaImpact;
			this.sendOffTrail(data);
		}
	}

	/**
	 * @param {CollisionEventData} data
	 */
	sendOnTrailEvent(data) {
		let event = new CustomEvent(EVENTS.onTrail, {
			detail: data,
		});
		window.dispatchEvent(event);
	}

	/**
	 * @param {CollisionEventData} [data]
	 */
	sendOffTrail(data) {
		let event = new CustomEvent(EVENTS.offTrail, {
			detail: data,
		});
		window.dispatchEvent(event);
	}
}

export class CollisionEventData {
	constructor() {
		this.isPlayerOnTrail = true;
		this.lowestTopHeight = 0;
		this.karmaImpact = 1;
		this.staminaImpact = 1;
	}
}

class CollisionZone {
	constructor(player) {
		this.player = player;
		this.left = player.x;
		this.right = player.x + player.w;
		this.top = player.y;
		this.bottom = player.y + player.h;
	}
	update() {
		this.top = this.player.y;
		this.bottom = this.player.y + this.player.h;
	}
}
