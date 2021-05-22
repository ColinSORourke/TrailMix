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
        var JMBackgroundWidth = 200, JMBackgroundLenght = 300;
        var JMBackground = this.add.rectangle(game.config.width/2 - JMBackgroundWidth/2, game.config.height/2 - JMBackgroundLenght/2 + 25, JMBackgroundWidth, JMBackgroundLenght, 0xFF0000).setOrigin(0, 0);

        // Add Menu text & button
        var menuButton = this.add.text(game.config.width/2, game.config.height/2 - 50, 'Menu').setOrigin(0.5);

        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('menuScene');
        });

        var backButton = this.add.text(game.config.width/2, game.config.height/2 + 50, 'Back').setOrigin(0.5);

        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.resume(this.pausedScene);
            this.scene.stop();
        });
    }

}