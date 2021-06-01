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

        // set player hitbox
        this.body.setSize(this.width/2.4, this.height-3);
        this.body.setOffset(14, 3);

        this.SCENE = scene;        

        this.jumping = false;

        // Trail Mix Bag
        this.nuts = false;
        this.inventory = [];
        this.ingredientObjs = [];

        // Related to Powerups / Movement
        this.powerUpState = "Normal";
        this.doingPower = false;
        this.resetOnGround = false;
        this.resetOnBonk = false;
        this.resetOnCollide = false;
        this.mobile = true;

        this.crate = scene.add.sprite(-100, y-12, 'crate', 0);
        scene.physics.world.enable(this.crate);
        this.crate.body.setGravityY(0);
        this.crate.body.immovable = true;
        scene.physics.add.collider(this, this.crate);
        

        this.portX = x;
        this.portY = y;

        this.respawnX = x;
        this.respawnY = y;

        this.initializeAnims();

        this.arrow = scene.add.sprite(this.x, this.y - 36, 'arrow');
        this.arrow.alpha = 0.001;
    }

    initializeAnims(){
        let idleFrameNames = this.anims.generateFrameNames('Scout', { prefix: 'scout-idle-', end: 3, zeroPad: 2 });
        let runFrameNames = this.anims.generateFrameNames('Scout', { prefix: 'scout-run-', end: 5, zeroPad: 2 });
        let jumpFrameNames = this.anims.generateFrameNames('Scout', { prefix: 'scout-jump-', end: 3, zeroPad: 2 });
        let fallFrameNames = this.anims.generateFrameNames('Scout', { prefix: 'scout-fall-', end: 1, zeroPad: 2 });
        let glideFrameNames = this.anims.generateFrameNames('Scout', { prefix: 'scout-glide-', end: 1, zeroPad: 2 })

        this.anims.create({
            key: 'scoutIdle',
            frames: idleFrameNames,
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'scoutRun',
            frames: runFrameNames,
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'scoutJump',
            frames: jumpFrameNames,
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'scoutFall',
            frames: fallFrameNames,
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'scoutGlide',
            frames: glideFrameNames,
            frameRate: 6,
            repeat: -1
        });
        
        this.animFSM = new StateMachine('idle', {
            idle: new IdleState(),
            run: new RunState(),
            jump: new JumpState(),
            fall: new FallState(),
            power: new PowerState(),
            glide: new GlideState(),
        }, [this]);
    }

    update() {
        if (this.body.touching.none && this.arrow.visible){
            this.arrow.alpha = 0.001;
        }
        this.arrow.x = this.x;
        this.arrow.y = this.y - 36;
        this.animFSM.step();
        // check out of bounds
        if ((this.y <= -5 && this.doingPower)){
            this.reset();
        }
        if (this.scene.yBounds <= this.y) {
            this.scene.restart();
        }

        // MOVING LEFT/RIGHT LOGIC
        // (NOTE: Because Drag does not get applied unless the player stops moving, the player turning feels kinda slippery - FIX THIS)
        if (this.mobile){
            if(cursors.left.isDown) {
                if (this.body.velocity.x > 0){
                    this.body.setVelocityX(0);
                }
                this.body.setDragX(0);
                this.body.setAccelerationX(-this.ACCELERATION);
                this.setFlip(true, false);         
            } else if(cursors.right.isDown) {
                if (this.body.velocity.x < 0){
                    this.body.setVelocityX(0);
                }
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
        if (this.body.blocked.up){
            if (this.powerUpState == "Hang"){
                this.body.setGravityY(0);
                this.resetHang = true;
            }
            else if (this.resetOnBonk){
                this.reset();
            }
            this.jumping = true;
        }
        if (this.resetHang && this.scene.map.getTileAtWorldXY(this.arrow.x, this.arrow.y, true, null, 'Terrain').index == -1){
            this.body.setGravityY(1500);
            this.resetHang = false;
        }

        // Ground Collision
        // (NOTE: Even though the player passes through ingredients, these still count as touching down, making jump logic through ingredients weird - FIX THIS)
        if (this.body.blocked.down || this.body.touching.down){
            
            if (this.resetOnGround){
                this.reset();
            }
            if (this.jumping && !keySPACE.isDown){
                this.jumping = false;
            }
            if (this.body.maxVelocity.x != this.MAXVX && !this.doingPower){
                this.body.maxVelocity.x = this.MAXVX;
            }
        }
        // Side collision
        if (this.body.blocked.left || this.body.blocked.right){
            if (this.resetOnCollide){
                this.reset();
            }
        }

        // JUMPING LOGIC - this more complicated jump gives us variable size jumps depending on quick taps/longer hold
        if(!this.jumping && ( Phaser.Input.Keyboard.DownDuration(keySPACE, 320) ) && this.mobile) {
            this.body.setVelocityY(this.JUMP_VELOCITY);
        }
        if(Phaser.Input.Keyboard.UpDuration(keySPACE)) {
	    	this.jumping = true;
	    }
        // Play jump sfx
        if((!this.jumping) && (Phaser.Input.Keyboard.JustDown(keySPACE)) ) {
            this.body.maxVelocity.x *= 0.75;
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
        if ( this.movingCrate && Phaser.Input.Keyboard.DownDuration(keyD, 1000)){
            if (this.flipX){
                this.crate.body.setVelocityX(-80);
            } else {
                this.crate.body.setVelocityX(80);
            }
        } else if (this.movingCrate){
            this.crate.body.setGravityY(0);
            this.movingCrate = false;
            this.crate.body.immovable = true;
            this.crate.body.setVelocityX(0);
        }
        if(Phaser.Input.Keyboard.UpDuration(keyD)) {
	    	this.crate.body.setGravityY(0);
            this.crate.body.setVelocityX(0);
            this.movingCrate = false;
            this.crate.body.immovable = true;
	    }
        

        // discard ingredients 
        if(Phaser.Input.Keyboard.JustDown(keyS)){
            this.discardIngredients();
        }

        // Debug: get player's position
        if (Phaser.Input.Keyboard.JustDown(cursors.down)){
            this.debugGetLocation();
        }
    }

    // Switch inventory to correct PowerupState
    eatMix(){
        if (this.nuts && this.inventory.length == 2){
            if (this.powerUpState == "Cloud Walk"){
                this.scene.collideClouds(false);
            }
            if (this.powerUpState == "Bush Walk"){
                this.scene.collideBush(true);
            }
            if (this.powerUpState == "Teleport"){
                this.scene.particles.destroy();
            }
            if (this.powerUpState == "Shrink"){
                this.setScale(1);
                this.body.setGravityY(1500);
            }
            this.reset();

            // Not sure if there is a better way to do this
            if (this.inventory.includes("raisin") && this.inventory.includes("chocolate")){
                this.powerUpState = "Super Dash";
                

                if (!known.get("Super Dash")) {
                    known.set("Super Dash", ["raisin", "chocolate"]);
                }
            }
            if (this.inventory.includes("banana") && this.inventory.includes("chocolate")){
                this.powerUpState = "Super Jump";
                

                if (!known.get("Super Jump")) {
                    known.set("Super Jump", ["banana", "chocolate"]);
                }
            }
            if (this.inventory.includes("banana") && this.inventory.includes("raisin")){
                this.powerUpState = "Glide";
                

                if (!known.get("Glide")) {
                    known.set("Glide", ["banana", "raisin"]);
                }
            }
            if (this.inventory.includes("cranberry") && this.inventory.includes("raisin")){
                this.powerUpState = "Teleport";
                this.scene.particles = this.scene.add.particles('spark');
                let particles = this.scene.particles;

                this.scene.tpEmitter =  particles.createEmitter({
                    x: this.x,
                    y: this.y,
                    speed: 25,
                    lifespan: 250,
                    blendMode: 'ADD'
                });
                this.portX = this.x;
                this.portY = this.y;

                if (!known.get("Teleport")) {
                    known.set("Teleport", ["cranberry", "raisin"]);
                }
            }
            if (this.inventory.includes("cranberry") && this.inventory.includes("banana")){
                this.powerUpState = "Cloud Walk";

                this.scene.collideClouds(true);

                if (!known.get("Cloud Walk")) {
                    known.set("Cloud Walk", ["cranberry", "banana"]);
                }
            }
            if (this.inventory.includes("cranberry") && this.inventory.includes("chocolate")){
                this.powerUpState = "Bush Walk";
                
                this.scene.collideBush(false);

                if (!known.get("Bush Walk")) {
                    known.set("Bush Walk", ["cranberry", "chocolate"]);
                }
            }
            if (this.inventory.includes("pretzel") && this.inventory.includes("raisin")){
                this.powerUpState = "Shrink";

                this.setScale(0.5);
                this.body.setGravityY(1000);
                if (!known.get("Shrink")) {
                    known.set("Shrink", ["pretzel", "raisin"]);
                }
            }
            if (this.inventory.includes("pretzel") && this.inventory.includes("chocolate")){
                this.powerUpState = "Hang";

                if (!known.get("Hang")) {
                    known.set("Hang", ["pretzel", "chocolate"]);
                }
            }
            if (this.inventory.includes("pretzel") && this.inventory.includes("cranberry")){
                this.powerUpState = "Breaker";

                if (!known.get("Breaker")) {
                    known.set("Breaker", ["pretzel", "cranberry"]);
                }
            }
            if (this.inventory.includes("pretzel") && this.inventory.includes("banana")){
                this.powerUpState = "Crate";

                if (!known.get("Crate")) {
                    known.set("Crate", ["pretzel", "banana"]);
                }
            }

            // Play sfx
            this.scene.sound.play('sfx_mixing');
            this.scene.sound.play('sfx_nuts');
            this.scene.sound.play('sfx_' + this.inventory[0]);
            this.scene.sound.play('sfx_' + this.inventory[1]);

            this.nuts = false;
            this.inventory = [];
            this.ingredientObjs = [];
            this.SCENE.inventoryGroup.clear(true);
            this.SCENE.updateText();
        }
    }


    // DO POWERUP SWITCH STATEMENT
    doPowerup(){
        switch (this.powerUpState){
            case "normal":
                break;
            case "Super Jump":
                this.superJump();
                break;
            case "Glide":
                this.glide();
                break;
            case "Super Dash":
                this.superDash();
                break;
            case "Teleport":
                this.teleport();
                break;
            case "Hang":
                this.body.setGravityY(1500);
                this.resetHang = false;
                break;
            case "Crate":
                this.doCrate();
                break;
            case "Cloud Walk":
                break;
            
        }
    }

    pause(){
        this.mobile = false;
        this.setStatic(true);
    }

    unpause(){
        this.mobile = true;
        this.setStatic(false);
    }

    // Reset body to a default state
    reset(){
        this.animFSM.transition('idle');
        this.body.setDragX(0);
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
        this.body.setAccelerationX(0);
        this.doingPower = false;
        switch (this.powerUpState){
            case "none":
                break;
            case "Glide":
                this.body.setGravityY(1500);
                this.body.maxVelocity.x = this.MAXVX;
                this.resetOnGround = false;
                this.jumping = false;
                break;
            case "Super Jump":
                this.body.setGravityY(1500);
                this.body.setVelocityY(0);
                this.resetOnBonk = false;
                this.mobile = true;
                this.jumping = false;
                break;
            case "Super Dash":
                this.body.setGravityY(1500);
                this.body.setVelocityX(0);
                this.resetOnCollide = false;
                this.mobile = true;
                break;
            case "Hang":
                this.body.setGravityY(1500);
                break;
            case "Crate":
                this.movingCrate = false;
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
        scout.animFSM.transition('idle');

        this.x = this.respawnX;
        this.y = this.respawnY;

        this.portX = this.respawnX;
        this.portY = this.respawnY;
    }


    // POWERUPS GO HERE
    // Press D while on the ground to SuperJump, going up until you hit a ceiling
    superJump(){
        if (this.body.blocked.down){
            this.doingPower = true;
            this.mobile = false;
            this.body.setVelocityX(0);
            this.body.setAccelerationX(0);
            this.body.setVelocityY(-800);
            this.body.setGravityY(0);
            this.jumping = true;
            this.resetOnBonk = true;
        }
    }

    // Press D to superDash, moving quickly in the direction you're facing until you hit a wall
    superDash(){
        this.body.maxVelocity.x = 300;
        this.doingPower = true;
        let direction = 300;
        if (this.flipX){
            direction = -300
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
        if (!this.body.blocked.down){
            this.doingPower = true;
            this.body.setVelocityY(0);
            this.body.maxVelocity.x = this.MAXVX*1.25;
            this.body.setGravityY(70);
            this.resetOnGround = true;
            this.jumping = true;
        }
    }

    releaseHang(){
        this.reset();
    }

    teleport(){
        this.scene.sound.play('sfx_tele');
        this.x = this.portX;
        this.y = this.portY;
    }

    doCrate(){
        this.crate.body.setGravityY(1000);
        this.movingCrate = true;
        this.crate.body.immovable = false;
        if (this.flipX){
            this.crate.y = this.y - 16;
            this.crate.x = this.x - 16;
        } else {
            this.crate.y = this.y - 16;
            this.crate.x = this.x + 16;
        }
    }

    // DEBUG FUNCTIONS //
    debugGetLocation() {
        console.log("X: " + this.x + " | Y: " + this.y);
        console.log(this.body.touching.down);
    }

    getSize() {
        return this.inventory.length;
    }

    discardIngredients(){
        for (let i = 0; i < this.ingredientObjs.length; i++){
            let myObj = this.ingredientObjs[i];
            new MixObj(this.scene, myObj.x, myObj.y, 'Mix', myObj.mix, this, false, 'sfx_' + myObj.mix);
        }
        this.nuts = false;
        this.inventory = [];
        this.ingredientObjs = [];
        this.SCENE.inventoryGroup.clear(true);
        this.SCENE.updateText();
    }
}

class IdleState extends State {
    enter(scout) {
        scout.anims.stop();
        scout.anims.play('scoutIdle');
    }

    execute(scout) {
        if (scout.doingPower){
            scout.animFSM.transition('power');
        }
        else if (scout.body.velocity.y < 0){
            scout.animFSM.transition('jump');
        }
        else if (scout.body.velocity.y > 0){
            scout.animFSM.transition('fall');
        }
        else if (scout.body.velocity.x != 0){
            scout.animFSM.transition('run');
        } 
    }
}

class RunState extends State {
    enter(scout) {
        scout.anims.stop();
        scout.anims.play('scoutRun');
    }

    execute(scout) {
        if (scout.doingPower){
            scout.animFSM.transition('power');
        }
        else if (scout.body.velocity.y < 0){
            scout.animFSM.transition('jump');
        }
        else if (scout.body.velocity.y > 0){
            scout.animFSM.transition('fall');
        }
        else if (scout.body.velocity.x == 0){
            scout.animFSM.transition('idle');
        }
    }
}

class JumpState extends State {
    enter(scout) {
        scout.anims.stop();
        scout.anims.play('scoutJump');
    }

    execute(scout) {
        if (scout.powerUpState == "Glide" && scout.doingPower){
            scout.animFSM.transition('glide');
        }
        else if (scout.doingPower){
            scout.animFSM.transition('power');
        }
        else if (scout.body.velocity.y >= 0){
            scout.animFSM.transition('fall');
        }
    }
}

class FallState extends State {
    enter(scout) {
        scout.anims.stop();
        scout.jumping = true;
        scout.anims.play('scoutFall');
    }

    execute(scout) {
        if (scout.powerUpState == "Glide" && scout.doingPower){
            scout.animFSM.transition('glide');
        }
        else if (scout.doingPower){
            scout.animFSM.transition('power');
        }
        else if (scout.body.velocity.y == 0){
            scout.animFSM.transition('idle');
        }
    }
}

class PowerState extends State{
    enter(scout) {
        scout.anims.stop();
        scout.setFrame('scout-powerup-00')
    }

    execute(scout) {
        // None
    }
}

class GlideState extends State{
    enter(scout) {
        scout.anims.stop();
        scout.anims.play('scoutGlide');
    }

    execute(scout) {
        if (scout.body.velocity.y == 0){
            scout.animFSM.transition('idle');
        }
    }
}