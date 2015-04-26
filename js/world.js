function World() {
	this.x = 0;
	this.y = 0;
	this.velocity = [0, 0];
	this.height = 1100;
	this.width = 2500;
	this.status = 'STILL';
	this.canvasHeight = 600;
	this.canvasWidth = 1100;
	this.speed = 20;
	this.weeds = [];
	this.ground = [];
	this.images = [];
	this.enemies = [];

	this.boss_y = 0;
	this.boss_x = 0;

	this.boss_fight = false;
	this.boss_fight_start = false;
	this.boss_x_in_place = false;
	this.boss_y_in_place = false;
	this.boss_fight_ready = false;
	this.boss_roof_indexes = [];
	this.boss_area_max_x = 0;
	this.boss_area_min_x = -1;
	this.boss_area_max_y = 0;
	this.boss_area_min_y = -1;

	//Dungeon Stats
	this.total_dungeon_xp = 0;
	this.total_dungeon_gold = 0;

	this.town = false;

	this.show_world_complete_dialog = false;

	this.cell_height = 50;
	this.cell_width = 50;

	this.util = new Utils();
	this.enemy_generator = new Enemy();

	//Town
	//this.bounty_board = new BountyBoard(this);

	this.update = function(player) {
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

		//Set Camera For Boss Fight
		if(this.boss_fight && !this.boss_camera_set) {
			//Find roof height
			var max_roof_height = 0;

			player.bullets = [];

			for(var i = 0; i < this.boss_roof_indexes.length; i++) {
				if(this.boss_roof_indexes[i] > max_roof_height) {
					max_roof_height = this.boss_roof_indexes[i];
				}
			}

			this.velocity[0] = 5;
			this.velocity[1] = 5;

			for(var i = 0; i < this.images.length; i++) {
				if(!((this.width / 50) % i)) {
					if(this.images[i]['x'] <= -(this.width - this.canvasWidth)) {
						this.velocity[0] = 0;
						this.boss_x_in_place = true;
					} 
				}

				if(this.images[0]['y'] >= -max_roof_height) {
					this.velocity[1] = 0;
					this.boss_y_in_place = true;
				}

				//Move Images
				this.images[i]['x'] -= this.velocity[0];
				this.images[i]['y'] += this.velocity[1];
			}

			//Move Enemy durring animation
			for(var i = 0; i < this.enemies.length; i++) {
				this.enemies[i].x += this.velocity[0];
				this.enemies[i].y += this.velocity[1];
			}

			if(this.boss_y_in_place && this.boss_x_in_place) {
				this.boss_fight_ready = true;
				this.boss_camera_set = true;
			}

			this.x += this.velocity[0];
			this.y += this.velocity[1];

			for(var x = 0; x < this.enemies.length; x++) {
				this.enemies[x].x -= this.velocity[0] * 2;
				this.enemies[x].y += this.velocity[1];
			}
		} else if(this.boss_fight && this.boss_camera_set) {
			this.velocity[0] = 0;
			this.velocity[1] = 0;

			for(var i = 0; i < this.enemies.length; i++) {
				if(this.enemies[i].boss && !this.boss_fight_start) {
					this.enemies[i].status = 'BEAM';
					this.boss_fight_start = true;
				}
			}
		} else {
			for(var i = 0; i < this.images.length; i++) {
				this.images[i]['x'] += this.velocity[0];
				this.images[i]['y'] += this.velocity[1];
			}
		}

		//Check that player is moving
		if(!player.motion['RIGHT'] && !player.motion['LEFT'] && !player.motion['DOWN'] && !player.motion['UP']) {
			this.velocity[0] = 0;
			this.velocity[1] = 0;
			this.status = 'STILL';
		}

		this.x += this.velocity[0];
		this.y += this.velocity[1];

		//Town
		if(player.in_town) {
			this.bounty_board.update(this.velocity[0], this.velocity[1], player);
			this.item_shop.update(this);
		}

		//Enemies
		for(var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update(player.x, player.y, player, this);

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

					this.boss_fight = true;
				}
			}
		}

		//Check for completed dungeons
		if(this.show_world_complete_dialog) {
			this.level_complete_dialog.show = true;
		}
	}

	this.setVelocity = function(x, y) {
		this.velocity[0] = x;
		this.velocity[1] = y;
	}

	this.draw = function(context, playerX) {
		for(var i = 0; i < this.images.length; i++) {
			if(this.images[i]['x'] > playerX - (this.canvasWidth + (playerX / 2)) && this.images[i]['x'] < playerX + (this.canvasWidth - (playerX / 2))) {
				context.drawImage(this.images[i]['image'], this.images[i]['x'], this.images[i]['y'], this.images[i]['width'], this.images[i]['height']);
			}
		}

		//Town
		if(this.town) {
			this.item_shop.draw(context);
			this.bounty_board.draw(context);
		}

		//Enemies
		for(var i = 0; i < this.enemies.length; i++) {
			context.drawImage(this.enemies[i].image, this.enemies[i].x, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height);
		}
	}

	//World Generators
	this.generateDungeon = function(player) {
		player.switch_to_dungeon();

		this.width = this.util.random(30000) + 6000;

		var boss_area_size = 1150;

		cave_walls = [];
		cave_water = [];

		this.total_dungeon_xp = 0;
		this.total_dungeon_gold = 0;
		
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

				if(i > this.boss_area_max_x) {
					this.boss_area_max_x = i;
				}

				if(i < this.boss_area_min_x || this.boss_area_min_x == -1) {
					this.boss_area_min_x = i;
				}

				if(j > this.boss_area_max_y) {
					this.boss_area_max_y = j;
				}

				if(j < this.boss_area_min_y || this.boss_area_min_y == -1) {
					this.boss_area_min_y = j;
				}

				if(i == this.width - boss_area_size + 50) {
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
					this.boss_x = i;
				} else if(j < 200) {
					dungeon_part['image'].src = 'img/sand.jpg';
					dungeon_part['collision'] = true;

					if(j > this.boss_y) {
						this.boss_y = j;
					}

					this.boss_roof_indexes.push(j);
				} else if( j > (this.height / 2) + 100) {
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
		var rng = this.util.random(10);

		for(var i = -5; i < rng; i++) {
			this.enemy_generator = new Enemy();
			var badGuy = this.enemy_generator.generate('SHARK');
			badGuy.x = this.util.random(this.width) + 3000;

			var  bottom_range = this.height - 300;
			badGuy.y = this.util.random(bottom_range - 300) + 300;
			this.enemies.push(badGuy);
		}
	
		player.y = 550;
		player.setVelocity(0,0);

		this.enemy_generator = new Enemy();
		var boss = this.enemy_generator.generate('WORM');
		boss.x = this.boss_x - boss.width - (this.cell_width * 2);
		boss.y = this.boss_y + (this.cell_height * 4);
		boss.set_x = boss.x;

		boss.boss_area_max_x = this.boss_area_max_x;
		boss.boss_area_min_x = this.boss_area_min_x;
		boss.boss_area_max_y = this.boss_area_max_y;
		boss.boss_area_min_y = this.boss_area_min_y;

		this.enemies.push(boss);

		var level_complete_width = 500;
		var level_complete_height = 350;
		this.level_complete_dialog = new LevelComplete((this.canvasWidth - level_complete_width) / 2, (this.canvasHeight - level_complete_height) / 2, level_complete_width, level_complete_height);
	}

	this.generate_town = function(player) {
		this.item_shop = new ItemShop(this);
		this.bounty_board = new BountyBoard(this);

		player.switch_to_town(this.cell_width * 3, this.canvasHeight - player.height - (this.cell_height * 2));

		this.width = 2200;
		this.height = 1100;

		this.town = true;
		worldParts = [];

		//Generate dome
		var dome_images = [];
		var dome_next_x = 0;
		var dome_next_y = 0;
		var dome_x_reset = false;

		dome_images.push('img/town-dome1.png');
		dome_images.push('img/town-dome2.png');
		dome_images.push('img/town-dome3.png');
		dome_images.push('img/town-dome4.png');
		dome_images.push('img/town-dome5.png');

		for(var i = 0; i <= this.width; i += this.cell_width) {
			for(var j = 0; j <= this.height; j += this.cell_height) {
				//Water top
				if(j == 0) {
					bkg = {};
					bkg['x'] = i;
					bkg['y'] = j;

					bkg['height'] = this.cell_height;
					bkg['width'] = this.cell_width;

					bkg['collision'] = true;

					bkg['image'] = new Image();
					bkg['image'].src = 'img/water-top.jpg';

					this.images.push(bkg);
				} else if(j == this.height - this.cell_height) {
					if(!i) {
						bkg = {};
						bkg['x'] = i;
						bkg['y'] = j;

						bkg['height'] = this.cell_height;
						bkg['width'] = this.cell_width;

						bkg['collision'] = true;
						
						bkg['image'] = new Image();
						bkg['image'].src = 'img/sand.jpg';
					} else if(i == this.width - this.cell_height) {
						bkg = {};
						bkg['x'] = i;
						bkg['y'] = j;

						bkg['height'] = this.cell_height;
						bkg['width'] = this.cell_width;

						bkg['collision'] = true;
						
						bkg['image'] = new Image();
						bkg['image'].src = 'img/sand.jpg';
					} else {
						bkg = {};
						bkg['x'] = i;
						bkg['y'] = j;

						bkg['height'] = this.cell_height;
						bkg['width'] = this.cell_width;

						bkg['collision'] = true;

						floor_images = [];

						for(var k = 1; k <= 7; k++) {
							floor_images.push('img/town-floor-cement-' + k + '.png');	
						}

						var rng = this.util.random(floor_images.length);
						
						bkg['image'] = new Image();
						bkg['image'].src = floor_images[rng - 1];
					}

					this.images.push(bkg);
				} else {
					if(!i) {
						bkg = {};
						bkg['x'] = i;
						bkg['y'] = j;

						bkg['height'] = this.cell_height;
						bkg['width'] = this.cell_width;

						bkg['collision'] = false;

						bkg['image'] = new Image();
						bkg['image'].src = 'img/water.jpg';

						this.images.push(bkg);
					} else if(i == this.cell_width || i == this.width - (this.cell_width * 2)) {
						if(j >= this.height - (this.cell_height * 8)) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							if(j < dome_next_y + this.cell_height || !dome_next_y) {
								if(i == this.cell_width) {
									dome_next_y = j - this.cell_height;
								} else if(i == this.width - (this.cell_width * 2)) {
									dome_next_y = j + this.cell_height;
								}
								
							}

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						}
					} else if(i == this.cell_width * 2) {
						if(j <= dome_next_y && j > dome_next_y - 150) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							if(j == dome_next_y) {
								dome_next_y = j - this.cell_height * 3;
							}
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.cell_width * 3) {
						if(j <= dome_next_y && j > dome_next_y - 150) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							if(j == dome_next_y) {
								dome_next_y = j - this.cell_height * 3;
							}
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.cell_width * 4) {
						if(j <= dome_next_y && j > dome_next_y - 150) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							if(j == dome_next_y) {
								dome_next_y = j - this.cell_height * 3;
							}
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.cell_width * 5) {
						if(j == dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							dome_next_y = j - this.cell_height;
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.cell_width * 6) {
						if(j == dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							dome_next_y = j - this.cell_height;
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.cell_width * 7) {
						if(j == dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							dome_next_y = j - this.cell_height;
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						}  else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i >= this.cell_width * 8 && i <= this.cell_width * 34) {
						if(j == dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							//dome_next_y = j - this.cell_height;
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';
						}

						this.images.push(bkg);
					} else if(i == this.width - (this.cell_width * 9)) {
						dome_next_y = this.height  - (this.cell_height * 21);
						if(j == dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							dome_next_y = j - this.cell_height;
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.width - (this.cell_width * 8)) {
						dome_next_y = this.height  - (this.cell_height * 20);
						if(j == dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							dome_next_y = j - this.cell_height;
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.width - (this.cell_width * 7)) {
						dome_next_y = this.height  - (this.cell_height * 19);
						if(j == dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							dome_next_y = j - this.cell_height;
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.width - (this.cell_width * 6)) {
						dome_next_y = this.height  - (this.cell_height * 18);
						if(j == dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							dome_next_y = j - this.cell_height;
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.width - (this.cell_width * 5)) {
						dome_next_y = this.height  - (this.cell_height * 15);
						
						if(j <= dome_next_y && j > dome_next_y - 150) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							if(j == dome_next_y) {
								dome_next_y = j - this.cell_height * 3;
							}
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.width - (this.cell_width * 4)) {
						dome_next_y = this.height  - (this.cell_height * 12);
						
						if(j <= dome_next_y && j > dome_next_y - 150) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							if(j == dome_next_y) {
								dome_next_y = j - this.cell_height * 3;
							}
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					} else if(i == this.width - this.cell_width) {
						if(j < this.height - (this.cell_height - 50)) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sand.jpg';
						}

						this.images.push(bkg);
					} else if(i == this.width - (this.cell_width * 3)) {
						if(!dome_x_reset) {
							dome_next_y = this.height  - (this.cell_height * 9);
							dome_x_reset = true;
						}

						if(j <= dome_next_y && j > dome_next_y - 150) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							if(j == dome_next_y) {
								dome_next_y = j - this.cell_height * 3;
							}
							
							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = true;

							var rng = this.util.random(5) - 1;

							bkg['image'] = new Image();
							bkg['image'].src = dome_images[rng];

							this.images.push(bkg);
						} else if(j < dome_next_y) {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/water.jpg';

							this.images.push(bkg);
						} else {
							bkg = {};
							bkg['x'] = i;
							bkg['y'] = j;

							bkg['height'] = this.cell_height;
							bkg['width'] = this.cell_width;

							bkg['collision'] = false;

							bkg['image'] = new Image();
							bkg['image'].src = 'img/sky-plain.png';

							this.images.push(bkg);
						}
					}
				}
			}
		}

		max_y = false;
		max_y_index = 0;

		for(var i = 0; i < this.images.length; i++) {
			if(this.images[i]['y'] >= max_y || max_y == false) {
				max_y = this.images[i]['y'];
				max_y_index = i;
			}
		}

		while(this.images[max_y_index]['y'] + this.images[max_y_index]['height'] > this.canvasHeight + this.cell_height) {
			for(var i = 0; i < this.images.length; i++) {
				this.images[i]['y'] -= 1;
			}
			world.bounty_board.update(0, -1, player);
		}
	}
}