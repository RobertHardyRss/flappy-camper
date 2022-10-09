//@ts-check
import { ObstacleManager } from "./obstacles/obstacle-manager.js";
import { EVENTS, KARMA_ON_TRAIL, STAMINA_ON_TRAIL } from "./constants.js";
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
				const topBuffer = 68;
				if (this.collisionZone.top - topBuffer > o.y + o.h)
					return false;
				if (this.collisionZone.bottom < o.y) return false;
				return true;
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
	 * @param {Collidable[]} collidables
	 */
	getCollidablesOfInterest(collidables) {
		return collidables.filter(this.isInPlayerZone, this);
	}

	/**
	 * @param {number} timeElapsed
	 */
	update(timeElapsed) {
		this.collisionZone.update();

		this.updateCollidables(timeElapsed);
		this.updateCollectables();
	}

	updateCollectables() {
		const collectables = this.getCollidablesOfInterest([
			...this.om.food,
			...this.om.trash,
		]);

		// if we don't have any collectables that the player
		// can pickup, return and do nothing
		if (!collectables.length) return;

		this.collected = collectables.filter(this.isColliding, this);

		this.collected.forEach((c) => {
			c.isCollected = true;
			if (c.staminaImpact) {
				let event = new CustomEvent(EVENTS.staminaChange, {
					detail: c.staminaImpact,
				});
				window.dispatchEvent(event);
			}

			if (c.karmaImpact) {
				let event = new CustomEvent(EVENTS.karmaChange, {
					detail: c.karmaImpact,
				});
				window.dispatchEvent(event);
			}
		});
	}

	/**
	 * @param {number} timeElapsed
	 */
	updateCollidables(timeElapsed) {
		// we will send collision events for peaks, forests
		// and we will also broadcast on-trail events when we
		// are not colliding with bad stuff. We will broadcast
		// these events based on the broadcastInterval value.

		this.lastBroadcast += timeElapsed;
		if (this.lastBroadcast < this.broadcastInterval) return;
		this.lastBroadcast = 0;

		const tops = this.getCollidablesOfInterest(this.om.peaks);
		const lowestTopHeight = tops
			.map((c) => c.h) // map all tops to just an array of heights (h)
			.reduce((a, b) => {
				// reduce all heights to just the largest/lowest one
				return a > b ? a : b;
			});
		const bottoms = this.getCollidablesOfInterest(this.om.forests);

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
		this.karmaImpact = KARMA_ON_TRAIL;
		this.staminaImpact = STAMINA_ON_TRAIL;
	}
}

class CollisionZone {
	/**
	 * @param {Player} player
	 */
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
