class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, speedMultiply = 1) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);                                       // add object to existing scene
        this.moveSpeed = 3;                                             // pixel per frame on "ground"
        this.airSpeed = 2;                                              // pixel per frame on "air"
        this.grounded = false;                                          // if on ground
        this.goingUp = false;                                           // if it's going up
        this.jumpHeight;                                                // y cord of where to stop going up
    }

    // NOTE: 75 is a hard-coded number for a floor
    update() {
        if (this.y >= game.config.height - 75) {
            this.grounded = true;
        }

        // move left or right regardless of the state
        if(keyA.isDown && this.x >= 0) {                            // move left
            this.x -= this.moveSpeed;
        } else if (keyD.isDown && this.x <= game.config.width) {    // move right
            this.x += this.moveSpeed;
        }

        if (this.grounded) {
            if (keyW.isDown && this.y >= 0) {                    // jump
                this.grounded = false;
                this.goingUp = true;
                this.jumpHeight = this.y - 100;                 // change height limit for jump here
                this.y -= this.airSpeed;
            }
        } else {
            if (this.goingUp) {
                this.y -= this.airSpeed;
                if (this.y <= this.jumpHeight) {
                    this.goingUp = false;
                }
            } else {
                this.y += this.airSpeed;
            }
        }
    }
}