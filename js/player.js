var Player = function() {
	this.hp = 100;
	this.x = 300;
	this.y = 300;
	this.height = 30;
	this.width = 100;
	this.velocity = [0, 0];
	this.speed = 20;
	this.status = "STILL";
	this.bullets = [];
	this.canvasWidth = 1100;
	this.direction = 'RIGHT';
	this.gold = 0;

	this.remove_enemies = []
	this.remove_bullets = []

	this.collision = 'NONE';

	this.motion = {
		'LEFT': 0,
		'RIGHT': 0,
		'UP': 0,
		'DOWN': 0
	};

	//Player Stats
	this.level = 1;
	this.xp = 0;
	this.xp_for_next_level = 100;
	this.weapon_speed_bonus = 1;
	this.weapon_dmg_bonus = 1;
	this.sub_speed_bonus = 1;
	this.hp_bonus = 1;
	this.xp_bonus = 1;
	this.treasure_bonus = 1;

	this.weapon = new Weapon();
	this.wep = this.weapon.generate('NORMAL');

	//Bounties
	this.bounty = new Bounty();
	this.current_bounties = [];

	this.set_health = function(dif) {
		this.hp += dif;
	}

	this.add_exp = function(xp) {
		this.xp += xp;

		if(this.xp >= this.xp_for_next_level) {
			this.level++;

			this.weapon_dmg_bonus = 1;
			this.hp_bonus = 1;

			this.xp_for_next_level *= 5;

			this.weapon_speed_bonus += 0.05;
			this.weapon_dmg_bonus += 0.05;
			this.sub_speed_bonus += 0.05;
			this.hp_bonus += 0.05;
			this.xp_bonus += 0.05;
			this.treasure_bonus += 0.05;
		}
	}

	this.get_health = function() {
		return this.hp;
	}

	this.update = function(enemies, world) {
		//Bounties
		if(!this.current_bounties.length) {
			this.current_bounties.push(this.bounty.generate());
		}

		//Bullets
		for(var i = 0; i < this.bullets.length; i++) {
			this.bullets[i]['x'] += this.bullets[i]['speed'];

			if(this.bullets[i]['x'] > this.canvasWidth + this.x) {
				this.remove_bullets.push(i);
			}

			for(var j = 0; j < enemies.length; j++) {
				var hit_enemy = this.checkCollision(this.bullets[i]['x'], this.bullets[i]['y'], this.bullets[i]['height'], this.bullets[i]['width'], enemies[j].x, enemies[j].y, enemies[j].height, enemies[j].width);

				if(hit_enemy) {
					this.remove_bullets.push(i);
					
					enemies[j].hp -= this.wep.damage;

					if(enemies[j].hp <= 0) {
						this.add_exp(enemies[j].base_xp * this.xp_bonus);
						this.remove_enemies.push(j);
						break;
					}	
				}
			}

			for(var q = 0; q < this.remove_enemies.length; q++) {
				enemies.splice(q, 1);
			}
			this.remove_enemies = [];

			for(var x = 0; x < this.remove_bullets.length; x++) {
				this.bullets.splice(x, 1);
			}
			this.remove_bullets = [];
		}

		if(this.status == 'STILL') {
			this.setVelocity(0,0);
		} else if(this.status == 'RIGHT') {
			this.direction = 'RIGHT';
			this.setVelocity(this.speed,0);
			this.motion['RIGHT'] = 1;
		} else if(this.status == 'LEFT') {
			this.direction = 'LEFT';
			this.setVelocity(-this.speed,0);
			this.motion['LEFT'] = 1;
		} else if(this.status == 'UP') {
			this.setVelocity(0,-this.speed);
			this.motion['UP'] = 1;
		} else if(this.status == 'DOWN') {
			this.setVelocity(0,this.speed);
			this.motion['DOWN'];
		} else if(this.status == 'TOPWALL') {
			this.setVelocity(0,0);
			this.y += 1;
			this.status = 'STILL';
		} else if(this.status == 'BOTTOMWALL') {
			this.setVelocity(0,0);
			this.y -= 1;
			this.status = 'STILL';
		} else if(this.status == 'RIGHTWALL') {
			this.setVelocity(0,0);
			this.x -= 1;
			this.status = 'STILL';
		} else if(this.status == 'LEFTWALL') {
			this.setVelocity(0,0);
			this.x += 1;
			this.status = 'STILL';
		}

		//World Collision
		world_collision = this.checkWorldCollision(world);
		
		if(world_collision == 'TOP') {
			this.velocity[1] = this.speed;
		} else if(world_collision == 'BOTTOM') {
			this.velocity[1] = -this.speed;
		} else if(world_collision == 'RIGHT') {
			this.velocity[0] = -this.speed;
		} else if(world_collision == 'LEFT') {
			this.velocity[0] = this.speed;
		}

		//Check for entering boss fight
		if(!world.boss_fight_ready) {
			if(world.boss_fight && !world.boss_camera_set) {
				this.velocity[0] = -5;
				this.velocity[1] = -5;
			}

			if(world.boss_x_in_place && !world.boss_fight_ready) {
				this.velocity[0] = 0;
			}

			if(world.boss_y_in_place && !world.boss_fight_ready) {
				this.velocity[1] = 0;
			}
		}

		this.x += this.velocity[0];
		this.y += this.velocity[1];
	}

	this.draw = function(context) {
		var img = new Image();
		
		if(this.direction == 'RIGHT') {
			img.src = "img/sub-r.png";
		} else if(this.direction == 'LEFT') {
			img.src = "img/sub-l.png";
		}
		
		context.drawImage(img, this.x, this.y, this.width, this.height);

		//Bullets
		context.fillStyle=this.wep.color;

		for(var i = 0; i < this.bullets.length; i++) {	
			context.fillRect(this.bullets[i]['x'], this.bullets[i]['y'], this.bullets[i]['width'], this.bullets[i]['height']);
		}

	}

	this.setVelocity = function(x, y) {
		this.velocity[0] = x;
		this.velocity[1] = y;
	}

	this.shoot = function() {
		//var bullet = this.wep;
		//this.weapon = new Weapon();
		var wep2 = new Weapon();
		var bullet = wep2.generate('NORMAL');
		bullet['y'] = (this.y + (this.height / 2) - (bullet['height'] / 2)) + 7;

		if(this.direction == 'LEFT') {
			bullet['x'] = this.x + 5;

			if(bullet['speed'] > 0) {
				bullet['speed'] *= -1;
			}
		} else if(this.direction == 'RIGHT') {
			bullet['x'] = this.x + this.width - 45;

			if(bullet['speed'] < 0) {
				bullet['speed'] *= -1;
			}
		}

		this.bullets.push(bullet);
	}

	this.checkWorldCollision = function(world) {
		var collisions = [];

		for(var i = 0; i < world.images.length; i++) {
			if(world.images[i]['collision']) {
				if(world.images[i]['x'] > this.x - 200 && world.images[i]['x'] < this.x + this.width + 200) {
					var collided = this.checkCollision(this.x, this.y, this.height, this.width, world.images[i]['x'], world.images[i]['y'], world.images[i]['height'], world.images[i]['width'], 1);
					collisions.push(collided);
				}
			}
		}
		
		for(var j = 0; j < collisions.length; j++) {
			if(collisions[j]) {
				return collisions[j];
			}
		}
	}

	this.checkCollision = function(x1, y1, h1, w1, x2, y2, h2, w2, set_check_variable) {
		if(x2 + w2 > x1 && x2 < x1 + w1 && y2 + h2 > y1 && y2 < y1 + h1) {
			//if(set_check_variable) {
				if(y1 > y2 + h2 - 25 && y1 < y2 + h2) {
					return 'TOP';
				} else if(y1 + h1 > y2 - 25 && y1 + h1 < y2 + 25) {
					return 'BOTTOM';
				} else if(x1 + w1 > x2 - 25 && x1 + w1 < x2 + 25) {
					return 'RIGHT';
				} else if(x1 > x2 + w2 - 25 && x1 < x2 + w2 + 25) {
					return 'LEFT';
				}
			//}
			//return true;
		} else {
			//this.collision = 'NONE';

			return false;
		}
	}
}