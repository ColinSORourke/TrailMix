class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {

    }

    create() {
        this.tempSprite = this.add.rectangle(-50, -50, 50, 50, 0xFFFFFF).setOrigin(0, 0);
        this.floor = this.add.rectangle(0, game.config.height - 50, game.config.width, 50, 0xFF00FF).setOrigin(0, 0);

        this.player = new Player(this, 50, 50, this.tempSprite);
        // define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    update() {
        this.player.update();
    }
}