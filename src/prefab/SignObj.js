class SignObj extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame, player, text) {
        super(scene, x, y, key, frame);

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.immovable = true;

        scene.physics.add.overlap(player, this, function(){
            if (Phaser.Input.Keyboard.JustDown(cursors.up)){
                let myText = scene.add.bitmapText(game.config.width/2, game.config.height/2, 'gem', text, 20).setOrigin(0.5).setScrollFactor(0,0);
                scene.tweens.add({
                    targets: myText,
                    alpha: 0,
                    duration: 3000,
                    ease: 'Linear',
                    onComplete: function() {
                      myText.destroy();
                    }
                  });
            }
        });
        }
    }