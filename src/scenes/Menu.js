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
        this.load.image('cursor', 'pixelburger2.png')

        // setting up audio
        // this.load.audio()

        //setting up character sprite sheet
        this.load.spritesheet('gumball', 'gumball_spritesheet.png', {
            frameWidth: 30,
            frameHeight: 42
        })
        this.load.spritesheet('anais', 'anais_spritesheet.png', {
            frameWidth: 33,
            frameHeight: 34
        })
        this.load.spritesheet('darwin', 'darwin_spritesheet.png', {
            frameWidth: 46,
            frameHeight: 35
        })
        this.load.spritesheet('penny', 'penny.png', {
            frameWidth: 39,
            frameHeight: 57
        })
        this.load.spritesheet('ANAIS_projectile', 'sci_proj_spritesheet.png', {
            frameWidth: 16,
            frameHeight: 16
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
            key: 'GUMBALL_idle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('gumball', { start: 0, end: 7}),
        })
        this.anims.create({
            key: 'GUMBALL_collapse',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('gumball', { start: 8, end: 8}),
        })

        this.anims.create({
            key: 'ANAIS_idle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('anais', { start: 0, end: 7}),
        })
        this.anims.create({
            key: 'ANAIS_collapse',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('anais', { start: 8, end: 8}),
        })
        this.anims.create({
            key: 'ANAIS_projectileAttack',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ANAIS_projectile', { start: 0, end: 7}),
        })

        this.anims.create({
            key: 'DARWIN_idle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('darwin', { start: 0, end: 7}),
        })
        this.anims.create({
            key: 'DARWIN_collapse',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('darwin', { start: 8, end: 8}),
        })

    }

    update() {
        const { left, right, up, down, space, shift } = this.keys   

        if (left.isDown || right.isDown || up.isDown || down.isDown){
            this.scene.start('fightingScene')
        }
    }
}

