var Weapon = function() {
	this.speed = 0;
	this.velocity = [];
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.ammo = 0;
	this.color = '#FFFFFF';

	this.generate = function(type) {
		switch(type) {
			//Sub Weapons
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

			//Human Weapons
			case 'BASIC_PISTOL':
				this.velocity[0] = 10;
				this.velocity[1] = 0;

				this.height = 50;
				this.width = 50;

				this.bullet_height = 10;
				this.bullet_width = 15;

				this.type = 'WEAPON';

				this.color = '#59E817';

				this.ammo = -1;

				this.damage = 10;

				this.image = new Image();
				this.image.src = 'img/basic_pistol.png'

				break;

		}

		return this;
	}
}