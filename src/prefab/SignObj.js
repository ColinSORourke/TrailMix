class SignObj extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame, player, text) {
        super(scene, x, y, key, frame);

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.immovable = true;
        this.setOrigin(0,0);
        this.setDepth(-1);

        scene.physics.add.overlap(player, this, function(){
            player.arrow.visible = true;
            if (Phaser.Input.Keyboard.JustDown(cursors.up)){
                let graphics = scene.add.graphics();
                // Add Background
                let SBGW = 350, SBGH = 200;
                let signBackground = graphics.fillStyle(0x964B00, 1).fillRoundedRect(game.config.width/2 - SBGW/2, game.config.height/2 - SBGH/2, SBGW, SBGH, 8).setScrollFactor(0).setName('Sign');
                // Add text and it's warping property
                let myText = scene.add.bitmapText(game.config.width/2, game.config.height/2, 'gem', text, 20).setOrigin(0.5).setScrollFactor(0,0);
                myText.maxWidth = game.config.width / 3;
                
                
                scene.tweens.add({
                    targets: [myText, signBackground],
                    alpha: 0,
                    duration: 6000,
                    ease: 'Linear',
                    onComplete: function() {
                      myText.destroy();
                    }
                  });
            }
        });
    }
}