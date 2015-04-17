var Weapon = function() {
	this.speed = 0;
	this.velocity = [];
	this.x = 0;
	this.y = 0;
	this.height = 0;
	this.width = 0;
	this.ammo = 0;
	this.color = '#FFFFFF'

	this.generate = function(type) {
		switch(type) {
			case 'NORMAL':
				this.speed = 30;
				this.velocity[0] = this.speed;
				this.velocity[1] = 0;
				this.height = 10;
				this.width = 20;
				this.ammo = -1;
				this.color = '#AAAAFF'
				this.damage = 10;
				break;
		}

		return this;
	}
}