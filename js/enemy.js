var Enemy = function() {
	this.status = 'HUNTING';
	this.type = '';

	this.hp = 20;

	this.x = 700;
	this.y = 250;

	this.height = 20;
	this.width = 70;
	this.worldWidth = 200;
	this.worldHeight = 1200;

	this.base_xp = 100;

	this.velocity = [0, 0];
	this.speed = 10;
	
	this.count = 0;

	//TODO: REMOVE THIS SHIT!
	this.playerHeight = 50;
	this.damage = 5;

	this.viewRange = 100;

	//Attack AI Variables
	this.direction_switched = false;
	this.backed_distance = 0;
	this.attack_status = null;

	this.direction = 'LEFT';

	this.image = new Image();

	this.playerInRange = false;

	this.utils = new Utils();

	this.generate = function(enemy_type) {
		switch(enemy_type) {
			case 'SHARK':
				this.status = 'HUNTING';
				this.type = 'SHARK';
				this.hp = 20;
				this.x = 700;
				this.y = 250;
				this.height = 20;
				this.width = 70;
				this.base_xp = 100;
				this.velocity = [0, 0];
				this.speed = 2;
				this.worldWidth = 2000;
				this.worldHeight = 1200;
				this.count = 0;
				this.playerHeight = 50;
				this.damage = 5;

				this.viewRange = 100;

				//Attack AI Variables
				this.direction_switched = false;
				this.backed_distance = 0;
				this.attack_status = null;

				this.direction = 'LEFT';

				this.image = new Image();
				this.image.src = 'img/shark.png';

				this.playerInRange = false;

				break;
		}

		return this;
	}

	this.set_health = function(dif) {
		this.hp += dif;
	}

	this.get_health = function() {
		return this.hp;
	}

	this.update = function(playerX, playerY, player) {
		if(this.type == 'SHARK') {
			if(this.direction == 'RIGHT') {
				this.image.src = 'img/shark-r.png';
			} else {
				this.image.src = 'img/shark.png';
			}

			if(this.status == 'HUNTING') {
				var rng = this.utils.random(100);

				if(rng == 100) {
					this.velocity[1] = -(this.speed / 4);
				} else if(rng == 1) {
					this.velocity[1] = this.speed / 4;
				}

				if(this.y < 0) {
					this.velocity[1] = this.speed / 4;
				} else if((this.y + this.height) + (playerY + this.playerHeight) > this.worldHeight - 100) {
					this.velocity[1] = -(this.speed / 4);
				}

				if(this.x + playerX < 0 && this.direction == 'LEFT') {
					this.direction = 'RIGHT';
				} else if (this.x + this.width + playerX > (this.worldWidth) && this.direction == 'RIGHT') {
					this.direction = 'LEFT';
				}

				if(this.direction == 'LEFT') {
					this.velocity[0] = -this.speed;
				} else {
					this.velocity[0] = this.speed;
				}

				var rng = this.utils.random(25); 

				if(rng == 1) {
					this.velocity[1] = 0;
				}

				//Check if player in range
				if(this.direction == 'LEFT') {
					if(this.x + this.width > playerX && playerX + 175 > this.x - this.viewRange) {
						if(playerY < this.y + this.height + (this.viewRange * 2) && playerY + 50 > this.y - (this.viewRange * 2)) {
							this.status = 'ATTACK';
							this.attack_status = 'BACK';
						}	
					} 
				} else if(this.direction == 'RIGHT') {
					if(this.x + this.width + this.viewRange > playerX && this.x < playerX + 175) {
						if(playerY < this.y + this.height + (this.viewRange * 2) && playerY + 50 > this.y - (this.viewRange * 2)) {
							this.status = 'ATTACK';
							this.attack_status = 'BACK';
						}		
					}
				}
			} else if(this.status == 'ATTACK') {
				if(this.attack_status == 'BACK') {
					this.damage_done = false;
					if(this.direction == 'LEFT' && !this.direction_switched) {
						this.direction = 'RIGHT'
						this.velocity[0] = this.speed * 4;

						this.direction_switched = true;
					} else if(this.direction == 'RIGHT' && !this.direction_switched) {
						this.direction = 'LEFT'
						this.velocity[0] = -this.speed * 4;

						this.direction_switched = true;
					}

					if(this.backed_distance > 300 + this.width) {
						this.backed_distance = 0;
						this.direction_switched = false;
						this.attack_status = 'CHARGE';
					}

					this.backed_distance += this.speed * 4;
				} else if(this.attack_status == 'CHARGE') {
					this.velocity[0] = 0;
					this.velocity[1] = 0;

					if(this.direction == 'RIGHT' && !this.direction_switched) {
						this.direction = 'LEFT';
						this.direction_switched = true;
					} else if(this.direction == 'LEFT' && !this.direction_switched) {
						this.direction = 'RIGHT';
						this.direction_switched = true;
					}

					if(playerX + 170  < this.x) {
						this.velocity[0] = -(this.speed * 1.5);
					} else if(playerX + 10 > this.x + this.width) {
						this.velocity[0] = this.speed * 1.5;
					} else {
						this.velocity[0] = 0;
					}

					if(playerY + this.speed < this.y) {
						this.velocity[1] = -this.speed;
					} else if(playerY > this.y + this.speed) {
						this.velocity[1] = this.speed;
					} else {
						this.velocity[1] = 0;
					}

					//Check if attack landed
					var hit_player = this.checkCollision(playerX, playerY, 50, 175, this.x, this.y, this.height, this.width);
					
					if(hit_player) {
						player.set_health(-this.damage);

						this.backed_distance = 0;
						this.direction_switched = false;
						this.attack_status = 'BACK';
					}
				}
			}
			this.x += this.velocity[0];
			this.y += this.velocity[1];
		}
		if(this.velocity[0] > 4) {
			this.velocity[0] = 4;
		} else if(this.velocity[0] < -4) {
			this.velocity[0] = -4;
		}

		if(this.velocity[1] > 4) {
			this.velocity[1] = 4;
		} else if(this.velocity[1] < -4) {
			this.velocity[1] = -4;
		}
		//this.x += this.velocity[0];
		//this.y += this.velocity[1];
	}

	this.draw = function(context) {

	}

	this.shoot = function() {
		var bullet = this.wep;
		bullet['x'] = this.x + this.width;
		bullet['y'] = (this.y + (this.height / 2) - (bullet['height'] / 2));

		this.bullets.push(bullet);
	}

	this.checkPlayer = function(x, y, width, height) {
		this.checkCollision(this.x, this.y, this.height, this.width, x, y, height, width);
	}

	this.checkCollision = function(x1, y1, h1, w1, x2, y2, h2, w2) {
		if(x2 + w2 > x1 && x2 < x1 + w1 && y2 + h2 > y1 && y2 < y1 + h1) {
			this.playerInRange = true;
			return true;
		} else {
			this.playerInRange = false;
			return false;
		}
	}
}