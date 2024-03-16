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
        this.load.image('title_image', 'Title.png')
        this.load.image('container', 'container_1.png')
        this.load.image('cursor', 'cursor.png')
        this.load.image('char_cursor', 'char_cursor.png')
        this.load.image('health_bar', 'health_bar.png')
        this.load.image('mana_bar', 'mana_bar.png')

        // loading fonts
        this.load.bitmapFont('font', 'font/atari-classic.png', 'font/atari-classic.xml')
        // this.load.bitmapFont('font', 'font/gumball_font.png', 'font/gumball_font.xml')
        this.load.bitmapFont('skinnyfont', 'font/SkinnyFont.png', 'font/SkinnyFont.xml')

        // setting up audio
        this.load.audio('music', 'sound/8BitArcade.mp3')
        this.load.audio('fight_music', 'sound/80s_Fight_Music_1.mp3')


        // load JSON (ie dialog text)
        this.load.json('dialog', 'json/dialog.json')
        // loading dialog box
        this.load.image('dialogbox', 'text_box.png')

        //setting up character sprite sheet
        this.load.spritesheet('gumball', 'gumball_spritesheet.png', {
            frameWidth: 38,
            frameHeight: 42
        })

        this.load.image('gumball_talk', 'gumball_talking.png')

        this.load.spritesheet('anais', 'anais_spritesheet.png', {
            frameWidth: 33,
            frameHeight: 34
        })
        this.load.spritesheet('darwin', 'darwin_spritesheet.png', {
            frameWidth: 46,
            frameHeight: 35
        })
        this.load.image('darwin_talk', 'darwin_talking.png')

        this.load.spritesheet('penny', 'penny_spritesheet.png', {
            frameWidth: 43,
            frameHeight: 60
        })
        this.load.spritesheet('nicole', 'nicole_spritesheet.png', {
            frameWidth: 40,
            frameHeight: 72
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

        
    }

    create() {
        // adding title background
        this.add.image(centerX, centerY - tileSize / 2, 'title_image').setScale(2).setOrigin(0.5)

        // add title text
        this.add.bitmapText(centerX, centerY + tileSize * 2.5, 'font', 'The Amazing World of Gumball', 12).setOrigin(0.5)
        // this.add.bitmapText(centerX, centerY , 'font', 'up and down to change choice', 8).setOrigin(0.5)
        // this.add.bitmapText(centerX, centerY  + tileSize*3, 'font', 'change characters <- ->', 8).setOrigin(0.5)
        // this.add.bitmapText(centerX, centerY  + 12, 'font', 'SPACE to select choice', 8).setOrigin(0.5)
        this.add.bitmapText(centerX, centerY + tileSize * 3, 'font', 'arrow keys to START', 8).setOrigin(0.5)

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
            key: 'GUMBALL_melee',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('gumball', { start: 8, end: 15}),
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
            key: 'PENNY_singleAttack',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('penny', { start: 8, end:15}),
        })
        this.anims.create({
            key: 'PENNY_damaged',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('penny', { start: 16, end:23}),
        })
        this.anims.create({
            key: 'PENNY_defeat',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('penny', { start: 24, end: 24}),
        })

    }

    update() {
        const { left, right, up, down, space, shift } = this.keys   

        if (right.isDown || up.isDown ){
            this.scene.start('fightingScene')
        }
        if (left.isDown){
            this.scene.start('creditsScene')  
        }

        if (down.isDown){
            this.scene.start('tutorialScene')
        }
    }
}

