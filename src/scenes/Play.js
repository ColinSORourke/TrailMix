class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.atlas('Scout', './assets/ScoutAtlas.png', './assets/ScoutAtlas.json')
    }
    create() {

        const SCALE = 0.5;
        const tileSize = 35;

        // variables and settings
        this.ACCELERATION = 1000;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 1200;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -500;

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
        this.player = new Player(this, 50, 2800, 'Scout', 0, this.MAX_X_VEL, this.MAX_Y_VEL, this.ACCELERATION, this.DRAG, this.JUMP_VELOCITY).setOrigin(0.5, 1);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // add physics collider
        this.physics.add.collider(this.player, this.ground);

        this.cameras.main.setBounds(0, 0, 3000, 3000);
        this.cameras.main.setZoom(1);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset( 0, 150);
    }

    update() {
        this.player.update();
    }
}