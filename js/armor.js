var ArmorGenerator = function(type) {
	this.height = 45;
	this.width = 45;

	switch(type) {
		//Head
		case 'BASIC_HEAD':
			this.armor_bonus = 0.5;
			this.name = 'Basic Head Gear'
			this.image = new Image();
			this.image.src = 'img/basic-head.png'
			this.type = 'HEAD';

			return this;

			break;

		//Chest
		case 'BASIC_CHEST':
			this.armor_bonus = 1;
			this.name = 'Leather Shirt'
			this.image = new Image();
			this.image.src = 'img/basic-chest.png'
			this.type = 'CHEST';
			
			return this;

			break;
	}
} 