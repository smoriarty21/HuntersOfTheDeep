function Game() {
	this.height = 600;
	this.width = 1100;

	width = 1100;
	height = 600;

	var status = 'PLAYING';

	this.snap_y = false;
	this.snap_x = false;

	player = new Player();
	camera = new Camera();
	ui = new UI();
	crosshair = new MouseCursor();
	title = new TitleScreen(this.height, this.width);
	death_screen = new DeathScreen(this.width, this.height);
	sofa_king = new StudioCred(this.height, this.width);

	world = new World();
	world.generateDungeon(player);

	this.stats_menu_open = false;
	
	//Music
	this.music_playing = false;

	context = document.getElementById('viewport').getContext("2d");

	//Keyboard Key Down Event Handlers
	window.addEventListener('keydown', function(event) {
		switch (event.keyCode) {
	    	case 65: // Left
	    		if (status == 'PLAYING' && !player.motion['RIGHT']) {
	      			player.motion['LEFT'] = 1;
	      		}
	    		break;

	    	case 87: // Up
	      		if (status == 'PLAYING' && !player.motion['DOWN']) {
	      			player.motion['UP'] = 1;
	      		}
	    		break;

	    	case 68: // Right
	      		if (status == 'PLAYING' && !player.motion['LEFT']) {
	      			player.motion['RIGHT'] = 1;
	      		}
	    		break;

	    	case 83: // Down
	      		if (status == 'PLAYING' && !player.motion['UP']) {
	      			player.motion['DOWN'] = 1;
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

	//Keyboard Key Up Event Handlers
	window.addEventListener('keyup', function(event) {
		switch (event.keyCode) {
	    	case 65: // Left
	    		if (status == 'PLAYING') {
	      			player.motion['LEFT'] = 0;
	      			player.velocity[0] = 0;
	      		}
	    		break;

	    	case 87: // Up
	      		if (status == 'PLAYING') {
	      			player.motion['UP'] = 0;
	      			player.velocity[1] = 0;
	      		}
	    		break;

	    	case 68: // Right
	      		if (status == 'PLAYING') {
	      			player.motion['RIGHT'] = 0;
	      			player.velocity[0] = 0;
	      		}
	    		break;

	    	case 83: // Down
	      		if (status == 'PLAYING') {
	      			player.motion['DOWN'] = 0;
	      			player.velocity[1] = 0;
	      		}
	    		break;
	    }
		player.status = 'STILL';
	});

	//Disable Right Mouse Click Default Menu
	window.addEventListener('contextmenu', function(event) {
		event.preventDefault();
	});

	//Mouse Click Event Handlers
	window.addEventListener('mousedown', function(event) {
		switch (event.button) {
	    	case 0: // Shoot
	    		if(status == 'PLAYING') {
		    		if(!this.world.bounty_board.menu_open && !world.show_world_complete_dialog) {
		    			player.shoot();	
		    		} else if(this.world.bounty_board.menu_open) {
		    			if(crosshair.checkCollision(crosshair.x, crosshair.y , crosshair.height, crosshair.width, this.world.bounty_board.x - 130, this.world.bounty_board.y - 175, 175, 400)) {
		    				world = new World(player);
		    				world.generateDungeon(player);
		    			}
		    		} else if(world.show_world_complete_dialog) {
		    			//Return to town button
		    			if(crosshair.checkCollision(crosshair.x, crosshair.y , crosshair.height, crosshair.width,  world.level_complete_dialog.btn_x, world.level_complete_dialog.btn_y, world.level_complete_dialog.btn_height, world.level_complete_dialog.btn_width)) {
		    				world = new World(player);
		    				world.generate_town();
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

	    	case 2:
	    		break;
	    }
	}, false);

	//Mouse Movement Event Handlers
	window.addEventListener('mousemove', function(event) {
		crosshair.update(event.x, event.y);
	}, false);
	
	var draw = function() {
		if(status == 'PAUSED') {
			context.fillStyle = 'black';
			context.fillRect(0, 0, 1100, 600);

			world.draw(context, player.x);
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

			world.draw(context, player.x);
			player.draw(context);
			ui.draw(context);

			if(!world.town) {
				if(world.level_complete_dialog.show) {
					world.level_complete_dialog.draw(context, world.total_dungeon_xp, world.total_dungeon_gold);
				}
			}

			crosshair.draw(context);
		} else if(status == 'TITLE') {
			title.draw(context);
			crosshair.draw(context);
		} else if(status == 'DEAD') {
			world.draw(context, player.x);
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

		world.update(player);
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
		//Allow player to move past camera move points
		//when camera is walled
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

		if(world.boss_fight_ready) {
			this.snap_x = 'ALL';
			this.snap_y = 'ALL';
		}

		//Move camera if player hits padding
		if(status == 'PLAYING') {
			//Music
			if(!this.music_playing) {
				this.game_music = new Audio('audio/theme.mp3');
				this.game_music.volume = .0;
				this.game_music.load();
				this.game_music.play();

				this.music_playing = true;
			}

			//Player collision with camera edges
			if(player.x + player.width >= camera.rect['width'] + camera.rect['x']) {
				if(this.snap_x != 'RIGHT' && this.snap_x != 'ALL' && player.motion['RIGHT']) {
					player.x -= player.speed;

					world.status = 'RIGHT';
				}
			} else if(player.x <= camera.rect['x']) {
				if(this.snap_x != 'LEFT' && this.snap_x != 'ALL' && player.motion['LEFT']) {
					player.x += player.speed;

					world.status = 'LEFT';
				}
			}

			if(player.y <= camera.rect['y']) {
				if(this.snap_y != 'TOP' && this.snap_y != 'ALL' && player.motion['UP']) {
					player.y += player.speed;

					world.status = 'UP';
				}
			} else if(player.y + player.height >= camera.rect['height'] + camera.rect['y']) {
				if(this.snap_y != 'BOTTOM' && this.snap_y != 'ALL' && player.motion['DOWN']) {
					player.y -= player.speed;

					world.status = 'DOWN';
				}
			}

			update();
			draw();
		} else if(status == 'PAUSED') {
			draw();
		} else if(status == 'TITLE') {
			draw();
		} else if(status == 'DEAD') {
			//Sink that ship
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
