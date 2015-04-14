function Bounty() {
	this.bounty = {};

	this.utils = new Utils();

	this.generate = function(playerLevel) {
		rng = this.utils.random(5);
		
		this.bounty['boss'] = 'The Worm';
		this.bounty['desc'] = 'Kill The Big Worm';
		this.bounty['xp'] = 700;

		return this.bounty;
	}
}