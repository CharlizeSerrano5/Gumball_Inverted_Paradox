class Credits extends Phaser.Scene {
    constructor(){
        super('creditsScene')
    }

    create() {
        this.logo = this.add.image(centerX, centerY - tileSize / 2, 'title_image').setScale(2).setOrigin(0.5)
        // setting up inputs
        this.keys = this.input.keyboard.createCursorKeys()
        this.direction = 'up'
        this.add.bitmapText(this.width, game.config.height - 8, 'font', '[Space] to Pause   [Up] or [Down] to Scroll', 8).setOrigin(0, 0.5)
        this.add.bitmapText(this.width, game.config.height - 16, 'font', '[Left] or [Right] for Menu', 8, 1).setOrigin(0, 0.5)

        this.paused = false // value to check if paused
        const content = ['\nCode: by Charlize Serrano\n',
                         'Assets: by Charlize Serrano\n\n\n',
                         '- Music from Pixabay - \n',
                         'Musician: Grand_Project \n',
                         'Song: On The Road To The Eighties_Loop2\n\n\n',
                         '- Fonts from DaFont - \n\n\n\n\n\n',
                         'Game Influenced by:\n',
                         'The Amazing World of Gumball\n',
                         'Season 5 Episode 18: The Console'
        ]
        
        this.credits = this.add.bitmapText(centerX, game.config.height + 72, 'font', content, 8, 1).setOrigin(0.5);

    }

    // allow for scrolling inside of credits
    update() {
        const { left, right, up, down, space, shift } = this.keys   
        if (!this.paused){
            this.move(this.logo, -1)
            this.move(this.credits, -1)
        }
        if (Phaser.Input.Keyboard.JustDown(space)){
            this.pause()
        }
        if (down.isDown) {
            this.direction = 'down'
            this.move(this.logo, 10)
            this.move(this.credits, 10)

        }
        if (up.isDown){
            this.direction = 'up'
            this.move(this.logo, -10)
            this.move(this.credits, -10)

        }

        if (left.isDown || right.isDown ){
            this.scene.start('menuScene')
        }

    }
    move(item, input) {
        item.y += input
        
        // resetting position
        if (item.y >= 500 && this.direction == 'down'){
            item.y = -50
        }
        if (item.y <= -200 && this.direction == 'up'){
            item.y = game.config.height + 60
        }
    }
    pause() {
        console.log("REACHED????")
        // allow to pause and unpause
        if (!this.paused){
            this.paused = true
            console.log('paused is ' + this.paused)
            this.move(this.logo, 0)
            this.move(this.credits, 0)
            return
        }
        else if (this.paused){
            this.paused = false
            return
            // this.move(this.logo, -1)
        }
    }
}