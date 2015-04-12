function UI() {
	this.height = 600;
	this.width = 1100;
	this.x = 0;
	this.y = 0;

	this.hpbar = new HpBar();

	this.update = function(hp) {
		this.hpbar.update(hp);	}

	this.draw = function(context) {
		context.fillStyle="#000000";
		context.fillRect(this.hpbar.outerX, this.hpbar.outerY, this.hpbar.outerWidth, this.hpbar.outerHeight);

		context.fillStyle="#FF0000";
		context.fillRect(this.hpbar.x, this.hpbar.y, this.hpbar.width, this.hpbar.height);
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