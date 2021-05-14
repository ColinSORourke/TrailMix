class Player extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,key, frame, maxVX = 300, maxVY = 300, acceleration = 400, drag = 600, jump_velocity = -1000) {
        super(scene, x, y, key, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.maxVelocity.x = maxVX;
        this.body.maxVelocity.y = maxVY;
        this.ACCELERATION = acceleration;
        this.DRAG = drag;    
        this.JUMP_VELOCITY = jump_velocity;
        this.respawnX = x;
        this.respawnY = y;
    }

    update() {
        if (-5 <= this.x && this.x <= 3005 &&
            -5 <= this.y && this.y <= 3005) {
            // check keyboard input
            if(cursors.left.isDown) {
                this.body.setAccelerationX(-this.ACCELERATION);
                this.setFlip(true, false);         
            } else if(cursors.right.isDown) {
                this.body.setAccelerationX(this.ACCELERATION);
                this.resetFlip();          
            } else {
                // set acceleration to 0 so DRAG will take over
                this.body.setAccelerationX(0);
                this.body.setDragX(this.DRAG);
            }

            if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
                this.debug();
            }


            // use JustDown to avoid 'pogo' jumps if you player keeps the up key held down
            // note: there is unfortunately no .justDown property in Phaser's cursor object
            if(this.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
                this.body.setVelocityY(this.JUMP_VELOCITY);
            }
        } else {
             this.x = this.respawnX;
             this.y = this.respawnY;
        }
    }

    debug() {
        console.log("X: " + this.x + " | Y: " + this.y);
    }
}