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

                // Add text and it's warping property
                let myText = scene.add.bitmapText(game.config.width/2, game.config.height/2, 'gem', text, 20).setOrigin(0.5).setScrollFactor(0,0);
                myText.maxWidth = game.config.width / 3;
                let bounds = myText.getTextBounds(true);
                myText.setDepth(10);

                // Add Background
                let SBGW = bounds.global.width + 50, SBGH = bounds.global.height + 50;
                let signBackground = graphics.fillStyle(0x964B00, 1).fillRoundedRect(game.config.width/2 - SBGW/2, game.config.height/2 - SBGH/2, SBGW, SBGH, 8).setScrollFactor(0).setName('Sign');
                signBackground.setDepth(9);

                // Delay Call then 'destory' the sign
                scene.time.delayedCall(1500, () => {
                scene.tweens.add({
                    targets: [myText, signBackground],
                    alpha: 0,
                    duration: 3000,
                    ease: 'Linear',
                    onComplete: function() {
                      myText.destroy();
                    }
                  });
                }, null, this);
            }
        });
    }
}