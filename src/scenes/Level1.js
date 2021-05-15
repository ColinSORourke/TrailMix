class Level1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }
    create() {

        const SCALE = 0.5;
        const tileSize = 35;

        // set bg color
        this.cameras.main.setBackgroundColor('#227B96');

        // draw grid lines for jump height reference
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 0.1);
        for(let y = 3000; y >= 35; y -= 35) {
            graphics.lineBetween(0, y, 3000, y);
        }
        for(let x = 3000; x >= 35; x -= 35) {
            graphics.lineBetween(x, 0, x, 3000);
        }

        // make ground tiles group
        this.ground = this.add.group();

        this.makeLevel();
        
        // Player
        this.player = new Player(this, 50, 2800, 'Scout', 0, MAX_X_VEL, MAX_Y_VEL, ACCELERATION, DRAG, JUMP_VELOCITY).setOrigin(0.5, 1);;

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // add physics collider between player & ground group
        this.physics.add.collider(this.player, this.ground);

        // set up main camera to follow the player
        this.cameras.main.setBounds(0, 0, 3000, 3000);
        this.cameras.main.setDeadzone(400, 200);
        this.cameras.main.setZoom(1);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset( 0, 150);

        let player = this.player
        let scene = this;

        // Add Objects that give player trail mix
        // Once we have actual sprites for the ingredients, we can load these as the MixObj class (see MixObj.js)

        this.nutsObj = this.add.rectangle(550, 2650, 10, 10, 0x928C6F).setOrigin(0,0);
        this.physics.world.enable(this.nutsObj);
        this.nutsObj.body.immovable = true;
        this.physics.add.overlap(this.player, this.nutsObj, function(){
            player.nuts = true;
            scene.updateText();
        });

        this.raisinObj = this.add.rectangle(500, 2650, 10, 10, 0x4B3F72).setOrigin(0,0);
        this.physics.world.enable(this.raisinObj);
        this.raisinObj.body.immovable = true;
        this.physics.add.overlap(this.player, this.raisinObj, function(){
            if (player.inventory.length < 2 && !player.inventory.includes("raisin")){
                player.inventory.push("raisin");
                scene.updateText();
            }
        });

        this.chocObj = this.add.rectangle(450, 2650, 10, 10, 0x5A464C).setOrigin(0,0);
        this.physics.world.enable(this.chocObj);
        this.chocObj.body.immovable = true;
        this.physics.add.overlap(this.player, this.chocObj, function(){
            if (player.inventory.length < 2 && !player.inventory.includes("chocolate")){
                player.inventory.push("chocolate");
                scene.updateText();
            }
        });

        this.bananObj = this.add.rectangle(400, 2650, 10, 10, 0xFFFACC).setOrigin(0,0);
        this.physics.world.enable(this.bananObj);
        this.bananObj.body.immovable = true;
        this.physics.add.overlap(this.player, this.bananObj, function(){
            if (player.inventory.length < 2 && !player.inventory.includes("banana")){
                player.inventory.push("banana");
                scene.updateText();
            }
        });

        this.door = this.add.rectangle(2861, 2850, 50, 50, 0xFFFFFF).setOrigin(0,0);
        this.physics.world.enable(this.door);
        this.door.body.immovable = true;
        this.door.body.allowGravity = false;
        this.physics.add.overlap(this.player, this.door, this.goToNextScene.bind(this));

        // Add Status Text
        this.statusText = this.add.text(0, 0, 'Inventory: [] State: Normal').setOrigin(0, 0)
        // This makes Status Text stay in the same spot on screen, regardless of where camera goes
        this.statusText.setScrollFactor(0,0);
    }

    update() {
        this.player.update();
    }

    goToNextScene() {
        if (cursors.down.isDown) {
            this.scene.start('menuScene');
        }
    }

    // Give player ingredient function. Currently unused, but could be bound to my ingredient objects.
    givePlayer(mix){
        if (mix == "nuts"){
            this.player.nuts = true;
        }
        else {
            if (player.inventory.length < 2 && !player.inventory.includes(mix)){
                player.inventory.push(mix);
                scene.updateText();
            }
        }
    }

    // Function to update Status text to reflect player status
    updateText(){
        if (this.player.nuts){
            this.statusText.text = "Inventory: Nuts, " + this.player.inventory + " State: " + this.player.powerUpState
        }
        else {
            this.statusText.text = "Inventory: " + this.player.inventory + " State: " + this.player.powerUpState
        }
    }

    makeLevel() {
        let groundTile = this.physics.add.sprite(0, 2900, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 35;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);

        groundTile = this.physics.add.sprite(300, 2800, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 30;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);

        groundTile = this.physics.add.sprite(0, 2700, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 25;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);

        groundTile = this.physics.add.sprite(2500, 2900, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 25;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);

        groundTile = this.physics.add.sprite(2950, 2500, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 1;
        groundTile.scaleY = 10;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);
    }
}