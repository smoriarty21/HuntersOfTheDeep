var Enemy = function() {
	this.status = 'MOVE';
	this.hp = 20;
	this.x = 700;
	this.y = 250;
	this.height = 60;
	this.width = 200;
	this.velocity = [0, 0];
	this.speed = 10;									
	this.bullets = [];
	this.worldWidth = 2200;
	this.worldHeight = 1200;
	this.count = 0;
	this.playerHeight = 50;

	this.direction = 'LEFT';

	this.image = new Image();
	this.image.src = 'img/shark.png';

	this.playerInRange = false;

	this.weapon = new Weapon();
	this.wep = this.weapon.generate('NORMAL');

	this.utils = new Utils();

	this.set_health = function(dif) {
		this.hp += dif;
	}

	this.get_health = function() {
		return this.hp;
	}

	this.update = function(playerX, playerY) {
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
			this.image.src = 'img/shark-r.png';
		} else if (this.x + this.width + playerX > (this.worldWidth) && this.direction == 'RIGHT') {
			this.direction = 'LEFT';
			this.image.src = 'img/shark.png';
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

		this.x += this.velocity[0];
		this.y += this.velocity[1];
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
		} else {
			this.playerInRange = false;
		}
	}
}