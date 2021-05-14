class Level2 extends Phaser.Scene {
    constructor() {
        super("level2Scene");
    }
    create() {
    // make ground tiles group
    this.ground = this.add.group();

    for (let floor = 0; floor < 10; ++floor) {
        var x = 300*floor;
        var y = 100 + floor * 100;
        let groundTile = this.physics.add.sprite(x, y, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 15;
        groundTile.body.immovable = true;
        groundTile.body.allowGravity = false;
        this.ground.add(groundTile);
    }
    
    // Player
    this.player = new Player(this, 50, 50, 'Scout', 0, MAX_X_VEL, MAX_Y_VEL, ACCELERATION, DRAG, JUMP_VELOCITY);

    // set up Phaser-provided cursor key input
    cursors = this.input.keyboard.createCursorKeys();

    // add physics collider between player & ground group
    this.physics.add.collider(this.player, this.ground);

    // set up main camera to follow the player
    this.cameras.main.setBounds(0, 0, 3000, 3000);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setFollowOffset(0, 150);

    // add 'door' to next level
    this.door = this.add.rectangle(2735, 940, 50, 50, 0xFFFFFF).setOrigin(0,0);
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
        this.scene.start('menuScene');
    }
}
}