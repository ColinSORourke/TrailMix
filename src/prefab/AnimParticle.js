// TAKEN LARGELY FROM PHASER EXAMPLE: https://phaser.io/examples/v3/view/game-objects/particle-emitter/custom-particles
class AnimParticle extends Phaser.GameObjects.Particles.Particle
{
    constructor (emitter)
    {
        super(emitter);

        let config = {
            key: 'float',
            frames: emitter.manager.scene.anims.generateFrameNumbers('leaf'),
            frameRate: 5,
            repeat: -1, 
        };

        this.anim = emitter.manager.scene.anims.create(config);
        this.t = 0;
        this.i = 0;
    }

    update (delta, step, processors)
    {
        var result = super.update(delta, step, processors);

        this.t += delta;

        if (this.t >= this.anim.msPerFrame)
        {
            this.i++;

            if (this.i > 25)
            {
                this.i = 0;
            }

            this.frame = this.anim.frames[this.i].frame;

            this.t -= this.anim.msPerFrame;
        }

        return result;
    }
}