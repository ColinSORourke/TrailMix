class MixObj extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame, player, infinite, sound) {
        super(scene, x, y, key, frame);

        let mix = frame;

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.immovable = true;
    
        let self = this;

        scene.physics.add.overlap(player, this, function(){
            player.nuts = (mix == 'nuts' || player.nuts) ? true : false;
            console.log(player.nuts);
            if (mix != 'nuts' && player.inventory.length < 2 && !player.inventory.includes(mix)){
                player.inventory.push(mix);
                if (!infinite){
                    self.destroy();
                }
            }
            scene.sound.play(sound);
            scene.updateText();
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