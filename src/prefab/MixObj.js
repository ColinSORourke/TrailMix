class MixObj extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,key, frame, player, mix, infinite) {
        super(scene, x, y, key, frame);

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.immovable = true;
    
        let self = this;
        if (mix == "nuts"){
            scene.physics.add.overlap(player, this, function(){
                if (!player.nuts){
                    player.nuts = true;
                    scene.updateText();
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
                    if (!infinite){
                        self.destroy();
                    }
                }
            });
        }
    }

}