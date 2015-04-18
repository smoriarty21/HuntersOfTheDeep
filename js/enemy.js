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
			//Normal Enemies
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
				this.speed = 10;
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

				this.checkCollision = function(x1, y1, h1, w1, x2, y2, h2, w2) {
					if(x2 + w2 >= x1 && x2 <= x1 + w1 && y2 + h2 >= y1 && y2 <= y1 + h1) {
						if(y1 >= y2 + h2 - 25 && y1 <= y2 + h2) {
							return 'TOP';
						} else if(y1 + h1 >= y2 - 25 && y1 + h1 <= y2 + 25) {
							return 'BOTTOM';
						}

						if(x1 + w1 >= x2 - 25 && x1 + w1 <= x2 + 25) {
							return 'RIGHT';
						} else if(x1 >= x2 + w2 - 25 && x1 <= x2 + w2 + 25) {
							return 'LEFT';
						}
					} else {
						return false;
					}
				}

				this.update = function(playerX, playerY, player, world) {
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

					for(var i = 0; i < world.images.length; i++) {
						if(world.images[i]['collision'] && world.images[i]['x'] > this.x - 500 && world.images[i]['x'] < this.x + 500) {
							collision_check = this.checkCollision(this.x, this.y, this.height, this.width, world.images[i]['x'], world.images[i]['y'], world.images[i]['height'], world.images[i]['width']);
							
							if(collision_check) {
								if(collision_check == 'TOP') {
									this.y += this.speed;
									this.velocity[1] = this.speed;
								} else if(collision_check == 'BOTTOM') {
									this.y -= this.speed;
									this.velocity[1] = -this.speed;
								} else if(collision_check == 'RIGHT') {
									this.x -= this.speed;
									this.velocity[0] = -this.speed;
								} else if(collision_check == 'LEFT') {
									this.x += this.speed;
									this.velocity[0] = this.speed;
								}
							}
						}
					}

					this.x += this.velocity[0];
					this.y += this.velocity[1];
				}

				break;

			//Bosses
			case 'WORM':
				this.status = 'STILL';
				this.boss = true;

				this.hp = 1000;

				this.x = 0;
				this.y = 0;
				this.set_x = 0;

				this.height = 70;
				this.width = 200;

				this.base_xp = 500;

				this.velocity = [0, 0];
				this.speed = 12;

				this.worldWidth = 2000;
				this.worldHeight = 1200;

				this.count = 0;

				this.boss_area_max_y = 0;
				this.boss_area_min_y = 0;

				this.boss_area_max_x = 0;
				this.boss_area_min_x = 0;

				this.playerHeight = 50;

				this.damage = 20;

				//Attack AI Variable
				this.direction = 'LEFT';
				this.seek_beams = 0;
				this.action_start = false;

				this.image = new Image();
				this.image.src = 'img/worm-boss.png';

				this.playerInRange = false;

				this.velocity = [-this.speed, -this.speed];

				this.update = function(playerX, playerY, player, world) {
					if(this.status == 'BEAM') {
						if(!this.action_start) {
							this.velocity[0] = 0;
							this.velocity[1] = this.speed;
							this.action_start = true;
						}

						var rng = this.utils.random(600);

						if(rng == 1) {
							this.status = 'CHARGE';
							this.action_start = false;
						} else if(rng == 2) {
							this.status = 'RAM';
							this.action_start = false;
						}
					} else if(this.status == 'CHARGE') {
						if(!this.action_start) {
							this.velocity[0] = -this.speed;
							this.action_start = true;
						}

						this.velocity[1] = 0;
					} else if(this.status == 'SWIMBACK') {
						if(!this.action_start) {
							this.velocity[0] = this.speed;
							this.action_start = true;
						}

						this.velocity[1] = 0;

						if(this.x + this.width > world.boss_x - world.x - 175) {
							this.status = 'BEAM';
							this.action_start = false;
						}
					} else if(this.status == 'RAM') {
						if(this.y > player.y&& this.y < player.y + this.speed) {
							this.status = 'CHARGE';
							this.action_start = false;
							return true;
						}else if(this.y < player.y) {
							this.velocity[1] = this.speed;
						} else if(this.y > player.y) {
							this.velocity[1] = -this.speed;
						}
					}

					for(var i = 0; i < world.images.length; i++) {
						if(world.images[i]['collision'] && world.images[i]['x'] > this.x - 500 && world.images[i]['x'] < this.x + 500) {
							collision_check = this.checkCollision(this.x, this.y, this.height, this.width, world.images[i]['x'], world.images[i]['y'], world.images[i]['height'], world.images[i]['width']);

							if(collision_check) {
								if(collision_check == 'TOP') {
									this.y += this.speed;
									this.velocity[1] = this.speed;
								} else if(collision_check == 'BOTTOM') {
									this.y -= this.speed;
									this.velocity[1] = -this.speed;
								} else if(collision_check == 'RIGHT') {
									this.x -= this.speed;
									this.velocity[0] = -this.speed;
								} else if(collision_check == 'LEFT') {
									this.x += this.speed;
									this.velocity[0] = this.speed;

									if(this.status == 'CHARGE') {
										this.status = 'SWIMBACK';
										this.action_start = false;
									}
								}
							}
						}
					}

					if(this.status != 'STILL') {
						this.x += this.velocity[0];
						this.y += this.velocity[1];
					}
				}

				this.checkCollision = function(x1, y1, h1, w1, x2, y2, h2, w2) {
					if(x2 + w2 >= x1 && x2 <= x1 + w1 && y2 + h2 >= y1 && y2 <= y1 + h1) {
						if(y1 >= y2 + h2 - 25 && y1 <= y2 + h2) {
							return 'TOP';
						} else if(y1 + h1 >= y2 - 25 && y1 + h1 <= y2 + 25) {
							return 'BOTTOM';
						}

						if(x1 + w1 >= x2 - 25 && x1 + w1 <= x2 + 25) {
							return 'RIGHT';
						} else if(x1 >= x2 + w2 - 25 && x1 <= x2 + w2 + 25) {
							return 'LEFT';
						}
					} else {
						return false;
					}
				}

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