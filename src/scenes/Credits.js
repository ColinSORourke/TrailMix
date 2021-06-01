class Credits extends Phaser.Scene {
    constructor() {
      super("creditsScene");
    }

    preload() {
    }

    create() {
        // Title
        this.add.bitmapText(game.config.width/2, game.config.height/3 - 150, 'gem', 'CREDITS:', 48).setOrigin(0.5);
        
        this.add.bitmapText(game.config.width/2, game.config.height/3 - 50, 'gem', 'Programmers:', 40).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2, game.config.height/3, 'gem', 'Colin O\'Rourke', 28).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2, game.config.height/3 + 50, 'gem', 'Dennis Zabluda', 28).setOrigin(0.5);

        this.add.bitmapText(game.config.width/2, game.config.height/2, 'gem', 'Artist:', 40).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2, game.config.height/2 + 50, 'gem', 'Daniel Aughenbaugh', 28).setOrigin(0.5);

<<<<<<< HEAD
        // Menu 
        let MenuButton = this.add.bitmapText(game.config.width/2, game.config.height/2 + 150, 'gem', 'Back', 40).setOrigin(0.5);
=======
        this.add.bitmapText(game.config.width/2, game.config.height/2 + 150, 'gem', 'Other Contributions:', 40).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2, game.config.height/2 + 200, 'gem', 'Ambient Forest and Wind Sounds by @BurghRecords on YouTube', 28).setOrigin(0.5);

        // Menu
        let MenuButton = this.add.bitmapText(game.config.width/2, game.config.height/2 + 300, 'gem', 'Back', 40).setOrigin(0.5);
>>>>>>> de24c3612172cb3c8683c7e0497ff0b1a0e9300d

        // Menu Button
        MenuButton.setInteractive();
        MenuButton.on('pointerdown', () => {
        this.scene.start('menuScene');
        });
    }
}