var Camera = function() {
	this.height = 600;
	this.width = 1200;
	this.x = 0;
	this.y = 0;
	this.playerAreaPadding = 900;

	this.rect = {
		'height': this.height - 100,
		'width': this.width - this.playerAreaPadding,
		'x': this.playerAreaPadding / 2,
		'y': 50,
	}

	this.move = function(x, y) {
		this.x += x;
		this.y += y;
	}
}