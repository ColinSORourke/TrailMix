class Player extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,key, frame, maxVX = 300, maxVY = 300, acceleration = 400, drag = 600, jump_velocity = -1000) {
        super(scene, x, y, key, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        // APPLY PHYSICS
        this.body.maxVelocity.x = maxVX;
        this.body.maxVelocity.y = maxVY;
        this.MAXVX = maxVX;
        this.MAXVY = maxVY;
        this.ACCELERATION = acceleration;
        this.DRAG = drag;    
        this.JUMP_VELOCITY = jump_velocity;
        this.body.setGravityY(1500);


        this.SCENE = scene;        

        //this.setCollideWorldBounds(true);
        this.jumping = false;
        
        // Trail Mix Bag
        this.nuts = false;
        this.inventory = [];

        // Related to Powerups / Movement
        this.powerUpState = "normal";
        this.resetOnGround = false;
        this.resetOnBonk = false;
        this.resetOnCollide = false;
        this.mobile = true;

        this.respawnX = x;
        this.respawnY = y;
    }

    update() {
        // check out of bounds
        if (this.x <= -5 || 3005 <= this.x || this.y <= -5 || 3005 <= this.y) {
            this.reset();
            this.x = this.respawnX;
            this.y = this.respawnY;
        }

        // MOVING LEFT/RIGHT LOGIC
        if (this.mobile){
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
        }
        
        // Some Collision checking
        // Ceiling Collision
        if (this.body.touching.up){
            if (this.resetOnBonk){
                this.reset();
            }
            this.jumping = true;
        }
        // Ground Collision
        if (this.body.touching.down){
            if (this.resetOnGround){
                this.reset();
            }
            if (this.jumping){
                this.jumping = false;
            }
        }
        // Side collision
        if (this.body.touching.left || this.body.touching.right){
            if (this.resetOnCollide){
                this.reset();
            }
        }

        // JUMPING LOGIC - this more complicated jump gives us variable size jumps depending on quick taps/longer hold
        if(!this.jumping && ( Phaser.Input.Keyboard.DownDuration(cursors.up, 300) || Phaser.Input.Keyboard.DownDuration(keySPACE, 300) )&& this.mobile) {
            this.body.setVelocityY(this.JUMP_VELOCITY);
        }
        if(Phaser.Input.Keyboard.UpDuration(cursors.up) || Phaser.Input.Keyboard.UpDuration(keySPACE)) {
	    	this.jumping = true;
	    }
        if((!this.jumping)&&(Phaser.Input.Keyboard.JustDown(keySPACE) || Phaser.Input.Keyboard.JustDown(cursors.up))) {
            this.scene.sound.play('sfx_jump');
        }

        // POWERUP BUTTONS
        // Eat Trail Mix
        if(Phaser.Input.Keyboard.JustDown(keyF)){
            this.eatMix();
        }

        // Do Powerup Action (maybe)
        if (Phaser.Input.Keyboard.JustDown(keyD)){
            this.doPowerup();
        }

        // Debug: get player's position
        if (Phaser.Input.Keyboard.JustDown(cursors.down)){
            this.debugGetLocation();
        }
    }

    // Switch inventory to correct PowerupState
    eatMix(){
        if (this.nuts && this.inventory.length == 2){
            // Not sure if there is a better way to do this
            if (this.inventory.includes("raisin") && this.inventory.includes("chocolate")){
                this.powerUpState = "superDash";
            }
            if (this.inventory.includes("banana") && this.inventory.includes("chocolate")){
                this.powerUpState = "superJump";
            }
            if (this.inventory.includes("banana") && this.inventory.includes("raisin")){
                this.powerUpState = "glide";
            }
            this.nuts = false;
            this.inventory = [];
            this.SCENE.updateText();
        }
    }


    // DO POWERUP SWITCH STATEMENT
    doPowerup(){
        switch (this.powerUpState){
            case "normal":
                break;
            case "superJump":
                this.superJump();
                break;
            case "glide":
                this.glide();
                break;
            case "superDash":
                this.superDash();
                break;
        }
    }

    // Reset body to a default state
    reset(){
        this.body.setDragX(0);
        this.body.setAccelerationX(0);
        switch (this.powerUpState){
            case "none":
                break;
            case "glide":
                this.body.setGravityY(1500);
                this.body.maxVelocity.x = this.MAXVX;
                this.resetOnGround = false;
                this.jumping = false;
                break;
            case "superJump":
                this.body.setGravityY(1500);
                this.body.setVelocityY(0);
                this.resetOnBonk = false;
                this.mobile = true;
                this.jumping = false;
                break;
            case "superDash":
                this.body.setGravityY(1500);
                this.body.setVelocityX(0);
                this.resetOnCollide = false;
                this.mobile = true;
                break;
        }
    }

    hardReset(){
        this.powerUpState = "normal";
        this.nuts = false;
        this.inventory = [];

        this.body.maxVelocity.x = this.MAXVX;
        this.body.maxVelocity.y = this.MAXVY;
        this.body.setGravityY(1500);
        this.body.setDragX(0);
        this.body.setAccelerationX(0);
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
        
        this.jumping = false;

        this.powerUpState = "normal";
        this.resetOnGround = false;
        this.resetOnBonk = false;
        this.resetOnCollide = false;
        this.mobile = true;

        this.x = this.respawnX;
        this.y = this.respawnY;
    }


    // POWERUPS GO HERE
    // Press D while on the ground to SuperJump, going up until you hit a ceiling
    superJump(){
        if (this.body.touching.down){
            this.body.setVelocityY(-800)
            this.body.setGravityY(0)
            this.jumping = true;
            this.mobile = false;
            this.resetOnBonk = true;
        }
    }

    // Press D to superDash, moving quickly in the direction you're facing until you hit a wall
    superDash(){
        let direction = 800;
        if (this.flipX){
            direction = -800
        }
        this.body.setVelocityX(direction)
        this.body.setVelocityY(0);
        this.body.setDragX(0);
        this.body.setGravityY(0)
        this.mobile = false;
        this.resetOnCollide = true;
    }

    // Press D while midair to begin gliding
    glide(){
        if (!this.body.touching.down){
            this.body.setVelocityY(0);
            this.body.maxVelocity.x = this.MAXVX*1.25;
            this.body.setGravityY(70);
            this.resetOnGround = true;
            this.jumping = true;
        }
    }

    // DEBUG FUNCTIONS //
    debugGetLocation() {
        console.log("X: " + this.x + " | Y: " + this.y);
    }
}