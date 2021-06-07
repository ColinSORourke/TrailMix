class SignObj extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame, player, text) {
        super(scene, x, y, key, frame);

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.immovable = true;
        this.setOrigin(0,0);

        scene.physics.add.overlap(player, this, function(){
            player.arrow.alpha = 1;
            if (Phaser.Input.Keyboard.JustDown(cursors.up)){
                let graphics = scene.add.graphics();

                // Add text and it's warping property
                let myText = scene.add.bitmapText(game.config.width/2, game.config.height/2, 'gem', text, 20).setOrigin(0.5).setScrollFactor(0,0);
                myText.maxWidth = game.config.width / 3;
                let bounds = myText.getTextBounds(true);
                myText.setDepth(20);

                // Add Background
                let SBGW = bounds.global.width + 50, SBGH = bounds.global.height + 50;
                let signBackground = graphics.fillStyle(0x94581D, 1).fillRoundedRect(game.config.width/2 - SBGW/2, game.config.height/2 - SBGH/2, SBGW, SBGH, 8).setScrollFactor(0).setName('Sign');
                signBackground.setDepth(20);
                let signBorder = graphics.lineStyle(6, 0x7A3D00, 1).strokeRoundedRect(game.config.width/2 - SBGW/2, game.config.height/2 - SBGH/2, SBGW, SBGH, 8).setScrollFactor(0);
                signBorder.setDepth(20);

                // Delay Call then 'destory' the sign
                scene.time.delayedCall(3000, () => {
                scene.tweens.add({
                    targets: [myText, signBackground],
                    alpha: 0,
                    duration: 1500,
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