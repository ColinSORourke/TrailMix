class PlayTile extends Phaser.Scene {
    constructor() {
        super("playTileScene");
    }

    init(data) {
        this.level = data
    }

    create() {
        this.BGGroup = this.add.group();
        this.BackgroundBase = this.add.tileSprite(0, 0, 1024, 768, "BackgroundBase").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.BackgroundBase);
        this.Mountains = this.add.tileSprite(0, 0, 1024, 768, "Mountains").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.Mountains);
        this.CloudsBack = this.add.tileSprite(0, 0, 1024, 768, "CloudsBack").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.CloudsBack);
        this.CloudsMid = this.add.tileSprite(0, 0, 1024, 768, "CloudsMid").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.CloudsMid);
        this.CloudsFront = this.add.tileSprite(0, 0, 1024, 768, "CloudsFront").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.CloudsFront);
        this.TreesBack = this.add.tileSprite(0, 0, 1024, 768, "TreesBack").setOrigin(-0.1,0.1).setScrollFactor(0.2);
        this.BGGroup.add(this.TreesBack);
        this.TreesMid = this.add.tileSprite(0, 0, 1024, 768, "TreesMid").setOrigin(-0.1,0).setScrollFactor(0.4);
        this.BGGroup.add(this.TreesMid);
        this.TreesFront = this.add.tileSprite(0, 0, 1024, 768, "TreesFront").setOrigin(-0.1,0.1).setScrollFactor(0.6);
        this.BGGroup.add(this.TreesFront);

        // Basic Tilemap stuff
        const map = this.add.tilemap(this.level);
        this.xBounds = map.widthInPixels;
        this.yBounds = map.heightInPixels;

        const tileset = map.addTilesetImage('TilesetV3', 'tileset');

        const bgLayer = map.createLayer('Background', tileset, 0, 0);
        const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
        this.cloudLayer = map.createLayer('CloudLayer', tileset, 0, 0);
        this.treeLayer = map.createLayer('TreeLayer', tileset, 0, 0);

        terrainLayer.setCollisionByProperty({
            collides: true,
        });

        setCondCollideDirs(this.cloudLayer, {
            left: false,
            right: false,
            up: true,
            down: false
        });
        
        this.treeLayer.setCollisionByProperty({
            condCollides: true
        });

        // Create and place Player at spawn
        const p1Spawn = map.findObject("Spawns", obj => obj.name === "playerSpawn");
        this.player = new Player(this, p1Spawn.x, p1Spawn.y, 'Scout', 'scout-idle-00', MAX_X_VEL, MAX_Y_VEL, ACCELERATION, DRAG, JUMP_VELOCITY).setOrigin(0.5, 1);
        var player = this.player;
        // Make player collide with Terrain
        this.physics.add.collider(this.player, terrainLayer);
        this.collideTrees(true);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        // Go through object layer for Ingredient Objects
        this.mixObjs = map.filterObjects("Spawns", obj => obj.type === "mixObj");
        for (let i = 0; i < this.mixObjs.length; i++){
            let mix = this.mixObjs[i];
            // new MixObj(this, mix.x + 8, mix.y - 8, 'Mix', mix.name, player, false, 'sfx_' + mix.name);
            new SignObj(this, mix.x + 8, mix.y - 8, 'Mix', mix.name, player, 'I AM NUTS');
        }

        // set bg color
        this.cameras.main.setBackgroundColor('#227B96');

        // // draw grid lines for jump height reference
        // let graphics = this.add.graphics();
        // graphics.lineStyle(2, 0xFFFFFF, 0.1);
        // for(let y = map.heightInPixels; y >= 0; y -= 16) {
        //     graphics.lineBetween(0, y, map.widthInPixels, y);
        // }
        // for(let x = map.widthInPixels; x >= 0; x -= 16) {
        //     graphics.lineBetween(x, 0, x, map.heightInPixels);
        // }

        // set up main camera to follow the player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(game.config.width / 5, game.config.height / 5);
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(0, 50);

        // Add UI elements
        this.inventoryGroup = this.add.group();
        this.addUIElements();
    }

    update() {
        this.player.update();
        this.CloudsBack.tilePositionX -= 0.003;
        this.CloudsMid.tilePositionX += 0.005;
        this.CloudsFront.tilePositionX -= 0.007;
    }

    collideClouds(boolean){
        if (boolean){
            this.cloudCollider = this.physics.add.collider(this.player, this.cloudLayer);
            console.log(this.cloudLayer);
        } else {
            this.physics.world.removeCollider(this.cloudCollider);
        }
    }

    collideTrees(boolean){
        if (boolean){
            this.treeCollider = this.physics.add.collider(this.player, this.treeLayer);
        } else {
            this.physics.world.removeCollider(this.treeCollider);
        }
    }

    // Function to update Status UI to reflect player status
    updateText(){
        // Update Nuts Alphas + State Text
        this.nutsSprite.alpha = (this.player.nuts) ? 1 : 0.3;
        this.statusText.text = "powerup: " + this.player.powerUpState;

        // Add appropriate ingredient sprites UI
        for (var index = 0; index < this.player.getSize(); ++index){
            let inventorySprite = this.add.sprite(game.config.width/3 - 40 + (index+1) * 32, 210, 'Mix', this.player.inventory[index]);
            inventorySprite.setScrollFactor(0);
            this.inventoryGroup.add(inventorySprite);
        }
    }

    addUIElements() {
        // UI Config
        let UIGroup = this.add.group();

        let UIConfig = {
            fontFamily: 'Garamond',
            fontSize: '20px',
            color: '#006400',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        // UIBackground Box
        UIGroup.add(this.add.rectangle(0, 0, game.config.width, 240, 0x000000).setOrigin(0, 0).setScrollFactor(0).setName('UIBackground'));

        // Add Status Text
        this.statusText = this.add.bitmapText(game.config.width/4+10, 230, 'gem', 'state: normal', 20).setOrigin(0, 0.5).setScrollFactor(0,0).setName('statusText');
        UIGroup.add(this.statusText);

        // Add Journal/Menu Button
        this.menuButton = this.add.bitmapText(game.config.width/2, 215, 'gem', 'MENU', 20).setOrigin(0.5).setScrollFactor(0,0);
        // Give Menu Button purpose
        this.menuButton.setInteractive();
        this.menuButton.on('pointerdown', () => {
            this.pause();
        });
        UIGroup.add(this.menuButton);

        // Add 3x grey box
        for (var i = 0; i <= 2; ++i) {
            if (i==0){
                UIGroup.add(this.add.rectangle(game.config.width/4 + 45 + 32*i, 198, 23, 23, 0x808080).setOrigin(0.5, 0).setStrokeStyle(2, 0xffcc00).setScrollFactor(0).setName('UIBackground'));
            }
            if (i>0){
                UIGroup.add(this.add.rectangle(game.config.width/4 + 45 + 32*i, 198, 23, 23, 0x808080).setOrigin(0.5, 0).setStrokeStyle(2, 0xFFFFFF).setScrollFactor(0).setName('UIBackground'));
            }
        }

        // Add mini-map camera
        this.minimap = this.cameras.add(game.config.width - 325, 20, 300, 60).setZoom(0.2).setName('mini');
        this.minimap.setBackgroundColor(0xcc99cc);
        this.minimap.setBounds(0, 0, this.xBounds, this.yBounds);
        this.minimap.scrollX = 1600;
        this.minimap.scrollY = 300;
        this.minimap.startFollow(this.player);
        this.minimap.ignore(UIGroup);
        this.minimap.ignore(this.BGGroup);
        
        // Add opage Nuts Sprite to inventory display
        this.nutsSprite = this.add.sprite(game.config.width/3 - 40, 210, 'Mix', 'nuts');
        this.nutsSprite.alpha = 0.5;
        this.nutsSprite.setScrollFactor(0);

        this.updateText();
    }

    // Launch Pause Scene
    pause() {
        this.scene.pause();
        this.scene.launch('pauseScene', { srcScene: "playTileScene"});
    }

    restart(){
        this.scene.start('playTileScene', "TiledTestJSON");
    }
}

function setCondCollideDirs(mapLayer, dirs) {
    var d = mapLayer.layer.data;
    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            var t = d[i][j];
            if (t.properties["condCollides"]) {
                t.setCollision(dirs["left"], dirs["right"], dirs["up"], dirs["down"], false);
            }
        }
    }
 
}