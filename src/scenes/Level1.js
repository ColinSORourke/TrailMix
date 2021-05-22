class Level1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }
    create() {

        const SCALE = 0.5;
        const tileSize = 35;

        // set bg color
        this.cameras.main.setBackgroundColor('#227B96');

        // draw grid lines for jump height reference
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 0.1);
        for(let y = 3000; y >= 35; y -= 35) {
            graphics.lineBetween(0, y, 3000, y);
        }
        for(let x = 3000; x >= 35; x -= 35) {
            graphics.lineBetween(x, 0, x, 3000);
        }

        // make ground tiles group
        this.ground = this.add.group();

        this.makeLevel();
        
        // Player
        this.player = new Player(this, 50, 2800, 'Scout', 'scout-idle-00', MAX_X_VEL, MAX_Y_VEL, ACCELERATION, DRAG, JUMP_VELOCITY).setOrigin(0.5, 1);
        // set player hitbox
        this.player.body.setSize(this.player.width/2.4, this.player.height-3);
        this.player.body.setOffset(14, 3);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // add physics collider between player & ground group
        this.physics.add.collider(this.player, this.ground);

        // set up main camera to follow the player
        this.cameras.main.setBounds(0, 0, 3000, 3000);
        this.cameras.main.setDeadzone(game.config.width / 5, game.config.height / 5);
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(0, 50);

        let player = this.player
        let scene = this;

        // Add Objects that give player trail mix
        // Once we have actual sprites for the ingredients, we can load these as the MixObj class (see MixObj.js)

        this.nutsObj = new MixObj(this, 550, 2650, 'Mix', 'nuts', player, true, 'sfx_nut');

        this.raisinObj = new MixObj(this, 500, 2650, 'Mix', 'raisin', player, true, 'sfx_raisin');

        this.chocObj = new MixObj(this, 450, 2650, 'Mix', 'chocolate', player, true, 'sfx_chocolate');
    
        this.bananObj = new MixObj(this, 400, 2650, 'Mix', 'banana', player, true, 'sfx_banana');
        
        // Add door to the level that switch to another level
        this.door = this.add.rectangle(2861, 2850, 50, 50, 0xFFFFFF).setOrigin(0,0);
        this.physics.world.enable(this.door);
        this.door.body.immovable = true;
        this.door.body.allowGravity = false;
        this.physics.add.overlap(this.player, this.door, this.goToNextScene.bind(this));

        // Add UI elements
        this.addUIElements();

        // Add and update Inventory Group and element
        this.inventoryGroup = this.add.group();
        this.updateText();

        // Add Journal/Menu elements
        this.journalMenuShow = false;
        this.journalMenuGroup = this.add.group();
        this.addJournalMenuElements();
    }

    update() {
        if (this.journalMenuShow) {
            this.journalMenuGroup.setVisible(1);
            this.journalMenuGroup.setActive(1);
        } else {
            this.journalMenuGroup.setVisible(0);
            this.journalMenuGroup.setActive(0);
            this.player.update();
        }
    }

    goToNextScene() {
        if (cursors.down.isDown) {
            this.scene.start('menuScene');
        }
    }

    // Function to update Status text to reflect player status
    updateText(){
        // local sprite var
        var inventorySprite = this.add.sprite(game.config.width/3 - 40, 210, 'Mix', 'nuts');
        inventorySprite.alpha = (this.player.nuts) ? 1 : 0.5;
        this.inventoryGroup.add(inventorySprite);
        this.statusText.text = "State: " + this.player.powerUpState;

        for (var index = 0; index < this.player.getSize(); ++index){
            inventorySprite = this.add.sprite(game.config.width/3 - 40 + (index+1) * 16, 210, 'Mix', this.player.inventory[index]);
            this.inventoryGroup.add(inventorySprite);
            
        }
        inventorySprite.setScrollFactor(0);
    }

    makeLevel() {
        let groundTile = this.physics.add.sprite(0, 2900, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 35;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);

        groundTile = this.physics.add.sprite(300, 2800, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 30;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);

        groundTile = this.physics.add.sprite(0, 2700, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 25;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);

        groundTile = this.physics.add.sprite(2500, 2900, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 25;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);

        groundTile = this.physics.add.sprite(2950, 2500, 'platformer-atlas', 'block').setScale(SCALE).setOrigin(0);
        groundTile.scaleX = 1;
        groundTile.scaleY = 10;
        groundTile.body.immovable = true;
        this.ground.add(groundTile);
    }

    addUIElements() {
        // UI Config
        let UIGroup = this.add.group();

        let UIConfig = {
            fontFamily: 'Garamond',
            fontSize: '20px',
            color: '#006400',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }
        // UIBackground
        UIGroup.add(this.add.rectangle(0, 0, game.config.width, 240, 0xFF00FF).setOrigin(0, 0).setScrollFactor(0).setName('UIBackground'));

        // Add Status Text
        this.statusText = this.add.text(game.config.width/3, 230, 'State: Normal', UIConfig).setOrigin(0.5).setScrollFactor(0,0).setName('statusText');
        // This makes Status Text stay in the same spot on screen, regardless of where camera goes
        UIGroup.add(this.statusText);

        // Add Journal/Menu Button
        this.menuButton = this.add.text(game.config.width/2, 215, 'Journal/Menu', UIConfig).setOrigin(0.5);
        this.menuButton.setScrollFactor(0,0);

        this.menuButton.setInteractive();
        this.menuButton.on('pointerdown', () => {
            this.switchActiveJournalMenu();
        });
        UIGroup.add(this.menuButton);

        // Add mini-map
        this.minimap = this.cameras.add(game.config.width - 325, 20, 300, 60).setZoom(0.2).setName('mini');
        this.minimap.setBackgroundColor(0x227B96);
        this.minimap.setBounds(0, 0, 3000, 3000);
        this.minimap.scrollX = 1600;
        this.minimap.scrollY = 300;
        this.minimap.startFollow(this.player);
        this.minimap.ignore(UIGroup);
        UIGroup.add(this.minimap);
    }

    addJournalMenuElements() {
        // Add Background
        var JMBackgroundWidth = 200, JMBackgroundLenght = 300;
        var JMBackground = this.add.rectangle(game.config.width/2 - JMBackgroundWidth/2, game.config.height/2 - JMBackgroundLenght/2 + 25, JMBackgroundWidth, JMBackgroundLenght, 0xFF0000).setOrigin(0, 0);
        JMBackground.setScrollFactor(0);
        this.journalMenuGroup.add(JMBackground);

        // Add Menu text & button
        var menuButton = this.add.text(game.config.width/2, game.config.height/2, 'Menu').setOrigin(0.5);
        menuButton.setScrollFactor(0,0);

        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.cameras.remove(this.minimap);
            //this.scene.start('menuScene');
        });
        this.journalMenuGroup.add(menuButton);
    }

    switchActiveJournalMenu() {
        this.journalMenuShow = (this.journalMenuShow) ? false : true;
    }
}