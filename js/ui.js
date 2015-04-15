function UI() {
	this.height = 600;
	this.width = 1100;
	this.x = 0;
	this.y = 0;

	this.show_fps = false;
	this.fps = 0;
	
	this.stats_menu_open = false;

	this.hpbar = new HpBar();

	//TODO: Move stats to main to fix bug with layering
	this.stats = new StatsMenu();

	this.update = function(hp, player) {
		this.hpbar.update(hp);
		this.stats.update(player);

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
			context.fillText(Math.round(this.fps), 5, this.height - 5);
		}
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
	this.padding = 20;

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

		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.fillStyle="#FFFFFF";
		context.fillText('LEVEL:', (this.x + this.padding), (this.y + this.padding));
		context.fillText(this.level, (this.x + (this.padding * 4)), (this.y + this.padding));

		it++;

		context.fillStyle="#FFFFFF";
		context.fillText('XP:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText(this.xp, (this.x + (this.padding * 4)), (this.y + this.padding) + (this.padding * it));

		it++;

		context.fillStyle="#FFFFFF";
		context.fillText('Next Level:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
		context.fillText(this.xp_for_next_level + ' XP', (this.x + (this.padding * 8)), (this.y + this.padding) + (this.padding * it));

		it++;

		context.fillStyle="#FFFFFF";
		context.fillText('Weapon Speed Bonus:', (this.x + this.padding), (this.y + this.padding) + (this.padding * it));
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