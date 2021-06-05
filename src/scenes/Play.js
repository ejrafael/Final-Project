class Play extends Phaser.Scene
{
    constructor()
    {
       super("Play"); 
    }

    preload()
    {
        this.load.atlas("PlayerAtlas", "./assets/Animations/Player_Atlas.png", "./assets/Animations/Player_Atlas.json");
        this.load.image("PinkSquareSprite", "./assets/single_sprites/pink_square.png");
        this.load.image("OrangeRectSprite", "./assets/single_sprites/orange_rect.png");
        this.load.image("StoneTilesetImage", "./assets/levels/StoneBrick_Tileset.png");
        this.load.audio("jumpFx", "./assets/sounds/fx/Jump.wav");
        this.load.audio("landFx", "./assets/sounds/fx/Land.wav");
        this.load.audio("music_majorTheme", "./assets/music/Spirit Flow Music_Major.mp3");
        this.load.audio("music_minorTheme", "./assets/music/Spirit Flow Music_Minor.mp3");
        this.load.tilemapTiledJSON("TestLevel", "./assets/levels/Tutorial_Level.json");
    }

    create()
    {
        console.log("entered the Play scene");
        
        /*
        this.music = this.sound.add("music_majorTheme", 
        {
            loop:true,
            volume: 0.15,
        });
        this.music.play();
        */ 
        this.music = this.sound.add("music_minorTheme", 
        {
            loop:true,
            volume: 0.06,
        });
        this.music.play();

        this.tutorial_level_map = this.add.tilemap("TestLevel")

        this.playerSpawn = this.tutorial_level_map.findObject("Object", obj => obj.name === "Player_Spawn")
        this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y);
        //this.player = new Player(this, game.config.width/2, game.config.height);

        this.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            walk: new WalkState(),
            attack: new AttackState(),
            boost: new BoostState(),
            hurt: new HurtState(),
            wallcling: new WallClingState(),
            inair: new InAirState(),
        }, [this, this.player]);

        this.cameraMain = this.cameras.main;
        this.platformerCamera = new PlatformerCamera(this, this.player, this.cameraMain);
        
        const stoneTileset = this.tutorial_level_map.addTilesetImage("StoneBrick", "StoneTilesetImage")

        
        this.Platform_Layer = this.tutorial_level_map.createLayer("Platform", stoneTileset, 0, 0);

        this.env = this.add.group();

        //this.env.add(new Ground(this, game.config.width/2, game.config.height, "OrangeRectSprite", 50))
        // this.env.add(obj1)
        // let obj2 = new Ground(this, game.config.width * .75 , game.config.height/2, "OrangeRectSprite", 1, 1.5);
        // this.env.add(obj2)

        //tilemap debugging
        let i = 0
        this.tutorial_level_map.forEachTile(
        (tile)=>
        {
            let obj = new Ground(this, this.tutorial_level_map.tileToWorldX(tile.x, this.cameraMain), this.tutorial_level_map.tileToWorldY(tile.y, this.cameraMain), "PinkSquareSprite", .25, .25);
            this.env.add(obj)
            ++i
        }, 
        this, 0, 0, 40, 23, 
        {
            isNotEmpty: true,
            //isColliding: true
        },
         "Platform")
        console.log(i + " tiles")

        this.Platform_Layer.setCollisionByProperty({
            Collides: true 
        });
           


        this.physics.add.collider(this.player, this.Platform_Layer);
        //this.physics.add.collider(this.player, this.Test_Layer);

        // temp singular enemy object
        this.enemy = new Obstacle(this, game.config.width/3, game.config.height*.82, "OrangeRectSprite");
        this.enemy.setScale(.75);



        //Setup keys for whole game
        this.keys = this.input.keyboard.addKeys({
            'w':     Phaser.Input.Keyboard.KeyCodes.W,
            'a':     Phaser.Input.Keyboard.KeyCodes.A,
            's':     Phaser.Input.Keyboard.KeyCodes.S,
            'd':     Phaser.Input.Keyboard.KeyCodes.D,
            'plus':  Phaser.Input.Keyboard.KeyCodes.PLUS,
            'minus': Phaser.Input.Keyboard.KeyCodes.MINUS,
            'up':    Phaser.Input.Keyboard.KeyCodes.UP,
            'left':  Phaser.Input.Keyboard.KeyCodes.LEFT,
            'down':  Phaser.Input.Keyboard.KeyCodes.DOWN,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
            'x': Phaser.Input.Keyboard. KeyCodes.X,
        });
    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.
        /*
        Please multiply any movements that are happening in the update function by this variable.
        That way they don't speed up on high refresh rate displays. Ask Ethan for more help/info
        if you are unsure.
        */

        //Failsafe code
       if(this.player.y > game.config.width * 1.5) {
            this.player.reset();
       }
        

        if(Phaser.Input.Keyboard.JustDown(this.keys.plus)) {
            this.player.debugOn = !this.player.debugOn;
            console.log("PlayerDebug = " + this.player.debugOn);
        }
        //This doesn't work
        if(Phaser.Input.Keyboard.JustDown(this.keys.minus)) {
            this.tutorial_level_map.setLayer
        }
        this.platformerCamera.update(time, delta);
        this.playerFSM.step();
        this.player.update();
        this.enemy.update(this);
        this.player.drawDebug();
    }
}