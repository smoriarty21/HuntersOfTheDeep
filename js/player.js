var Player = function() {
	this.max_hp = 100;
	this.hp = this.max_hp;

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

	this.img = new Image();

	this.world_collisions = [];

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
	this.xp_for_next_level = 1000;
	this.weapon_speed_bonus = 1;
	this.weapon_dmg_bonus = 1;
	this.sub_speed_bonus = 1;
	this.hp_bonus = 1;
	this.xp_bonus = 1;
	this.treasure_bonus = 1;

	this.start_boss_fight = false;

	this.weapon = new Weapon();
	this.wep = this.weapon.generate('NORMAL');

	//Inventory
	this.inventory = new Inventory(this.img);
	this.inventory_open = false;
	this.inventory_items = [];
	this.equipped = [];
	this.max_inventory_size = 12;

	this.inventory_items.push(new ArmorGenerator('BASIC_HEAD'));
	this.inventory_items.push(new ArmorGenerator('BASIC_CHEST'));

	//Place items in inventory
	for(var i = 0; i < this.inventory_items.length; i++) {
		for(var j = 0; j < this.inventory.inventory_ui.length; j++) {
			if(this.inventory.inventory_ui[j].open && this.inventory.inventory_ui[j].type == 'SLOT') {
				this.inventory_items[i].x = this.inventory.inventory_ui[j].x + 5;
				this.inventory_items[i].y = this.inventory.inventory_ui[j].y + 5;
				this.inventory.inventory_ui[j].item_index = i;

				this.inventory.inventory_ui[j].open = false;

				break;
			}
		}
	}

	//Bounties
	this.bounty = new Bounty();
	this.current_bounties = [];

	this.in_town = false;

	this.switch_to_town = function(x, y) {
		this.in_town = true;

		this.x = x;
		this.y = y;

		this.height = 75;
		this.width = 45;

		this.draw = function(context) {
			if(this.direction == 'RIGHT') {
				this.img.src = "img/player-r.png";
			} else if(this.direction == 'LEFT') {
				this.img.src = "img/player-l.png";
			}

			context.drawImage(this.img, this.x, this.y, this.width, this.height);

			//Inventory
			if(this.inventory_open) {
				this.inventory.draw(context, this.inventory_items);
			}
		}
	}

	this.switch_to_dungeon = function() {
		this.in_town = false;

		this.height = 30;
		this.width = 100;

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

						if(enemies[j].hp <= 0 && !enemies[j].boss) {
							this.add_exp(enemies[j].base_xp * this.xp_bonus);
							world.total_dungeon_xp += enemies[j].base_xp;
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

			//Player Movement
			if(this.motion['RIGHT']) {
				this.velocity[0] = this.speed;
				this.direction = 'RIGHT';
			}

			if(this.motion['LEFT']) {
				this.velocity[0] = -this.speed;
				this.direction = 'LEFT';
			}

			if(this.motion['DOWN']) {
				this.velocity[1] = this.speed;
			}

			if(this.motion['UP']) {
				this.velocity[1] = -this.speed;
			}

			//World Collision
			this.checkWorldCollision(world);
			this.world_collisions = [];

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
			} else if(world.boss_fight_ready && !this.start_boss_fight) {
				//this.x += 50;
				this.velocity = [0,0];
				this.start_boss_fight = true;
			}

			this.x += this.velocity[0];
			this.y += this.velocity[1];
		}

		this.draw = function(context) {
			if(this.direction == 'RIGHT') {
				this.img.src = "img/sub-r.png";
			} else if(this.direction == 'LEFT') {
				this.img.src = "img/sub-l.png";
			}
			
			context.drawImage(this.img, this.x, this.y, this.width, this.height);

			//Bullets
			context.fillStyle=this.wep.color;

			for(var i = 0; i < this.bullets.length; i++) {	
				context.fillRect(this.bullets[i]['x'], this.bullets[i]['y'], this.bullets[i]['width'], this.bullets[i]['height']);
			}
		}
	}

	this.set_health = function(dif) {
		this.hp += dif;
	}

	this.add_exp = function(xp) {
		this.xp += xp;

		if(this.xp >= this.xp_for_next_level) {
			this.level++;

			this.weapon_dmg_bonus = 1;
			this.hp_bonus = 1;

			if(this.level < 3) {
				this.xp_for_next_level *= 4;				
			} else if(this.level < 4) {
				this.xp_for_next_level *= 2;
			} else {
				this.xp_for_next_level += 6000;
			}

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

					if(enemies[j].hp <= 0 && !enemies[j].boss) {
						this.add_exp(enemies[j].base_xp * this.xp_bonus);
						world.total_dungeon_xp += enemies[j].base_xp;
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

		//Player Movement
		if(this.motion['RIGHT']) {
			this.velocity[0] = this.speed;
			this.direction = 'RIGHT';
		}

		if(this.motion['LEFT']) {
			this.velocity[0] = -this.speed;
			this.direction = 'LEFT';
		}

		if(this.motion['DOWN']) {
			this.velocity[1] = this.speed;
		}

		if(this.motion['UP']) {
			this.velocity[1] = -this.speed;
		}

		//World Collision
		this.checkWorldCollision(world);
		this.world_collisions = [];

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
		} else if(world.boss_fight_ready && !this.start_boss_fight) {
			//this.x += 50;
			this.velocity = [0,0];
			this.start_boss_fight = true;
		}

		this.x += this.velocity[0];
		this.y += this.velocity[1];
	}

	this.draw = function(context) {
		if(this.direction == 'RIGHT') {
			this.img.src = "img/sub-r.png";
		} else if(this.direction == 'LEFT') {
			this.img.src = "img/sub-l.png";
		}
		
		context.drawImage(this.img, this.x, this.y, this.width, this.height);

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
		for(var i = 0; i < world.images.length; i++) {
			if(world.images[i]['collision']) {
				if(world.images[i]['x'] > this.x - 500 && world.images[i]['x'] < this.x + this.width + 400) {
					var collsion = this.checkCollision(this.x, this.y, this.height, this.width, world.images[i]['x'], world.images[i]['y'], world.images[i]['height'], world.images[i]['width']);
					
					if(collsion == 'TOP') {
						this.y += this.speed;
					}

					if(collsion == 'BOTTOM') {
						this.y -= this.speed;
					}

					if(collsion == 'LEFT') {
						this.x += this.speed;
					}

					if(collsion == 'RIGHT') {
						this.x -= this.speed;
					}
				}
			}
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

	this.check_inventory_full = function() {
		if(this.inventory.length < this.max_inventory_size) {
			return false;
		} else {
			return true;
		}
	}
}