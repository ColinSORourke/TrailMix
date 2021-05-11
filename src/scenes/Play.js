class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    create() {

        const SCALE = 0.5;
        const tileSize = 35;

        // variables and settings
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 600;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -1000;
        this.physics.world.gravity.y = 3000;

        // set bg color
        this.cameras.main.setBackgroundColor('#227B96');

        // draw grid lines for jump height reference
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 0.1);
        for(let y = game.config.height-70; y >= 35; y -= 35) {
            graphics.lineBetween(0, y, game.config.width, y);
        }
        for(let x = game.config.width-70; x >= 35; x -= 35) {
            graphics.lineBetween(x, 0, x, game.config.height);
        }

        // make ground tiles group
        this.ground = this.add.group();
        let groundTile = this.physics.add.sprite(0, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 55;
        groundTile.body.immovable = true;
        groundTile.body.allowGravity = false;
        this.ground.add(groundTile);
        
        // Player
        this.player = new Player(this, game.config.width/2, game.config.height/2, 'platformer_atlas', 0, this.MAX_X_VEL, this.MAX_Y_VEL, this.ACCELERATION, this.DRAG, this.JUMP_VELOCITY);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // add physics collider
        this.physics.add.collider(this.player, this.ground);

        this.cameras.main.setBounds(0, 0, 3000, 3000);
        this.cameras.main.setZoom(1);

        this.cameras.main.startFollow(this.player);
    }

    update() {

        this.player.update();
        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.player, this.player.width/2);
    }
}