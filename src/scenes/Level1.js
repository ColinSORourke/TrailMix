class Level1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }
    create() {
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

        for (let floor = 0; floor < 10; ++floor) {
            var x = (floor % 2) ? 500 : 0;
            var y = 3000 - floor * 100;
            let groundTile = this.physics.add.sprite(x, y, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.scaleX = 35;
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        
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
        this.cameras.main.setZoom(1);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset( 0, 150);

        // add 'door' to next level
        this.door = this.add.rectangle(1312, 2048, 50, 50, 0xFFFFFF).setOrigin(0,0);
        this.physics.world.enable(this.door);
        this.door.body.immovable = true;
        this.door.body.allowGravity = false;
        this.physics.add.overlap(this.player, this.door, this.goToNextScene.bind(this));
    }

    update() {
        this.player.update();
    }

    goToNextScene() {
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.scene.start('level2Scene');
        }
    }
}