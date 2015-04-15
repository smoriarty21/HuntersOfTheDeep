function Game() {
	this.height = 600;
	this.width = 1100;

	width = 1100;
	height = 600;

	var status = 'START';

	this.snap_y = false;
	this.snap_x = false;

	player = new Player();
	camera = new Camera();
	ui = new UI();
	crosshair = new MouseCursor();
	title = new TitleScreen(this.height, this.width);
	death_screen = new DeathScreen(this.width, this.height);
	sofa_king = new StudioCred(this.height, this.width);

	this.stats_menu_open = false;

	context = document.getElementById('viewport').getContext("2d");

	window.addEventListener('keydown', function(event) {
		switch (event.keyCode) {
	    	case 65: // Left
	    		if (status == 'PLAYING') {
	      			player.status = 'LEFT';
	      		}
	    		break;

	    	case 87: // Up
	      		if (status == 'PLAYING') {
	      			player.status = 'UP';
	      		}
	    		break;

	    	case 68: // Right
	      		if (status == 'PLAYING') {
	      			player.status = 'RIGHT';
	      		}
	    		break;

	    	case 83: // Down
	      		if (status == 'PLAYING') {
	      			player.status = 'DOWN';
	      		}
	    		break;

	    	case 27:  //Esc
	    		if (status == 'PLAYING') {
	    			status = 'PAUSED';	
	    		}else if(status == 'PAUSED') {
	    			status = 'PLAYING';
				} else if(status == 'START') {
					sofa_king.count = 1000;
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

	    	case 192: //Dev Console
	    		if (!ui.show_fps) {
	    			ui.show_fps = true
	    		} else {
	    			ui.show_fps = false;
	    		}
	    		break;
	    }
	}, false);

	window.addEventListener('mousedown', function(event) {
		switch (event.button) {
	    	case 0: // Shoot
	    		if(status == 'PLAYING') {
		    		if(!this.world.bounty_board.menu_open) {
		    			player.shoot();	
		    		} else if(this.world.bounty_board.menu_open) {
		    			if(crosshair.checkCollision(crosshair.x, crosshair.y , crosshair.height, crosshair.width, this.world.bounty_board.x - 130, this.world.bounty_board.y - 175, 175, 400)) {
		    				world = new World(player);
		    				world.generateDungeon(player);
		    			}
		    		}
		    	} else if(status == 'TITLE') {
		    		if(crosshair.checkCollision(crosshair.x, crosshair.y , crosshair.height, crosshair.width, title.play_button_x, title.play_button_y, title.play_button_height, title.play_button_width)) {
		    			world = new World(player);
		    			world.generate_town();

		    			status = 'PLAYING';
		    		}
		    	}
	    		break;
	    }
	}, false);

	window.addEventListener('mousemove', function(event) {
		crosshair.update(event.x, event.y);
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
			img.src = "img/pause.png";

			context.drawImage(img, 0, 0, this.width, this.height);
		} else if(status == 'PLAYING') {
			context.fillStyle = 'black';
			context.fillRect(0, 0, 1100, 600);

			world.draw(context);
			player.draw(context);
			ui.draw(context);
			crosshair.draw(context);
		} else if(status == 'TITLE') {
			title.draw(context);
			crosshair.draw(context);
		} else if(status == 'DEAD') {
			world.draw(context);
			player.draw(context);
			death_screen.draw(context);
		} else if(status == 'START') {
			sofa_king.draw(context);
		}
	}

	var update = function() {
		for(var i = 0; i < world.enemies.length; i++) {
			world.enemies[i].checkPlayer(player.x, player.y, player.width, player.height);
		}

		world.update(player.x, player.y, player);
		player.update(world.enemies, world);
		ui.update(player.hp, player);

		//Player Health
		if(player.hp <= 0) {
			status = 'DEAD';
		}
	}

	this.checkCollision = function(x1, y1, h1, w1, x2, y2, h2, w2) {
		if(x2 + w2 > x1 && x2 < x1 + w1 && y2 + h2 > y1 && y2 < y1 + h1) {
			this.playerInRange = true;
			return true;
		} else {
			this.playerInRange = false;
			return false;
		}
	}

	var ONE_FRAME_TIME = 1000 / 35 ;

	this.mainloop = function() {
		if(status == 'PLAYING') {
			if(player.x + player.width >= camera.rect['width'] + camera.rect['x']) {
				if(this.snap_x != 'RIGHT') {
					player.status = 'RIGHTWALL';
					world.status = 'RIGHT';
				}
			} else if(player.x <= camera.rect['x']) {
				if(this.snap_x != 'LEFT') {
					player.status = 'LEFTWALL';
					world.status = 'LEFT';
				}
			} else if(player.y <= camera.rect['y']) {
				if(this.snap_y != 'TOP') {
					player.status = 'TOPWALL';
					world.status = 'UP';
				}
			} else if(player.y + player.height >= camera.rect['height'] + camera.rect['y']) {
				if(this.snap_y != 'BOTTOM') {
					player.status = 'BOTTOMWALL';
					world.status = 'DOWN';
				}
			} else {
				world.status = 'STILL';
			}

			if(world.y == 0) {
				this.snap_y = 'TOP';
			} else if(world.y == -this.height) {
				this.snap_y = 'BOTTOM';
			} else {
				this.snap_y = false;
			}

			if(world.x == 0) {
				this.snap_x = 'LEFT';
			} else if(world.x == -this.width) {
				this.snap_x = 'RIGHT';
			} else {
				this.snap_x = false;
			}

			update();
			draw();
		} else if(status == 'PAUSED') {
			draw();
		} else if(status == 'TITLE') {
			draw();
		} else if(status == 'DEAD') {
			player.y += 2;

			update();
			draw();
		} else if(status == 'START') {
			if(sofa_king.update()) {
				status = 'TITLE';
			} else {
				draw();
			}
		}
    };

    setInterval( this.mainloop, ONE_FRAME_TIME );
}

game = new Game();
