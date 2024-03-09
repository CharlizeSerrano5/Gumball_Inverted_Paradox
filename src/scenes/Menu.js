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
        this.load.image('cursor', 'cursor.png')

        // setting up audio
        this.load.audio('music', '8BitArcade.mp3')

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
        this.load.spritesheet('penny', 'penny_spritesheet.png', {
            frameWidth: 39,
            frameHeight: 59
        })
        this.load.spritesheet('ANAIS_projectile', 'sci_proj_spritesheet.png', {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet('GUMBALL_projectile', 'love_projectile.png', {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet('DARWIN_projectile', 'support_projectile.png', {
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
        this.add.bitmapText(centerX, centerY , 'font', 'up and down to change choice', 8).setOrigin(0.5)
        this.add.bitmapText(centerX, centerY  - 20, 'font', 'change characters <- ->', 8).setOrigin(0.5)
        this.add.bitmapText(centerX, centerY  + 12, 'font', 'SPACE to select choice', 8).setOrigin(0.5)
        this.add.bitmapText(centerX, floorY  + tileSize, 'font', 'arrow keys to START', 8).setOrigin(0.5)

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
            key: 'GUMBALL_projectileAttack',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('GUMBALL_projectile', { start: 0, end: 0}),
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
            repeat: 0,
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
        this.anims.create({
            key: 'DARWIN_projectileAttack',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('DARWIN_projectile', { start: 0, end: 0}),
        })

        this.anims.create({
            key: 'PENNY_attack',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('penny', { start: 1, end: 7}),
        })
        this.anims.create({
            key: 'PENNY_default',
            frameRate: 8,
            repeat: -1,
            // repurposing code bc enemy attack is weird
            frames: this.anims.generateFrameNumbers('penny', { start: 0, end:7}),
        })
        this.anims.create({
            key: 'PENNY_damaged',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('penny', { start: 8, end:15}),
        })
        this.anims.create({
            key: 'PENNY_defeat',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('penny', { start: 16, end: 16}),
        })

    }

    update() {
        const { left, right, up, down, space, shift } = this.keys   

        if (left.isDown || right.isDown || up.isDown || down.isDown){
            this.scene.start('fightingScene')
        }
    }
}

