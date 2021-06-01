class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }
    
    create() {

    // Background
    this.add.sprite(0, 0, 'TitleBG').setOrigin(0, 0).setScale(2);

    // Clouds
    this.CloudsBack = this.add.tileSprite(0, 0, 512, 384, "CloudsBack").setOrigin(0,0).setScale(2);
    this.CloudsMid = this.add.tileSprite(0, 0, 512, 384, "CloudsMid").setOrigin(0,0).setScale(2);
    this.CloudsFront = this.add.tileSprite(0, 0, 512, 384, "CloudsFront").setOrigin(0,0).setScale(2);

    // Text
    this.add.sprite(0, 0, 'TitleText').setOrigin(0, 0).setScale(2);

    // Scout Anim
    this.anims.create({
      key: 'ScoutAnim',
      frames: this.anims.generateFrameNumbers('TitleScout', { start: 0, end: 1, first: 0}),
      frameRate: 1.0,
      repeat: -1
    });
    let titleScout = this.add.sprite(512, 384, 'TitleScout').setScale(2);
    titleScout.play('ScoutAnim');

    // Start Button
    let startButton = this.add.rectangle(750, 230, 300, 90, 0x808080).setOrigin(0, 0).setAlpha(0.0001);
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      this.scene.start('playTileScene', "TiledTestJSON");
    });

    // Credits Button
    let creditsButton = this.add.rectangle(750, 410, 300, 90, 0x808080).setOrigin(0, 0).setAlpha(0.0001);
    creditsButton.setInteractive();
    creditsButton.on('pointerdown', () => {
      this.scene.start("creditsScene");
    });

  }
  update() {
    this.CloudsBack.tilePositionX -= 0.003;
    this.CloudsMid.tilePositionX += 0.005;
    this.CloudsFront.tilePositionX -= 0.007;
  }
}