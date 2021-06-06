class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        this.pausedScene = data.srcScene;
        this.pausedLevel = data.level;
    }

    create(){
        
        console.log("pause created");

        var spacing = 64;
        let graphics = this.add.graphics();
        
        // CENTER WINDOW START //
        // Add Background
        var JMBackgroundWidth = 200, JMBackgroundLength = 275;
        var JMBackground = graphics.fillStyle(0xBFAFA6, 1).fillRoundedRect(game.config.width/2 - JMBackgroundWidth/2, game.config.height/2 - JMBackgroundLength/2 + 25, JMBackgroundWidth, JMBackgroundLength, 8);
        let BGBorder = graphics.lineStyle(6, 0xAA968A, 1).strokeRoundedRect(game.config.width/2 - JMBackgroundWidth/2, game.config.height/2 - JMBackgroundLength/2 + 25, JMBackgroundWidth, JMBackgroundLength, 8).setScrollFactor(0);

        // Add Menu text & button
        var menuButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - JMBackgroundLength/4, 'gem', 'MAIN MENU', 32).setOrigin(0.5);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.sound.play('sfx_select');
            this.scene.stop(this.pausedScene);
            this.scene.start('menuScene');
        });

        // Add Reset text & button
        var resetButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - JMBackgroundLength/4 + spacing, 'gem', 'RESET', 32).setOrigin(0.5);
        resetButton.setInteractive();
        resetButton.on('pointerdown', () => {
            this.sound.play('sfx_select');
            this.scene.stop(this.pausedScene);
            this.scene.start('playTileScene', this.pausedLevel);
        });

        // Add Controls & button
        var controlsButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - JMBackgroundLength/4 + spacing*2, 'gem', 'CONTROLS', 32).setOrigin(0.5);
        controlsButton.setInteractive();
        controlsButton.on('pointerdown', () => {
            //this.scene.stop(this.pausedScene);
            enterFromGame = true;
            this.sound.play('sfx_select');
            this.scene.start('controlsScene');
        });

        // Add Back text & button
        var backButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - JMBackgroundLength/4 + spacing*3, 'gem', 'BACK', 32).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.sound.play('sfx_select');
            this.scene.resume(this.pausedScene);
            this.scene.stop();
        });

        
        // CENTER WINDOW END //

        // LEFT JOURNAL WINDOW START //
        // Add Background
        var JBackground = this.add.sprite(game.config.width/5 - 200, game.config.height/5, "journal").setOrigin(0,0);
        JBackground.setScale(2,1.9);
        //var JBackground = this.add.rectangle(game.config.width/5 - JBackgroundWidth/2, game.config.height/5, JBackgroundWidth, JBackgroundLength, 0xFF0000).setOrigin(0, 0);

        // Add Journal Title
        var JournalTitle = this.add.bitmapText(game.config.width/5 + 40, game.config.height/5 + 22, 'gem', 'JOURNAL', 38).setOrigin(0.5);
        JournalTitle.tint = '0x000000';

        // Add text to show for all player's known ingredients
        var line = 1, once = true, pageCenter = game.config.width/5;
        for (let [key, value] of known) {
            if (line > 6 & once) {
                once = false;
                // Add Journal 2 BG
                var SecJBackground = this.add.sprite(game.config.width*4/5 - 225, game.config.height/5, "journal").setOrigin(0,0);
                SecJBackground.setScale(2,1.9);
                // Add Journal 2 Title
                var SecJournalTitle = this.add.bitmapText(game.config.width*4/5 + 40, game.config.height/5 + 22, 'gem', 'JOURNAL 2', 38).setOrigin(0.5);
                SecJournalTitle.tint = '0x000000';
                pageCenter = game.config.width*4/5 - 16;
                line = 1;
            }
            let string = this.add.bitmapText(pageCenter + 16, game.config.height/4 + 63 * line, 'gem', value[0] + ' + ' + value[1] + ' = ' + key, 21).setOrigin(0.5);
            string.tint = '0x000000';
            let bounds = string.getTextBounds(true);
            
            let ingre1 = this.add.sprite(bounds.global.x + (bounds.global.width/5), bounds.global.y - 16, 'Mix', value[0]).setScale(2.5);
            let ingre2 = this.add.sprite(bounds.global.x + (bounds.global.width/2), bounds.global.y - 16, 'Mix', value[1]).setScale(2.5);

            ++line;
        }

        // LEFT JOURNAL WINDOW END //
        
    }

}