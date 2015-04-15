var Camera = function() {
	this.height = 600;
	this.width = 1100;
	this.x = 0;
	this.y = 0;
	this.playerAreaPadding = 300;

	this.rect = {
		'height': this.height - this.playerAreaPadding,
		'width': this.width - this.playerAreaPadding,
		'x': this.playerAreaPadding / 2,
		'y': this.playerAreaPadding / 2,
	}

	this.move = function(x, y) {
		this.x += x;
		this.y += y;
	}
}