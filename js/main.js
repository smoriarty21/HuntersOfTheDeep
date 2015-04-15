function Game() {
	player = new Player();
	world = new World();
	camera = new Camera();
	ui = new UI();

	this.height = 600;
	this.width = 1100;
	width = 1100;
	height = 600;
	var status = 'PLAYING';

	this.stats_menu_open = false;

	context = document.getElementById('viewport').getContext("2d");

	window.addEventListener('keydown', function(event) {
		switch (event.keyCode) {
	    	case 65: // Left
	      		player.status = 'LEFT';
	    		break;

	    	case 87: // Up
	      		player.status = 'UP';
	    		break;

	    	case 68: // Right
	      		player.status = 'RIGHT';
	    		break;

	    	case 83: // Down
	      		player.status = 'DOWN';
	    		break;

	    	case 27:  //Esc
	    		if (status == 'PLAYING') {
	    			status = 'PAUSED';	
	    		}else if(status == 'PAUSED') {
	    			status = 'PLAYING';
				}
	    		break;

	    	case 81: //Stats Menu 
	    		if(!ui.stats_menu_open) {
	    			ui.stats_menu_open = true;
	    		} else {
	    			ui.stats_menu_open = false;
	    		}

	    	case 69: //Action Key
	    		this.world.bounty_board.action_key_hit = true;
	    		break;
	    }
	}, false);

	window.addEventListener('mousedown', function(event) {
		switch (event.button) {
	    	case 0: // Shoot
	    		if(!this.world.bounty_board.menu_open) {
	    			player.shoot();	
	    		}
	    		break;
	    }
	}, false);

	window.addEventListener('keyup', function(event) {
		player.status = 'STILL';
	});
	
	var draw = function() {
		if(status == 'PAUSED') {
			context.fillStyle = 'black';
			context.fillRect(0, 0, 1100, 600);

			world.draw(context);
			player.draw(context);
			ui.draw(context, world.bounty_board);

			var x = this.x;
			var y = this.y

			var img = new Image();

			img.height = this.height;
			img.width = this.width;

			img.onload = function () {
			    context.drawImage(img, 0, 0, this.width, this.height);
			}

			img.src = "img/pause.png";
		} else if(status == 'PLAYING') {
			context.fillStyle = 'black';
			context.fillRect(0, 0, 1100, 600);

			world.draw(context);
			player.draw(context);
			ui.draw(context);
		}
	}

	var update = function() {
		for(var i = 0; i < world.enemies.length; i++) {
			world.enemies[i].checkPlayer(player.x, player.y, player.width, player.height);
		}
		
		world.update(player.x, player.y, player);
		player.update(world.enemies, world);
		ui.update(player.hp, player);
	}

	var ONE_FRAME_TIME = 1000 / 20 ;

	this.mainloop = function() {
		if(status == 'PLAYING') {
			if(player.x + player.width >= camera.rect['width'] + camera.rect['x']) {
				player.status = 'RIGHTWALL';
				world.status = 'RIGHT';
			} else if(player.x <= camera.rect['x']) {
				player.status = 'LEFTWALL';
				world.status = 'LEFT';
			} else if(player.y <= camera.rect['y']) {
				player.status = 'TOPWALL';
				world.status = 'UP';
			} else if(player.y + player.height >= camera.rect['height'] + camera.rect['y']) {
				player.status = 'BOTTOMWALL';
				world.status = 'DOWN';
			} else {
				world.status = 'STILL';
			}

			update();
			draw();
		} else if(status == 'PAUSED') {
			draw();
		}
    };

    setInterval( this.mainloop, ONE_FRAME_TIME );
}

game = new Game();
