class Preload extends Phaser.Scene
{
    constructor() {
        super("preloadScene");
    }

    preload ()
    {
        // Load char atlas
        this.load.atlas('Scout', './assets/ScoutAtlas.png', './assets/ScoutAtlas.json')
        this.load.atlas('Mix', './assets/Ingredients.png', './assets/Ingredients.json')
        // Load sfx
        //this.load.audio('sfx_', './assets/sfx/.wav');
        this.load.audio('sfx_jump', './assets/sfx/Jump.wav');
        this.load.audio('sfx_banana', './assets/sfx/Banana.wav');
        this.load.audio('sfx_nuts', './assets/sfx/Nut.wav');
        this.load.audio('sfx_raisin', './assets/sfx/Raisin.wav');
        this.load.audio('sfx_chocolate', './assets/sfx/Chocolate.wav');
        this.load.audio('sfx_cranberry', './assets/sfx/Cranberry.wav');
        this.load.audio('sfx_pretzel', './assets/sfx/Pretzel.wav');
        this.load.audio('sfx_mixing', './assets/sfx/Mixing.wav');
        this.load.image('tileset', './assets/TilesetV4.png');

        // Load font
        this.load.bitmapFont('gem', './assets/gem.png', './assets/gem.xml');

        // Load background images
        this.load.image("BackgroundBase", "./assets/BGLayers/BackgroundBase.png");
        this.load.image("Mountains", "./assets/BGLayers/Mountains.png");
        this.load.image("CloudsBack", "./assets/BGLayers/CloudsBack.png");
        this.load.image("CloudsMid", "./assets/BGLayers/CloudsMid.png");
        this.load.image("CloudsFront", "./assets/BGLayers/CloudsFront.png");
        this.load.image('spark', 'assets/SimpleParticle.png');
        this.load.image('arrow', 'assets/UpArrow.png');
        this.load.image('sign', 'assets/SignPost.png');
        this.load.image('itemBG', 'assets/ItemBG.png');

        this.load.image("TreesBack", "./assets/BGLayers/TreesBack.png");
        this.load.image("TreesMid", "./assets/BGLayers/TreesMid.png");
        this.load.image("TreesFront", "./assets/BGLayers/TreesFront.png");

        // Load menu assets
        this.load.spritesheet('TitleScout', './assets/TitleScoutAnim.png', {frameWidth: 512, frameHeight: 384, startFrame: 0, endFrame: 1});
        this.load.image('TitleBG', './assets/TitleBG.png');
        this.load.image('TitleText', './assets/TitleText.png');
        
        // This loads level map
        this.load.tilemapTiledJSON('TiledTestJSON', './assets/levels/SampleLevel.json');
        
        this.createProgressbar(game.config.width / 2, game.config.height / 2);
    }

    createProgressbar (x, y)
    {
        // size & position
        let width = 400;
        let height = 20;
        let xStart = x - width / 2;
        let yStart = y - height / 2;

        // border size
        let borderOffset = 2;

        let borderRect = new Phaser.Geom.Rectangle(
            xStart - borderOffset,
            yStart - borderOffset,
            width + borderOffset * 2,
            height + borderOffset * 2);

        let border = this.add.graphics({
            lineStyle: {
                width: 5,
                color: 0xaaaaaa
            }
        });
        border.strokeRectShape(borderRect);

        let progressbar = this.add.graphics();

        /**
         * Updates the progress bar.
         * 
         * @param {number} percentage 
         */
        let updateProgressbar = function (percentage)
        {
            progressbar.clear();
            progressbar.fillStyle(0xffffff, 1);
            progressbar.fillRect(xStart, yStart, percentage * width, height);
        };

        this.load.on('progress', updateProgressbar);

        this.load.once('complete', function ()
        {

            this.load.off('progress', updateProgressbar);
            this.scene.start('menuScene');

        }, this);
    }
}