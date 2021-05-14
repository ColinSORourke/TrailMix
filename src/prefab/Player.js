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

        this.body.setGravityY(1500);

        //this.setCollideWorldBounds(true);

        this.jumping = false;
        this.powerUpState = "none";


        this.resetOnGround = false;
    }

    update() {
        // check keyboard input

        if(cursors.left.isDown) {
            this.body.setDragX(0);
            this.body.setAccelerationX(-this.ACCELERATION);
            this.setFlip(true, false);         
        } else if(cursors.right.isDown) {
            this.body.setDragX(0);
            this.body.setAccelerationX(this.ACCELERATION);
            this.resetFlip();          
        } else {
            // set acceleration to 0 so DRAG will take over
            this.body.setAccelerationX(0);
            this.body.setDragX(this.DRAG);
        }


        if (this.body.touching.up){
            this.jumping = true;
        }

        if (this.jumping && this.body.touching.down){
            if (this.resetOnGround){
                this.reset();
            }
            this.jumping = false;
        }

        if(!this.jumping && Phaser.Input.Keyboard.DownDuration(cursors.up, 300)) {
            this.body.setVelocityY(this.JUMP_VELOCITY);
        }

        if(Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumping = true;
	    }

        if(Phaser.Input.Keyboard.JustDown(keyF)){
            this.powerUpState = "glide";
            this.setTint(0x2978A0);
        }

        if (Phaser.Input.Keyboard.JustDown(keyD)){
            this.doPowerup();
        }
    }

    doPowerup(){
        switch (this.powerUpState){
            case "none":
                break;
            case "superJump":
                this.superJump();
                break;
            case "glide":
                this.glide();
                break;
        }
    }

    superJump(){

    }

    glide(){
        this.body.setGravityY(100);
        this.resetOnGround = true;
    }

    reset(){
        switch (this.powerUpState){
            case "none":
                break;
            case "glide":
                this.body.setGravityY(1500);
                this.resetOnGround = false;
                break;
        }
    }
}