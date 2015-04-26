function UI() {
	this.height = 600;
	this.width = 1100;
	this.x = 0;
	this.y = 0;

	this.show_fps = false;
	this.fps = 0;
	
	this.stats_menu_open = false;

	this.hpbar = new HpBar();
	this.xp_bar = new XpBar(this.width, this.height);

	this.stats = new StatsMenu();

	this.update = function(hp, player) {
		this.hpbar.update(hp);
		this.stats.update(player);
		this.xp_bar.update(player.xp, player.xp_for_next_level);

		if(this.show_fps) {
			this.thisLoop = new Date;
		    this.fps = 1000 / (this.thisLoop - this.lastLoop);
		    this.lastLoop = this.thisLoop;
		}	
	}

	this.draw = function(context) {
		context.fillStyle="#000000";
		context.fillRect(this.hpbar.outerX, this.hpbar.outerY, this.hpbar.outerWidth, this.hpbar.outerHeight);

		context.fillStyle="#FF0000";
		context.fillRect(this.hpbar.x, this.hpbar.y, this.hpbar.width, this.hpbar.height);

		if(this.stats_menu_open) {
			this.stats.draw(context);
		}

		if(this.show_fps) {
			context.font="900 20px Arial";
			context.fillStyle="#FF0000";
			context.fillText(Math.round(this.fps), 5, this.height - 15);
			context.font="10px Arial";
		}

		this.xp_bar.draw(context);
	}
}

function HpBar() {
	this.outerWidth = 200;
	this.outerHeight = 25;
	this.outerX = 5;
	this.outerY = 5;

	this.height = 15;
	this.width = this.outerWidth - 10;
	this.maxWidth = this.outerWidth - 10
	this.x = this.outerX  + 5;
	this.y = this.outerY + 5;

	this.update = function(hp) {
		if(hp < 5) {
			hp = 0;
			this.width = 0;
		} else if(hp > 100) {
			hp = 100;
			this.width = (hp * 2) - 10;
		} else {
			this.width = (hp * 2) - 10;	
		}
	}
}

function XpBar(screen_width, screen_height) {
	this.width = 0;
	this.height = 10;

	this.x = 2;
	this.y = screen_height - this.height + 2;

	this.wrapper_height = 4;
	this.wrapper_width = screen_width;

	this.color = '#54C571';

 	this.wrapper_x = 0;
 	this.wrapper_y = screen_height - this.height;

 	this.update = function(player_xp, next_level_xp) {
 		this.width = (player_xp * this.wrapper_width) / next_level_xp; 
 	}

 	this.draw = function(context) {
 		context.fillStyle = '#2C3539';
 		context.fillRect(this.wrapper_x, this.wrapper_y, this.wrapper_width, screen_height + this.wrapper_height);

 		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
 	}
}

