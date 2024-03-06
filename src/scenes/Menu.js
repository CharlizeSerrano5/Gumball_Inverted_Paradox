class Menu extends Phaser.Scene{
    // should have the title screen of inverted paradox start
    constructor() {
        super('menuScene')
    }

    preload() {
        // setting up path
        this.load.path = './assets/'
        // setting up backgrounds
        this.load.image()

        // setting up audio
        this.load.audio()

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

        // loading fonts
        this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml')
    }

    create() {
        // add title text
        this.add.bitmapText(centerX, centerY - 32, 'mickey_font', 'THE ODYSSEY', 72).setOrigin(0.5)
    }
}

