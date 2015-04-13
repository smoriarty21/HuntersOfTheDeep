var Player = function() {
	this.hp = 100;
	this.x = 150;
	this.y = 150;
	this.height = 50;
	this.width = 175;
	this.velocity = [0, 0];
	this.speed = 20;
	this.status = "STILL";
	this.bullets = [];
	this.canvasWidth = 1100;
	this.direction = 'RIGHT';

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

	this.update = function(enemies) {
		//Bullets
		for(var i = 0; i < this.bullets.length; i++) {
			this.bullets[i]['x'] += this.bullets[i]['speed'];

			if(this.bullets[i]['x'] > this.canvasWidth + this.x) {
				this.bullets.splice(i);
			}

			for(var j = 0; j < enemies.length; j++) {
				var hit_enemy = this.checkCollision(this.bullets[i]['x'], this.bullets[i]['y'], this.bullets[i]['height'], this.bullets[i]['width'], enemies[j].x, enemies[j].y, enemies[j].height, enemies[j].width);

				if(hit_enemy) {
					this.bullets.splice(i);
					
					enemies[j].hp -= this.wep.damage;

					if(enemies[j].hp <= 0) {
						this.add_exp(enemies[j].base_xp * this.xp_bonus)
						enemies.splice(j);
					}	
				}
			}
		}

		if(this.status == 'STILL') {
			this.setVelocity(0,0);
		} else if(this.status == 'RIGHT') {
			this.direction = 'RIGHT';
			this.setVelocity(this.speed,0);
		} else if(this.status == 'LEFT') {
			this.direction = 'LEFT';
			this.setVelocity(-this.speed,0);
		} else if(this.status == 'UP') {
			this.setVelocity(0,-this.speed);
		} else if(this.status == 'DOWN') {
			this.setVelocity(0,this.speed);
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

		this.x += this.velocity[0];
		this.y += this.velocity[1];
	}

	this.draw = function(context) {
		var x = this.x;
		var y = this.y
		var direction = this.direction;

		var img = new Image();

		img.height = this.height;
		img.width = this.width;

		img.onload = function () {
			if(direction == 'RIGHT') {
				img.src = "img/sub-r.png";

				context.drawImage(img, x, y, this.width, this.height);
			} else if(direction == 'LEFT') {
				img.src = "img/sub-l.png";

				context.drawImage(img, x, y, this.width, this.height);
			} 
		}

		img.src = "img/sub-r.png";

		//Bullets
		for(var i = 0; i < this.bullets.length; i++) {
			context.fillStyle=this.wep.color;
			context.fillRect(this.bullets[i]['x'], this.bullets[i]['y'], this.bullets[i]['width'], this.bullets[i]['height']);
		}

	}

	this.setVelocity = function(x, y) {
		this.velocity[0] = x;
		this.velocity[1] = y;
	}

	this.shoot = function() {
		var bullet = this.wep;
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

	this.checkCollision = function(x1, y1, h1, w1, x2, y2, h2, w2) {
		if(x2 + w2 > x1 && x2 < x1 + w1 && y2 + h2 > y1 && y2 < y1 + h1) {
			return true;
		} else {
			return false;
		}
	}
}