class MixObj extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame, player, infinite, sound) {
        super(scene, x, y, key, frame);

        this.mix = frame;
        let mix = this.mix;

        scene.physics.world.enable(this);
        let BG = scene.add.sprite(x, y, 'itemBG', 0).setDepth(-1);
        scene.add.existing(this);
        this.body.immovable = true;
    
        let self = this;

        scene.physics.add.overlap(player, this, function(){
            if ((mix == 'nuts' && !player.nuts)){
                player.nuts = true;
                player.ingredientObjs.push(self);
                scene.sound.play(sound);
                scene.updateText();
                if (!infinite){
                    BG.destroy();
                    self.destroy();
                }
            }
            if (mix != 'nuts' && player.inventory.length < 2 && !player.inventory.includes(mix)){
                player.inventory.push(mix);
                player.ingredientObjs.push(self);
                scene.sound.play(sound);
                scene.updateText();
                if (!infinite){
                    BG.destroy();
                    self.destroy();
                }
            }
        });

        // Note from Dennis: It's not really an effective way of doing this job
        /*
        if (mix == "nuts"){
            scene.physics.add.overlap(player, this, function(){
                if (!player.nuts){
                    player.nuts = true;
                    scene.updateText();
                    scene.sound.play(sound);
                    if (!infinite){
                        self.destroy();
                    }
                }
            });
        } else {
            scene.physics.add.overlap(player, this, function(){
                if (player.inventory.length < 2 && !player.inventory.includes(mix)){
                    player.inventory.push(mix);
                    scene.updateText();
                    scene.sound.play(sound);
                    if (!infinite){
                        self.destroy();
                    }
                }
            });
        }
        */
    }

}