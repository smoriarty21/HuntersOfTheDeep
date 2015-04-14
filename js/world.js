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
		//TODO: Move this to UI in order to render on top of player
		world.bounty_board.update(this.velocity[0], this.velocity[1], player);

		//Enemies
		for(var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update(playerX, playerY, player);

			this.enemies[i].x += this.velocity[0];
			this.enemies[i].y += this.velocity[1];
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

	this.generateWorld = function() {
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

		//Enemies
		var badGuy = new Enemy();
		this.enemies.push(badGuy);
	}

	this.generateWorld();
}