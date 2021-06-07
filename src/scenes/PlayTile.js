class PlayTile extends Phaser.Scene {
    constructor() {
        super("playTileScene");
    }

    init(data) {
        this.level = data
    }

    create() {
        // Basic Tilemap stuff
        const map = this.add.tilemap(this.level);
        this.map = map;
        this.xBounds = map.widthInPixels;
        this.yBounds = map.heightInPixels;

        // Background graphics
        this.BGGroup = this.add.group();
        this.BackgroundBase = this.add.tileSprite(0, 0, 1024, 768, "BackgroundBase").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.BackgroundBase);
        this.Mountains = this.add.tileSprite(0, -50, 1024, 768, "Mountains").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.Mountains);
        this.CloudsBack = this.add.tileSprite(0, 0, 1024, 768, "CloudsBack").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.CloudsBack);
        this.CloudsMid = this.add.tileSprite(0, 0, 1024, 768, "CloudsMid").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.CloudsMid);
        this.CloudsFront = this.add.tileSprite(0, 0, 1024, 768, "CloudsFront").setOrigin(0,0.25).setScrollFactor(0);
        this.BGGroup.add(this.CloudsFront);
        this.TreesBack = this.add.tileSprite(0, 0, 1024, 768, "TreesBack").setOrigin(-0.1,0.1).setScrollFactor(0.2);
        this.BGGroup.add(this.TreesBack);
        this.TreesMid = this.add.tileSprite(0, 0, 1024, 768, "TreesMid").setOrigin(-0.1,0.1).setScrollFactor(0.4);
        this.BGGroup.add(this.TreesMid);
        this.TreesFront = this.add.tileSprite(0, 0, 1024, 698, "TreesFront").setOrigin(0,0.1).setScrollFactor(0.6);
        this.BGGroup.add(this.TreesFront);

        this.BGGroup.setDepth(-10);
        this.physics.world.checkCollision.left = true;
        this.physics.world.checkCollision.right = true;
        this.physics.world.checkCollision.up = false;
        this.physics.world.checkCollision.down = false;
        this.physics.world.bounds.width = map.widthInPixels;
        

        const tileset = map.addTilesetImage('TilesetV4', 'tileset');

        // Create all relevant layers
        const pillarLayer = map.createLayer('PillarLayer', tileset, 0, 0);
        const bgLayer = map.createLayer('Background', tileset, 0, 0);
        this.bushLayer = map.createLayer('BushLayer', tileset, 0, 0);
        const hazardLayer = map.createLayer('HazardLayer', tileset, 0, 0);
        const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
        this.cloudLayer = map.createLayer('CloudLayer', tileset, 0, 0);

        // Define how each layer will collide
        terrainLayer.setCollisionByProperty({
            collides: true,
        });

        setCondCollideDirs(this.cloudLayer, {
            left: false,
            right: false,
            up: true,
            down: false
        });
        
        this.bushLayer.setCollisionByProperty({
            condCollides: true
        });

        setCondCollideDirs(pillarLayer, {
            left: false,
            right: false,
            up: true,
            down: false
        });

        // Create and place Player at spawn
        const p1Spawn = map.findObject("Spawns", obj => obj.name === "playerSpawn");
        this.player = new Player(this, p1Spawn.x, p1Spawn.y, 'Scout', 'scout-idle-00', MAX_X_VEL, MAX_Y_VEL, ACCELERATION, DRAG, JUMP_VELOCITY).setOrigin(0.5, 1);
        this.player.setDepth(10);
        var player = this.player;
        this.player.body.setCollideWorldBounds();

        const nextLevel = map.findObject("Spawns", obj => obj.type === "nextLevel");
        let camp = this.add.rectangle(nextLevel.x, nextLevel.y, nextLevel.width, nextLevel.height, 0xff6699).setOrigin(0,0);
        camp.alpha = 0.001;
        this.physics.add.existing(camp);
        camp.body.immovable = true;
        this.physics.add.overlap(this.player, camp, function(){
            player.arrow.alpha = 1;
            if (Phaser.Input.Keyboard.JustDown(cursors.up)){
                this.sound.play('sfx_levelcomplete');
                this.scene.start('playTileScene', nextLevel.name);
            }
        }, null, this);

        // Make player collide with Terrain & Trees
        this.physics.add.collider(this.player, terrainLayer);
        this.physics.add.collider(this.player, pillarLayer);
        this.physics.add.collider(this.player.crate, terrainLayer);
        this.physics.add.collider(this.player.crate, pillarLayer);
        

        this.collideBush(true);
        this.cloudLayer.alpha = 0.6;

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Go through object layer for Ingredient Objects
        this.mixObjs = map.filterObjects("Spawns", obj => obj.type === "mixObj");
        for (let i = 0; i < this.mixObjs.length; i++){
            let mix = this.mixObjs[i];
            let myObj = new MixObj(this, mix.x + 8, mix.y - 8, 'Mix', mix.name, player, false, 'sfx_' + mix.name);
            myObj.setDepth(-1);
        }

        this.signObjs = map.filterObjects("Spawns", obj => obj.type === "signObj");
        for (let i = 0; i < this.signObjs.length; i++){
            let sign = this.signObjs[i];
            let myObj = new SignObj(this, sign.x, sign.y, 'sign', 0, player, sign.name);
            myObj.setDepth(-1);
        }

        this.hazardObjs = map.filterObjects("Spawns", obj => obj.type === "Hazard");
        for (let i = 0; i < this.hazardObjs.length; i++){
            let hazard = this.hazardObjs[i];
            this.addHazardRectangle(hazard.x, hazard.y, hazard.width, hazard.height);
        }

        this.breakObjs = map.filterObjects("Spawns", obj => obj.type === "breakObj");
        for (let i = 0; i < this.breakObjs.length; i++){
            let breakable = this.breakObjs[i];
            let block = this.add.sprite(breakable.x, breakable.y -16, 'block', 0).setOrigin(0,0);
            this.physics.add.existing(block);
            block.body.immovable = true;
            this.physics.add.collider(this.player, block, function() {
                if (player.powerUpState == "Breaker"){
                    this.sound.play('sfx_blockbreak');
                    block.destroy();
                }
            }, null, this);
            this.physics.add.collider(this.player, block);
            this.physics.add.collider(this.player.crate, block);
            block.setDepth(2);
        }

        // set bg color
        this.cameras.main.setBackgroundColor('#227B96');

        bgLayer.setDepth(-2);
        pillarLayer.setDepth(-1);
        this.bushLayer.setDepth(0);
        this.cloudLayer.setDepth(0);
        this.player.setDepth(0);
        hazardLayer.setDepth(1);
        terrainLayer.setDepth(2);
        

        // draw grid lines for jump height reference
        /* 
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 0.1);
        for(let y = map.heightInPixels; y >= 0; y -= 16) {
            graphics.lineBetween(0, y, map.widthInPixels, y);
        }
        for(let x = map.widthInPixels; x >= 0; x -= 16) {
            graphics.lineBetween(x, 0, x, map.heightInPixels);
        } 
        */

        // set up main camera to follow the player
        this.cameras.main.setBounds(0, -200, map.widthInPixels, map.heightInPixels + 200);
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(0, 50);

        this.firstUpdate = true;

        // Add UI elements

        this.inventoryGroup = this.add.group();
        this.addUIElements();
    }

    update() {
        this.player.update();

        if (this.firstUpdate){
            console.log(this.cameras.main.scrollY);
            this.TreesBack.y = this.cameras.main.scrollY * 0.2;
            this.TreesMid.y = this.cameras.main.scrollY * 0.4;
            this.TreesFront.y = this.cameras.main.scrollY * 0.6;

            let rect = new Phaser.Geom.Rectangle(0, this.TreesFront.y + 30, game.config.width, 90);

            this.particleManager = this.add.particles('leaf');
            this.emitter = this.particleManager.createEmitter({
                frame: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
                gravityY: 8,
                maxVelocityY: 42,
                lifespan: 20000,
                frequency: 180,
                rotate: {min: -30, max: 30},
                flip: {min: 0, max: 1},
                emitZone: { source: rect},
                particleClass: AnimParticle
            });
            this.emitter.setScrollFactor(0.6);
            this.particleManager.setDepth(-10);
            this.firstUpdate = false;

        }

        this.CloudsBack.tilePositionX -= 0.003;
        this.CloudsMid.tilePositionX += 0.005;
        this.CloudsFront.tilePositionX -= 0.007;

        if ( Phaser.Input.Keyboard.JustDown(keyR)){
            this.restart();
        }
    }

    // Creates or removes a collider for the Cloud Layer
    collideClouds(boolean){
        if (boolean){
            this.cloudCollider = this.physics.add.collider(this.player, this.cloudLayer);
            this.cloudCrate = this.physics.add.collider(this.player.crate, this.cloudLayer);
            this.cloudLayer.alpha = 1;
        } else {
            this.physics.world.removeCollider(this.cloudCollider);
            this.physics.world.removeCollider(this.cloudCrate);
            this.cloudLayer.alpha = 0.6;
        }
    }

    // Creates or removes a collider for the tree layer
    collideBush(boolean){
        if (boolean){
            this.bushCollider = this.physics.add.collider(this.player, this.bushLayer);
            this.bushCrate = this.physics.add.collider(this.player.crate, this.bushLayer);
            this.bushLayer.alpha = 1;
        } else {
            this.physics.world.removeCollider(this.bushCollider);
            this.physics.world.removeCollider(this.bushCrate);
            this.bushLayer.alpha = 0.6;
        }
    }

    // Function to update Status UI to reflect player status
    updateText(){
        // Update Nuts Alphas + State Text
        this.nutsSprite.alpha = (this.player.nuts) ? 1 : 0.3;
        this.statusText.text = "Power: " + this.player.powerUpState;
        if (!this.player.passive){
            this.statusText.text += " (D)";
        }

        // Add appropriate ingredient sprites UI
        for (var index = 0; index < this.player.getSize(); ++index){
            let inventorySprite = this.add.sprite(game.config.width/3 - 40 + (index+1) * 32, 210, 'Mix', this.player.inventory[index]);
            inventorySprite.setScrollFactor(0);
            inventorySprite.setDepth(10);
            this.inventoryGroup.add(inventorySprite);
        }
    }

    addHazardRectangle(x, y, width, height){
        let hazard = this.add.rectangle(x, y, width, height, 0xff6699).setOrigin(0,0);
        hazard.alpha = 0.001;
        this.physics.add.existing(hazard);
        hazard.body.immovable = true;
        this.physics.add.overlap(this.player, hazard, this.restart, null, this);
        this.physics.add.collider(this.player.crate, hazard);
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

        let graphics = this.add.graphics();

        // UIBackground Box
        //UIGroup.add(this.add.rectangle(0, 0, game.config.width, 240, 0x000000).setOrigin(0, 0).setScrollFactor(0).setName('UIBackground'));

        let UILeftC = graphics.fillStyle(0x8e827b, 1).fillRoundedRect(0, 0, 435, 240, 8).setScrollFactor(0).setName('UILeftC');
        UIGroup.add(UILeftC);
        UIGroup.add(graphics.lineStyle(2, 0x72655d, 1).strokeRoundedRect(0, 0, 435, 240, 8).setScrollFactor(0).setName('UILeftCstroke'));

        
        UIGroup.add(graphics.fillStyle(0x8e827b, 1).fillRoundedRect(game.config.width/2-25, 0, 48, 240, 8).setScrollFactor(0));
        UIGroup.add(graphics.lineStyle(2, 0x72655d, 1).strokeRoundedRect(game.config.width/2-25, 0, 48, 240, 8).setScrollFactor(0));
        //UIGroup.add(this.add.rectangle(game.config.width/2-25, 0, 48, 240, 0x000000).setOrigin(0, 0).setScrollFactor(0).setName('UICenter'));
        UIGroup.add(graphics.fillStyle(0x8e827b, 1).fillRoundedRect(game.config.width - 400, 0, 240, 240, 8).setScrollFactor(0).setName('UI'));
        UIGroup.add(graphics.lineStyle(2, 0x72655d, 1).strokeRoundedRect(game.config.width - 400, 0, 240, 240, 8).setScrollFactor(0));
        // Add Status Text
        this.statusText = this.add.bitmapText(game.config.width/4+5, 230, 'gem', 'state: normal', 16).setOrigin(0, 0.5).setScrollFactor(0,0).setName('statusText');
        UIGroup.add(this.statusText);

        // Add Journal/Menu Button
        this.menuButton = this.add.bitmapText(game.config.width/2, 215, 'gem', 'MENU', 20).setOrigin(0.5).setScrollFactor(0,0);
        // Give Menu Button purpose
        this.menuButton.setInteractive();
        this.menuButton.on('pointerdown', () => {
            this.sound.play('sfx_select');
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

        let camWidth = 250;
        if ( this.xBounds / 5 < 250) {
            camWidth = this.xBounds / 5
        }

        this.minimap = this.cameras.add(game.config.width - 275, 14, camWidth, 70).setZoom(0.2, 0.2).setName('mini');
        this.minimap.setBackgroundColor(0xcc99cc);
        this.minimap.setBounds(0, 0, this.xBounds, this.yBounds);
        this.minimap.startFollow(this.player);
        this.minimap.ignore(UIGroup);
        this.minimap.ignore(this.BGGroup);
        
        // Add opaque Nuts Sprite to inventory display
    
        this.nutsSprite = this.add.sprite(game.config.width/3 - 40, 210, 'Mix', 'nuts');
        this.nutsSprite.alpha = 0.5;
        this.nutsSprite.setScrollFactor(0);
        UIGroup.add(this.nutsSprite);

        UIGroup.setDepth(10);
        this.updateText();
    }

    // Launch Pause Scene
    pause() {
        this.player.jumping = true;
        this.scene.pause();
        this.scene.launch('pauseScene', { srcScene: "playTileScene", srcLevel: this.level});
    }


    // Restart the Scene
    restart(){
        this.sound.play('sfx_reset');
        console.log('restarting scene');
        this.scene.start('playTileScene', this.level);
    }
}


// Rough function to go through a tile layer and set the tiles with "condCollides: true" to only collide in a specific set of directions
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