class Menu extends Phaser.Scene{
    // should have the title screen of inverted paradox start
    constructor() {
        super('menuScene')
    }

    preload() {
        // setting up path
        this.load.path = './assets/'
        // setting up backgrounds
        this.load.image('background', 'gumball_side_walk_2.png')
        this.load.image('container', 'container_1.png')

        // setting up audio
        // this.load.audio()

        //setting up character sprite sheet
        this.load.spritesheet('gumball', 'gumball_test.png', {
            frameWidth: 32,
            frameHeight: 42
        })
        this.load.spritesheet('anais', 'anais_test.png', {
            frameWidth: 32,
            frameHeight: 42
        })
        this.load.spritesheet('darwin', 'darwin_test.png', {
            frameWidth: 32,
            frameHeight: 42
        })
        this.load.spritesheet('boss_temp', 'penguin_spritesheet_1.png', {
            frameWidth: 32,
            frameHeight: 32
        })

        // loading fonts
        this.load.bitmapFont('font', 'atari-classic.png', 'atari-classic.xml')
        // this.load.bitmapFont('font', 'gumball_font.png', 'gumball_font.xml')
    }

    create() {
        // add title text
        this.add.bitmapText(centerX, centerY - 32, 'font', 'Gumball Inverted Paradox', 12).setOrigin(0.5)
    
        // setting up inputs
        this.keys = this.input.keyboard.createCursorKeys()

        // setting up animations

        this.anims.create({
            key: 'boss_temp_idle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('boss_temp', { start: 0, end: 3}),
        })
    }

    update() {
        const { left, right, up, down, space, shift } = this.keys   

        if (left.isDown || right.isDown || up.isDown || down.isDown){
            this.scene.start('fightingScene')
        }
    }
}

