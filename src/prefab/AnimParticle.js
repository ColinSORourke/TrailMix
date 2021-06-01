// TAKEN LARGELY FROM PHASER EXAMPLE: https://phaser.io/examples/v3/view/game-objects/particle-emitter/custom-particles
class AnimParticle extends Phaser.GameObjects.Particles.Particle
{
    constructor (emitter)
    {
        super(emitter);

        let config = {
            key: 'float',
            frames: this.anims.generateFrameNumbers('leaf'),
            frameRate: 18,
            repeat: -1
        };

        anim = this.anims.create(config);
        this.t = 0;
        this.i = 0;
    }

    update (delta, step, processors)
    {
        var result = super.update(delta, step, processors);

        this.t += delta;

        if (this.t >= anim.msPerFrame)
        {
            this.i++;

            if (this.i > 17)
            {
                this.i = 0;
            }

            this.frame = anim.frames[this.i].frame;

            this.t -= anim.msPerFrame;
        }

        return result;
    }
}