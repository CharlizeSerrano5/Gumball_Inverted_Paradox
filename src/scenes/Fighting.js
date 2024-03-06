class Fighting extends Phaser.Scene {
    constructor(){
        super('fightingScene')
    }

    init() {
        this.hp = HP
        this.mp = MP

    }

    create() {
        // create an HP amount of 999 for each of the characters
        // ground fills up to the half point and the foreground is up to the 1/3 point
        

        // initializing a background

        // adding a character to scene
        this.gumball = new Character(this, centerX, centerY, 'gumball', 0, HP, MP);
        

        // adding enemy to scene
        // this.enemy = new this.Enemy()

        // setting up keyboard inputs
        this.keys = this.input.keyboard.createCursorKeys()

        // adding music
        // this.music = this.sound.add('music')

        // Game OVER flag
        this.gameOver = false
    }

    update() {
        if (this.gameOver){
            const { left, right, up, down, space, shift } = this.keys   

        }
    }

    // MOST IMPORTANT FINISH FIRST

}