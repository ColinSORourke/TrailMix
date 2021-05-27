class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        this.pausedScene = data.srcScene;
    }

    create(){
        
        console.log("pause created");

        // Add Background
        var JMBackgroundWidth = 200, JMBackgroundLength = 200;
        var JMBackground = this.add.rectangle(game.config.width/2 - JMBackgroundWidth/2, game.config.height/2 - JMBackgroundLength/2 + 25, JMBackgroundWidth, JMBackgroundLength, 0x000000).setOrigin(0, 0);

        // Add Menu text & button
        var menuButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - 25, 'gem', 'MENU', 32).setOrigin(0.5);

        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('menuScene');
        });

        var backButton = this.add.bitmapText(game.config.width/2, game.config.height/2 + 75, 'gem', 'BACK', 32).setOrigin(0.5);

        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.resume(this.pausedScene);
            this.scene.stop();
        });
    }

}