function MouseCursor() {
	this.height = 10;
	this.width = 10;

	this.x = 0;
	this.y = 0;

	this.color = '#801515';

	this.update = function(mouse_x, mouse_y) {
		this.x = mouse_x;
		this.y = mouse_y;
	}

	this.draw = function(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	this.checkCollision = function(x1, y1, h1, w1, x2, y2, h2, w2) {
		if(x2 + w2 > x1 && x2 < x1 + w1 && y2 + h2 > y1 && y2 < y1 + h1) {
			return true;
		} else {
			return false;
		}
	}
}

function StatsMenu() {
	this.height = 500;
	this.width = 300;
	this.x = 50;
	this.y = 50;
	this.padding = 25;

	this.color = '#000000';

	this.open = false;

	this.level = 0;
	this.xp = 0;
	this.xp_for_next_level = 0;
	this.weapon_speed_bonus = 0;
	this.weapon_dmg_bonus = 0;
	this.sub_speed_bonus = 0;
	this.hp_bonus = 0;
	this.xp_bonus = 0;
	this.treasure_bonus = 0;

	this.update = function(player) {
		this.level = player.level;
		this.xp = player.xp;
		this.xp_for_next_level = player.xp_for_next_level;
		this.weapon_speed_bonus = player.weapon_speed_bonus;
		this.weapon_dmg_bonus = player.weapon_dmg_bonus;
		this.sub_speed_bonus = player.sub_speed_bonus;
		this.hp_bonus = player.hp_bonus;
		this.xp_bonus = player.xp_bonus;
		this.treasure_bonus = player.treasure_bonus;
	}

	this.draw = function(context) {
		var it = 0;

		context.font = '500 12pt Calibri';

		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.fillStyle="#FFFFFF";
		context.fillText('LEVEL:', (this.x + this.padding), (this.y + this.padding));
		context.fillText(this.level, (this.x + (this.padding * 4)), (this.y + this.padding));

		it += 0.8;

		context.fillStyle="#FFFFFF";
		context.fillText('XP:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText(this.xp, (this.x + (this.padding * 4)), (this.y + this.padding) + (this.padding * it));

		it += 2;

		context.fillStyle="#FFFFFF";
		context.fillText('Next Level:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText((this.xp_for_next_level - this.xp) + ' XP', (this.x + (this.padding * 8)), (this.y + this.padding) + (this.padding * it));

		it++;

		context.fillStyle="#FFFFFF";
		context.fillText('Attack Speed Bonus:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText(Math.round((this.weapon_speed_bonus - 1) * 100) / 100, (this.x + (this.padding * 8)), (this.y + this.padding) + (this.padding * it));

		it++;

		context.fillStyle="#FFFFFF";
		context.fillText('Damage Bonus:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText(Math.round((this.weapon_dmg_bonus - 1) * 100) / 100, (this.x + (this.padding * 8)), (this.y + this.padding) + (this.padding * it));

		it++;

		context.fillStyle="#FFFFFF";
		context.fillText('Speed Bonus:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText(Math.round((this.sub_speed_bonus - 1) * 100) / 100, (this.x + (this.padding * 8)), (this.y + this.padding) + (this.padding * it));

		it++;

		context.fillStyle="#FFFFFF";
		context.fillText('Armor Bonus:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText(Math.round((this.hp_bonus - 1) * 100) / 100, (this.x + (this.padding * 8)), (this.y + this.padding) + (this.padding * it));

		it++;

		context.fillStyle="#FFFFFF";
		context.fillText('XP Bonus:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText(Math.round((this.xp_bonus - 1) * 100) / 100, (this.x + (this.padding * 8)), (this.y + this.padding) + (this.padding * it));

		it++;

		context.fillStyle="#FFFFFF";
		context.fillText('Luck Bonus:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText(Math.round((this.treasure_bonus - 1) * 100) / 100, (this.x + (this.padding * 8)), (this.y + this.padding) + (this.padding * it));
	}
}

//Title Menu
function TitleScreen(screen_height, screen_width) {
	this.height = screen_height;
	this.width = screen_width;

	this.x = 0;
	this.y = 0;

	this.image = new Image();
	this.image.src = 'img/title-screen.png'

	//Play Button
	this.play_button_height = 50;
	this.play_button_width = 100;

	this.play_button_x = (this.width / 2) - (this.play_button_width / 2);
	this.play_button_y = (this.height / 2) - (this.play_button_height / 2);

	this.play_button_image = new Image();
	this.play_button_image.src = 'img/play-btn.png';


	this.draw = function(context) {
		//Background
		context.drawImage(this.image, this.x, this.y, this.width, this.height);

		//Play Button
		context.drawImage(this.play_button_image, this.play_button_x, this.play_button_y, this.play_button_width, this.play_button_height);
	}
}

//Studio Splash
function StudioCred(screen_height, screen_width) {
	this.height = screen_height;
	this.width = screen_width;

	this.x = 0;
	this.y = 0;

	this.count = 0;

	this.image = new Image();
	this.image.src = 'img/logo.png'

	this.update = function() {
		if(this.count >= 120) {
			return true;
		} else {
			this.count++;
		}
	}

	this.draw = function(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

//Death screen
function DeathScreen(screen_width, screen_height) {
	this.height = screen_height;
	this.width = screen_width;

	this.x = 0;
	this.y = 0;

	this.image = new Image();
	this.image.src = 'img/dead.png'


	this.draw = function(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

function LevelComplete(x, y, width, height) {
	this.x = x;
	this.y = y;

	this.height = height;
	this.width = width;

	this.padding = 10;
	this.row_padding = 35;

	this.color = '#FFFFFF';

	this.show = false;

	this.draw = function(context, xp, gold) {
		if(this.show) {
			//Borders
			context.fillStyle = '#000000';
			context.fillRect(this.x - this.padding, this.y - this.padding, this.width + (this.padding * 2), this.padding); //Top
			context.fillRect(this.x, this.y + this.height, this.width + this.padding, this.padding); //Bottom
			context.fillRect(this.x - this.padding, this.y, this.padding, this.height + this.padding); //Left
			context.fillRect(this.x + this.width, this.y, this.padding, this.height); //Right

			//Background
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height);

			//Text
			var it = 1;
			context.fillStyle="#000000";
			context.font = '900 30pt Calibri';

			context.fillText('Level Complete!', (this.x + this.padding), (this.y + (this.row_padding * it)));

			it += 1.2;
			context.font = '500 20pt Calibri';
			context.fillText('Total Gold: ' + gold, (this.x + this.padding * 2), (this.y + (this.row_padding * it)));

			it++;
			context.fillText('Total XP: ' + xp, (this.x + this.padding * 2), (this.y + (this.row_padding * it)));

			it += 1.5;
			context.fillText('Items', (this.x + this.padding * 2), (this.y + (this.row_padding * it)));

			//Return to town button
			it += 2.5;

			this.btn_x = this.x + ((this.x + this.width - 120) / 2);
			this.btn_y = (this.y + (this.row_padding * it));
			this.btn_width = 120;
			this.btn_height = 60;
			context.fillStyle = '#000000';
			context.fillRect(this.btn_x, this.btn_y, this.btn_width, this.btn_height);

			it += 1;
			context.fillStyle = '#FFFFFF';
			context.font = '500 20pt Calibri';
			context.fillText('Town', this.x + this.padding + ((this.x + this.width - 120) / 2), (this.y + (this.row_padding * it)));
		}
	}

}

function Inventory(player_image) {
	this.inventory_parts = {};
	this.inventory_ui = [];
	this.inventory = [];

	this.top_row_y = 70;
	this.top_row_start_x = 500;
	this.top_row_spacing = 75;

	this.portrait_width = 100;
	this.portrait_height = 175;

	this.gear_height = 50;
	this.gear_width = 50;
	this.gear_spacing = 15;

	this.armor_y = this.top_row_y +  this.gear_height + this.gear_spacing;
	this.armor_height = this.portrait_height - this.gear_height - this.gear_spacing;
	this.armor_x = this.portrait_width + this.top_row_start_x + this.top_row_spacing;

	this.padding = 5;

	this.inventory_slot_width = 50;
	this.inventory_slot_height = 50;
	this.inventory_slot_spacing = 30;
	this.inventory_rows = 3;
	this.inventory_columns = 4;

	this.inventory_bkg_y = this.top_row_y - this.gear_spacing;
	this.inventory_bkg_x = this.top_row_start_x - this.gear_spacing;
	this.inventory_bkg_width = 320;
	this.inventory_bkg_height = 450;

	this.color = '#FFFFFF';

	//Char portrait
	this.inventory_parts['inv'] = {};
	this.inventory_parts['inv'].height = this.portrait_height;
	this.inventory_parts['inv'].width = this.portrait_width;
	this.inventory_parts['inv'].x = this.top_row_start_x;
	this.inventory_parts['inv'].y = this.top_row_y;
	this.inventory_parts['inv'].type = 'PORTRAIT';
	this.inventory_parts['inv'].open = true;

	this.inventory_ui.push(this.inventory_parts['inv']);

	//Head Gear
	this.inventory_parts['inv'] = {};
	this.inventory_parts['inv'].height = this.gear_height;
	this.inventory_parts['inv'].width = this.gear_width;
	this.inventory_parts['inv'].x = this.portrait_width + this.top_row_start_x + this.top_row_spacing;
	this.inventory_parts['inv'].y = this.top_row_y;
	this.inventory_parts['inv'].type = 'HEAD';
	this.inventory_parts['inv'].open = true;
	this.inventory_parts['inv'].item_index = 0;

	this.inventory_ui.push(this.inventory_parts['inv']);

	//Chest Armor
	this.inventory_parts['inv'] = {};
	this.inventory_parts['inv'].height = this.armor_height;
	this.inventory_parts['inv'].width = this.gear_width;
	this.inventory_parts['inv'].x = this.armor_x;
	this.inventory_parts['inv'].y = this.armor_y;
	this.inventory_parts['inv'].type = 'CHEST';
	this.inventory_parts['inv'].open = true;
	this.inventory_parts['inv'].item_index = 0;

	this.inventory_ui.push(this.inventory_parts['inv']);

	//Weapon
	this.inventory_parts['inv'] = {};
	this.inventory_parts['inv'].height = this.gear_height;
	this.inventory_parts['inv'].width = this.gear_width;
	this.inventory_parts['inv'].x = this.armor_x + this.gear_width + this.gear_spacing;
	this.inventory_parts['inv'].y = this.armor_y + this.gear_spacing;
	this.inventory_parts['inv'].type = 'WEAPON';
	this.inventory_parts['inv'].open = true;
	this.inventory_parts['inv'].item_index = 0;

	this.inventory_ui.push(this.inventory_parts['inv']);

	//Item slots
	for(var i = 0; i < this.inventory_columns; i++) {
		for(var j = 0; j < this.inventory_rows; j++) {
			this.inventory_parts['inv'] = {};
			this.inventory_parts['inv'].height = this.inventory_slot_height;
			this.inventory_parts['inv'].width = this.inventory_slot_width;
			this.inventory_parts['inv'].x = (this.top_row_start_x) + (this.inventory_slot_spacing * i) + (this.inventory_slot_width * i);
			
			this.inventory_parts['inv'].y = this.armor_y + this.inventory_slot_spacing + this.armor_height + (this.inventory_slot_spacing * j) + (this.inventory_slot_height * j);
			this.inventory_parts['inv'].type = 'SLOT';
			this.inventory_parts['inv'].open = true;
			this.inventory_parts['inv'].item_index = 0;

			this.inventory_ui.push(this.inventory_parts['inv']);
		}
	}

	this.draw = function(context, player_items) {
		//Inventory Wrapper || Borders
		context.fillStyle = '#000000';
		context.fillRect(this.inventory_bkg_x - this.padding, this.inventory_bkg_y - this.padding, this.inventory_bkg_width + (this.padding * 2), this.padding); //Top
		context.fillRect(this.inventory_bkg_x, this.inventory_bkg_y + this.inventory_bkg_height, this.inventory_bkg_width + this.padding, this.padding); //Bottom
		context.fillRect(this.inventory_bkg_x - this.padding, this.inventory_bkg_y, this.padding, this.inventory_bkg_height + this.padding); //Left
		context.fillRect(this.inventory_bkg_x + this.inventory_bkg_width, this.inventory_bkg_y, this.padding, this.inventory_bkg_height); //Right

		//Background
		context.fillStyle = '#2C3539';
		context.fillRect(this.inventory_bkg_x, this.inventory_bkg_y, this.inventory_bkg_width, this.inventory_bkg_height);

		for(var i = 0; i < this.inventory_ui.length; i++) {
			//Borders
			context.fillStyle = '#000000';
			context.fillRect(this.inventory_ui[i].x - this.padding, this.inventory_ui[i].y - this.padding, this.inventory_ui[i].width + (this.padding * 2), this.padding); //Top
			context.fillRect(this.inventory_ui[i].x, this.inventory_ui[i].y + this.inventory_ui[i].height, this.inventory_ui[i].width + this.padding, this.padding); //Bottom
			context.fillRect(this.inventory_ui[i].x - this.padding, this.inventory_ui[i].y, this.padding, this.inventory_ui[i].height + this.padding); //Left
			context.fillRect(this.inventory_ui[i].x + this.inventory_ui[i].width, this.inventory_ui[i].y, this.padding, this.inventory_ui[i].height); //Right

			//Background
			context.fillStyle = this.color;
			context.fillRect(this.inventory_ui[i].x, this.inventory_ui[i].y, this.inventory_ui[i].width, this.inventory_ui[i].height);
		}

		//Portrait
		context.drawImage(player_image, this.top_row_start_x + (this.gear_spacing / 2), this.top_row_y + (this.gear_spacing / 2), this.portrait_width - this.gear_spacing, this.portrait_height - this.gear_spacing);

		//Items
		for(var i = 0; i < player_items.length; i++) {
			context.drawImage(player_items[i].image, player_items[i].x, player_items[i].y, player_items[i].width, player_items[i].height)
		}
	}
}