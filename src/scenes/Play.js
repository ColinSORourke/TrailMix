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

        // create camera control configuration object to pass to Camera Controller (see below)
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Cameras.Controls.html#.SmoothedKeyControlConfig__anchor
        let controlConfig = {
            camera: this.cameras.main,      // which camera?
            left: cursors.left,             // define keys...
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            zoomSpeed: 0.01,
            acceleration: 0.05,             // physics values (keep these low)
            drag: 0.0005,
            maxSpeed: 0.4
        }
        // create smoothed key camera control
        // i.e., we control the cam w/ the defined keys w/ physics controls
        // note: you *must* call the update method of this controller each frame (see below)
        // https://photonstorm.github.io/phaser3-docs/Phaser.Cameras.Controls.SmoothedKeyControl.html
        this.camControl = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        // configure main camera (bg image is 3000x3000)
        this.cameras.main.setBounds(0, 0, 3000, 3000);
        this.cameras.main.setZoom(1);

        this.cameras.main.startFollow(this.player);
    }

    update(time, delta) {
        // update our camera controller (delta: Δ time in ms since last frame)
        //this.camControl.update(delta);

        this.player.update();
        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.player, this.player.width/2);
    }
}