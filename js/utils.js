var Utils = function() {
	this.random = function(max) {
		return Math.floor((Math.random() * max) + 1);
	}

	this.round = function (num, places) {
	    var multiplier = Math.pow(10, places);
	    return Math.round(num * multiplier) / multiplier;
	}
}