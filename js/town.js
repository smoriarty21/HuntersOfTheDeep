var BountyBoard = function(world) {
	this.height = 100;
	this.width = 75;
	this.x = 600;
	this.y = world.height - (this.height + 25);
	this.action_padding = 120;
	this.player_in_range = false;
	this.action_key_hit = false;
	this.menu_open = false;

	this.current_bounties = [];

	this.image = new Image();
	this.image.src = 'img/board.png';

	this.update = function(xVelocity, yVelocity, player) {
		this.player_in_range = this.checkPlayerInRange(player.x, player.y, player.height, player.width, this.x - this.action_padding, this.y - this.action_padding, this.height + (this.action_padding * 2), this.width + (this.action_padding * 2));
		this.current_bounties = player.current_bounties;

		if(this.player_in_range && this.action_key_hit && !this.menu_open) {
			this.menu_open = true;
			this.action_key_hit = false;
		} else if(this.action_key_hit && this.menu_open) {
			this.menu_open = false;
			this.action_key_hit = false;
		}

		if(!this.player_in_range && this.menu_open) {
			this.menu_open = false;
		}
		
		this.x += xVelocity;
		this.y += yVelocity;
	}

	this.draw = function(context) {
		context.font = '500 10pt Calibri';
		context.drawImage(this.image, this.x, this.y, this.width, this.height);

		if(this.player_in_range && !this.menu_open) {
			context.fillStyle="#FFFFFF";
			context.fillText('Press E Key', this.x + 5, this.y - 12);
		}

		if(this.player_in_range && this.menu_open) {
			context.fillStyle = 'black';
			context.fillRect(this.x - 130, this.y - 175, 400, 175);

			var i = 1;
			var padding = 20;
			var startY = 145;

			context.fillStyle="#FFFFFF";
			context.fillText('Boss', this.x  - 120, this.y - 160);
			context.fillText('Description', this.x - 50, this.y - 160);
			context.fillText('Experience', this.x + 80 , this.y - 160);

			var spacer = '--------------------------------------------------------------------------------------';
			context.fillText(spacer, this.x  - 120, this.y - 150);

			context.fillText(this.current_bounties[0]['boss'], this.x  - 118, this.y - 135);
			context.fillText(this.current_bounties[0]['desc'], this.x - 50, this.y - 135);
			context.fillText(this.current_bounties[0]['xp'] + 'XP', this.x + 80 , this.y - 135);

			context.fillText('Click A Dungeon', this.x  + 20, this.y - 10);
		}
	}

	this.checkPlayerInRange = function(x1, y1, h1, w1, x2, y2, h2, w2) {
		if(x2 + w2 > x1 && x2 < x1 + w1 && y2 + h2 > y1 && y2 < y1 + h1) {
			return true;
		} else {
			return false;
		}
	}
}

var ItemShop = function(world) {
	this.height = 250;
	this.width = 350;

	this.menu_open = false;

	this.x = 1725;
	this.y = 600 - (this.height + 52);

	this.action_padding = 10;

	this.image = new Image();
	this.image.src = 'img/item-shop.png';

	this.draw = function(context, canvas_width, canvas_height) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);

		context.font = '500 14pt Calibri';

		if(this.player_in_range && !this.menu_open) {
			context.fillStyle="#FFFFFF";
			context.fillText('Press E Key', this.x + 5, this.y - 15);
		} else if(this.player_in_range && this.menu_open) {
			this.show_menu(context, canvas_width, canvas_height);
		}
	}

	this.update = function(world) {
		this.player_in_range = this.checkPlayerInRange(player.x, player.y, player.height, player.width, this.x - this.action_padding, this.y - this.action_padding, this.height + (this.action_padding * 2), this.width + (this.action_padding * 2));

		if(!this.player_in_range) {
			this.menu_open = false;
		}

		this.x += world.velocity[0];
		this.y += world.velocity[1];

	}

	this.checkPlayerInRange = function(x1, y1, h1, w1, x2, y2, h2, w2) {
		if(x2 + w2 > x1 && x2 < x1 + w1 && y2 + h2 > y1 && y2 < y1 + h1) {
			return true;
		} else {
			return false;
		}
	}

	this.show_menu = function(context, screen_width, screen_height) {
		this.menu_width = 700;
		this.menu_height = 400;

		this.menu_x = (screen_width - this.menu_width) / 2;
		this.menu_y = (screen_height - this.menu_height) / 2;

		this.menu_padding = 5;

		this.color = '#FFFFFF'

		//Borders
		context.fillStyle = '#000000';
		context.fillRect(this.menu_x - this.menu_padding, this.menu_y - this.menu_padding, this.menu_width + (this.menu_padding * 2), this.menu_padding); //Top
		context.fillRect(this.menu_x, this.menu_y + this.menu_height, this.menu_width + this.menu_padding, this.menu_padding); //Bottom
		context.fillRect(this.menu_x - this.menu_padding, this.menu_y, this.menu_padding, this.menu_height + this.menu_padding); //Left
		context.fillRect(this.menu_x + this.menu_width, this.menu_y, this.menu_padding, this.menu_height); //Right

		//Background
		context.fillStyle = this.color;
		context.fillRect(this.menu_x, this.menu_y, this.menu_width, this.menu_height);

	}
}