class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        this.pausedScene = data.srcScene;
    }

    create(){
        
        console.log("pause created");

        var spaceing = 64;
        let graphics = this.add.graphics();
        
        // CENTER WINDOW START //
        // Add Background
        var JMBackgroundWidth = 200, JMBackgroundLength = 275;
        var JMBackground = graphics.fillStyle(0x000000, 1).fillRoundedRect(game.config.width/2 - JMBackgroundWidth/2, game.config.height/2 - JMBackgroundLength/2 + 25, JMBackgroundWidth, JMBackgroundLength, 8);

        // Add Menu text & button
        var menuButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - JMBackgroundLength/4, 'gem', 'MENU', 32).setOrigin(0.5);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('menuScene');
        });

        // Add Reset text & button
        var resetButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - JMBackgroundLength/4 + spaceing, 'gem', 'RESET', 32).setOrigin(0.5);
        resetButton.setInteractive();
        resetButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('playTileScene', "TiledTestJSON");
        });

        // Add Controls & button
        var controlsButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - JMBackgroundLength/4 + spaceing*2, 'gem', 'SETTING', 32).setOrigin(0.5);
        controlsButton.setInteractive();
        controlsButton.on('pointerdown', () => {
            //this.scene.stop(this.pausedScene);
            enterFromGame = true;
            this.scene.start('controlsScene', "TiledTestJSON");
        });

        // Add Back text & button
        var backButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - JMBackgroundLength/4 + spaceing*3, 'gem', 'BACK', 32).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.resume(this.pausedScene);
            this.scene.stop();
        });

        
        // CENTER WINDOW END //

        // LEFT JOURNAL WINDOW START //
        // Add Background
        var JBackgroundWidth = 300, JBackgroundLength = 600;
        var JBackground = this.add.rectangle(game.config.width/5 - JBackgroundWidth/2, game.config.height/5 , JBackgroundWidth, JBackgroundLength, 0xFF0000).setOrigin(0, 0);

        // Add Journal Title
        var JournalTitle = this.add.bitmapText(game.config.width/5, game.config.height/5 + 32, 'gem', 'JOURNAL', 38).setOrigin(0.5);

        // Add text to show for all player's known ingredients
        var line = 1;
        for (let [key, value] of known) {
            let string = this.add.bitmapText(game.config.width/5, game.config.height/4 + 58 * line, 'gem', value[0] + ' + ' + value[1] + ' = ' + key, 18).setOrigin(0.5);
            let bounds = string.getTextBounds(true);
            let ingre1 = this.add.sprite(bounds.global.x + (bounds.global.width/5), bounds.global.y - 12, 'Mix', value[0]).setScale(2.5);
            let ingre2 = this.add.sprite(bounds.global.x + (bounds.global.width/2), bounds.global.y - 12, 'Mix', value[1]).setScale(2.5);

            ++line;
        }

        // LEFT JOURNAL WINDOW END //
        
    }

}