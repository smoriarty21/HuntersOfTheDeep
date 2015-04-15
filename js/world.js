function World() {
	this.x = 0;
	this.y = 0;
	this.velocity = [0, 0];
	this.height = 1200;
	this.width = 2200;
	this.status = 'STILL';
	this.canvasHeight = 600;
	this.canvasWidth = 1100;
	this.speed = 20;
	this.weeds = [];
	this.ground = [];
	this.images = [];
	this.enemies = [];

	this.cell_height = 50;
	this.cell_width = 50;

	this.util = new Utils();

	//Town
	this.bounty_board = new BountyBoard(this);

	this.update = function(playerX, playerY, player) {
		this.setVelocity(0,0);

		if(this.status == 'STILL') {
			this.setVelocity(0,0);
		} else if(this.status == 'RIGHT') {
			if(this.x + this.width > this.canvasWidth) { this.setVelocity(-this.speed, 0); }
		} else if(this.status == 'LEFT') {
			if(this.x < 0) { this.setVelocity(this.speed, 0); }
		} else if(this.status == 'UP') {
			if(this.y < 0) { this.setVelocity(0, this.speed); }
		} else if(this.status == 'DOWN') {
			if(this.y + this.height > this.canvasHeight) { this.setVelocity(0, -this.speed); }
		}

		//background
		this.x += this.velocity[0];
		this.y += this.velocity[1];

		for(var i = 0; i < this.images.length; i++) {
			this.images[i]['x'] += this.velocity[0];
			this.images[i]['y'] += this.velocity[1];
		}

		//Town
		world.bounty_board.update(this.velocity[0], this.velocity[1], player);

		//Enemies
		for(var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update(playerX, playerY, player);

			this.enemies[i].x += this.velocity[0];
			this.enemies[i].y += this.velocity[1];
		}

		//Trap Doors
		for(var i = 0; i < this.images.length; i++) {
			if(this.images[i]['trap_door']) {
				if(player.x > this.images[i]['x'] + this.images[i]['width']) {
					this.images[i]['trap_door'] = false;
					this.images[i]['collision'] = true;
					this.images[i]['image'].src = 'img/sand.jpg';
				}
			}
		}
	}

	this.setVelocity = function(x, y) {
		this.velocity[0] = x;
		this.velocity[1] = y;
	}

	this.draw = function(context) {
		for(var i = 0; i < this.images.length; i++) {
			context.drawImage(this.images[i]['image'], this.images[i]['x'], this.images[i]['y'], this.images[i]['width'], this.images[i]['height']);
		}

		//Town
		this.bounty_board.draw(context);

		//Enemies
		for(var i = 0; i < this.enemies.length; i++) {
			context.drawImage(this.enemies[i].image, this.enemies[i].x, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height);
		}
	}

	//World Generators
	this.generateDungeon = function(player) {
		var boss_area_size = 1150;
		cave_walls = [];
		cave_water = [];
		
		rng = this.util.random(3);
		bot_rng = this.util.random(5);
		
		for(var i = 0 ; i < this.width -  boss_area_size; i += 50) {
			change_rng = this.util.random(5);
			bot_change_rng = this.util.random(5);
			
			if(change_rng == 1) {
				rng_shift = this.util.random(2);
				rng_direct = this.util.random(2);
				
				if(rng_direct == 1) {
					rng += rng_shift;
				} else {
					rng -= rng_shift;
				}
			} else if(change_rng == 2) {
				rng++;
			} else if(change_rng == 3 && rng >= this.cell_padding * 2) {
				rng--;
			} else if(change_rng == 5) {
				rng += 2;
			} else if(change_rng == 5 && rng >= this.cell_padding * 3) {
				if(rng > 2) {
					rng -= 2;
				} else {
					rng -= 1;
				}
			}

			if(rng < 1) {
				rng += 1;
			} else if (rng > 5) {
				rng -= 2;
			}
			
			if(bot_change_rng == 1) {
				bot_rng = this.util.random(2);
			} else if(change_rng == 2) {
				bot_rng++;
			} else if(bot_change_rng == 3 && bot_rng >= this.cell_padding * 2) {
				bot_rng--;
			} else if(bot_change_rng == 5) {
				bot_rng += 2;
			} else if(bot_change_rng == 5 && bot_rng >= this.cell_padding * 3) {
				bot_rng -= 2;
			}
			
			if(bot_rng < 1) {
				bot_rng += 1;
			} else if (bot_rng > 5) {
				bot_rng -= 1;
			}
		
			for(var j = 0; j < this.height; j += 50) {
				dungeon_part = {};
				dungeon_part['x'] = i;
				dungeon_part['y'] = j;
				dungeon_part['height'] = 50;
				dungeon_part['width'] = 50;
				dungeon_part['image'] = new Image();
					
				if(j < (rng * this.cell_height)  || j >= this.height - (this.cell_height * bot_rng)) {
					dungeon_part['image'].src = 'img/sand.jpg';
					dungeon_part['collision'] = true;
				} else {
					dungeon_part['image'].src = 'img/water.jpg';
					dungeon_part['collision'] = false;
				}
				
				cave_walls.push(dungeon_part);
			}
		}

		//Boss Area
		for(var i = this.width -  boss_area_size; i < this.width; i += 50) {
			for(var j = 0; j < this.height; j += 50) {
				dungeon_part = {};
				dungeon_part['x'] = i;
				dungeon_part['y'] = j;
				dungeon_part['height'] = 50;
				dungeon_part['width'] = 50;
				dungeon_part['image'] = new Image();

				if(i == this.width -  boss_area_size + 50) {
					if(j >= (this.height / 2) - 100 && j < (this.height / 2) + 100) {
						dungeon_part['image'].src = 'img/water.jpg';
						dungeon_part['collision'] = false;
						dungeon_part['trap_door'] = true;
					} else {
						dungeon_part['image'].src = 'img/sand.jpg';
						dungeon_part['collision'] = true;
					}
				} else if(i == this.width - 50) {
					dungeon_part['image'].src = 'img/sand.jpg';
					dungeon_part['collision'] = true;
				} else if(j < 300) {
					dungeon_part['image'].src = 'img/sand.jpg';
					dungeon_part['collision'] = true;
				} else if( j > (this.height / 2) + 200) {
					dungeon_part['image'].src = 'img/sand.jpg';
					dungeon_part['collision'] = true;
				} else {
					dungeon_part['image'].src = 'img/water.jpg';
					dungeon_part['collision'] = false;
				}
				cave_walls.push(dungeon_part);
			}
		}
		
		this.images = cave_walls;

		//Enemies
		var rng = this.util.random(5);

		for(var i = 0; i < rng; i++) {
			var badGuy = new Enemy();
			badGuy.x = this.util.random(this.width - 400) + 1000;

			var  bottom_range = this.height - 300;
			badGuy.y = this.util.random(bottom_range - 300) + 300;
			this.enemies.push(badGuy);
		}
	
		player.y = 500;
	}

	this.generate_town = function() {
		worldParts = [];

		//background
		var lastX = 0;

		for(var i = 0; i < this.width; i += 50) {
			bkg = {};
			bkg['x'] = lastX;
			bkg['y'] = 0;
			bkg['height'] = 50;
			bkg['width'] = 50;
			bkg['image'] = new Image();
			bkg['image'].src = 'img/water-top.jpg';

			this.images.push(bkg);
			lastX += 50;
		}

		var lastX = 0;
		var lastY = 50;

		for(var i = 0; i < this.width; i += 50) {
			for(var x = 0; x < this.height - 50; x += 50) {
				bkg = {};
				bkg['x'] = lastX;
				bkg['y'] = lastY;
				bkg['height'] = 50;
				bkg['width'] = 50;
				bkg['image'] = new Image();
				bkg['image'].src = 'img/water.jpg';

				this.images.push(bkg);

				lastY += 50;
			}
			lastY = 50;
			lastX += 50;
		}

		//Ground
		var lastX = 0;

		for(var i = 0; i < this.width / 50; i++) {
			var sand = {};
			sand['x'] = lastX;
			sand['y'] = this.height - 50;
			sand['height'] = 50;
			sand['width'] = 50;
			sand['image'] = new Image();
			sand['image'].height = 50;
			sand['image'].width = 50;
			sand['image'].x = this.x;
			sand['image'].y = this.y;
			sand['image'].src = 'img/sand.jpg';

			this.images.push(sand);
			lastX += 50;
		}

		//Weed
		var prevX = 1;

		for(var i = 0; i < 6; i++) {
			if(prevX == 1) {
				var sand = {}
				sand['x'] = 220;
				sand['y'] = this.height - 110;
				sand['height'] = 100;
				sand['width'] = 10;
				sand['image'] = new Image();
				sand['image'].src = 'img/weed.png';

				this.images.push(sand);
				prevX++;
			} else {
				var sand = {}
				sand['x'] = prevX + 400;
				sand['y'] = this.height - 135;
				sand['height'] = 100;
				sand['width'] = 10;
				sand['image'] = new Image();
				sand['image'].src = 'img/weed.png';

				this.images.push(sand);

				prevX = sand['x'];
			}
		}

		var prevX = 1;

		for(var i = 0; i < 16; i++) {
			var rng = this.util.random(20)
			if(prevX == 1) {
				var sand = {}
				sand['x'] = 820;
				sand['y'] = this.height - 115 + rng;
				sand['height'] = 100;
				sand['width'] = 10;
				sand['image'] = new Image();
				sand['image'].src = 'img/weed.png';

				this.images.push(sand);
				prevX = sand['x'];
			} else {
				var sand = {}
				sand['x'] = prevX + 11;
				sand['y'] = this.height - 115 + rng;
				sand['height'] = 100;
				sand['width'] = 10;
				sand['image'] = new Image();
				sand['image'].src = 'img/weed.png';

				this.images.push(sand);

				prevX = sand['x'];
			}
		}
	}
}