class Fighting extends Phaser.Scene {
    constructor(){
        super('fightingScene')
    }

    init() {
        this.hp = HP
        this.mp = MP
        // initialize a boolean value to check if player has attacked 
        // Note: might make a global variable
        this.player_attacking = false
        this.enemy_attacking = false
        // check if it is the player's turn (start off with the player going first)
        this.player_turn = true
        // set the current player at the first one
        this.current_player = 0
        this.current_selection = 2
        this.cursor_pos = -20
        this.active_players = 3 // Note: with more scenes turn this into a global variable
        this.active_enemies = 1 // Note: in future scenes it may change the amount
        this.FSM_holder = Array(3).fill(0)
        this.textAdded = false
        this.temp_dmg = 200
        // initializing the amt the player will do to the enemy
        this.dmgToEnemy = 0
        this.enemy_dmg = 0


        this.enemyX = leftPos - tileSize
        this.enemyY = floorY + tileSize
        
        this.music_playing = false

        // setting up buttons
        // see: https://blog.ourcade.co/posts/2020/phaser-3-ui-menu-selection-cursor-selector/
        
    }

    create() {
        // initializing a background
        // see: https://www.youtube.com/watch?v=OOo69t_-uok
        this.background = this.add.image(this.scale.width / 2,this.scale.height / 2, 'background')
        // adding music
        this.music = this.sound.add('music').setLoop(true).setVolume(0.4)
        
        // adding a character to scene - each character should have their own HP
        this.gumball = new Character(this, rightPos-tileSize, floorY + tileSize, 'gumball', 0, this.hp, MP, 100, 'GUMBALL', 'MAGIC', 0).setOrigin(0,1)
        this.anais = new Character(this, rightPos, floorY +tileSize, 'anais', 0, this.hp, MP, 400, 'ANAIS', 'SCIENCE', 1).setOrigin(0,1)
        this.darwin = new Character(this, rightPos + tileSize, floorY + tileSize, 'darwin', 0, this.hp, MP, 10, 'DARWIN', 'SUPPORT', 2).setOrigin(0,1)
        // adding each character health
        this.gumball_hp = new HealthBar(this, centerX, floorY + tileSize, this.gumball, 0)
        this.anais_hp = new HealthBar(this, centerX,floorY+ tileSize *1.5, this.anais, 0)
        this.darwin_hp = new HealthBar(this, centerX, floorY + tileSize * 2, this.darwin, 2)
        // adding all characters into an array to loop all the characters
        this.characters = [ this.gumball, this.anais, this.darwin ]
        this.characters_hp = [ this.gumball_hp, this.anais_hp, this.darwin_hp ]
        // adding enemy to scene - enemy has their own prefab
        this.enemy = new Enemy(this, leftPos - tileSize, floorY + tileSize, 'penny', 0, HP, MP, 152, 'PENNY').setOrigin(0,1).setFlipX(true)
        this.enemy_hp = new HealthBar(this, centerX, tileSize / 4, this.enemy)


        // setting up keyboard inputs
        this.keys = this.input.keyboard.createCursorKeys()

        // initializing temporary selection button
        //see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/text/simple%20text%20button.js
        const container_bg = this.add.image(0,0, 'container')
        this.cursorImage = this.add.image(-32,-20, 'cursor').setOrigin(0.5, 0)
        this.charDisplay = this.add.bitmapText(-24, -20, 'font', this.characters[this.current_player].name, 8)
        const item = this.add.bitmapText(-24, -8, 'font', "PHONE", 8)
        this.powerDisplay = this.add.bitmapText(-24, 4, 'font', this.characters[this.current_player].power, 8)
        this.choiceMenu = this.add.container(rightPos + tileSize / 2, floorY + tileSize + 25 , [ container_bg , item, this.charDisplay, this.powerDisplay, this.cursorImage]) // .setVisible(false)


        // Game OVER flag
        this.gameOver = false
        
    }

    update() {
        const { left, right, up, down, space, shift } = this.keys
        // check for game over
        if (this.active_players == 0 || this.active_enemies == 0){
            this.gameOver = true
        }
        // restart game if game over
        if (this.gameOver){
            if (this.active_enemies == 0){
                if (!this.textAdded){
                    this.add.bitmapText(centerX, centerY, 'font', 'YOU WIN', 20).setOrigin(0.5)
                    this.add.bitmapText(centerX, centerY - tileSize, 'font', 'up for menu right to restart', 8).setOrigin(0.5)
                    this.textAdded = true
                    
                }
            }
            // use boolean value to ensure that browser does not lag
            if (this.active_players == 0){
                if (!this.textAdded){
                    this.add.bitmapText(centerX, centerY, 'font', 'GAME OVER', 20).setOrigin(0.5)
                    this.add.bitmapText(centerX, centerY - tileSize, 'font', 'up for menu right to restart', 8).setOrigin(0.5)

                    this.textAdded = true

                }
            }


            if (up.isDown){
                this.music.stop()
                this.scene.start('menuScene')
            }
            if (right.isDown){
                this.music.stop()
                this.scene.restart()
            }
        }
        if (!this.gameOver){
            if (!this.music_playing){
                this.music.play()
                this.music_playing = true
            }
            this.FSM_holder[0].step()
            this.FSM_holder[1].step()
            this.FSM_holder[2].step()
            this.enemyFSM.step()
            // CURRENT PROBLEM - attacks are checked inside of the scene
            // if the enemy is attacking

            // probably put inside of the character
            if (this.enemy.attacking == false) {
                this.anais.hurt = false
                this.darwin.hurt = false
                this.gumball.hurt = false
            }
            
            // FIXXXX PLAYER TURNS ARE BROKEN
            if (this.current_selection == 0){
                // if cursor on the power selection

                // select choice
                if (Phaser.Input.Keyboard.JustDown(space)){
                    // BROKEN
                    // the enemy gets attacked at different timings 
                    
                    // if the current character has not collapsed
                    if (this.characters[this.current_player].collapsed == false){
                        // NOTE: check if character has died
                        console.log('character is not dead - checking if player turn activated')
                        this.player_attacking = true
                        this.player_turn = false
                        this.characters[this.current_player].willAttack = true
                    }
                }
            }

            if (this.current_selection == 2){
                if (Phaser.Input.Keyboard.JustDown(right)){
                    this.charChange(1)
                }
                if (Phaser.Input.Keyboard.JustDown(left)){
                    this.charChange(-1)
                }
            }
            
            if (Phaser.Input.Keyboard.JustDown(up)){
                this.lookChoice(1)
            }
            if (Phaser.Input.Keyboard.JustDown(down)){
                this.lookChoice(-1)
            }
            // if (this.player_turn == false){
            //     this.choiceMenu.setVisible(false)
            // }
            // else if (this.player_turn == true){
            //     this.choiceMenu.setVisible(true)
            // }
            
        } 
    }

    checkAttacked(){
        let attackedCharacters = Array(3).fill(-1);
        for (let i = 0; i < this.characters.length; i++) {
            if (this.characters[i].hasAttacked){
                // if character not collapsed put into array
                attackedCharacters[i] = this.characters[i].index
            }
        }
        return attackedCharacters


    }

    resetAttack(){
        
    }

    checkLiving(){
        // function to update living characters
        let livingCharacters = Array(3).fill(-1);

        for (let i = 0; i < this.characters.length; i++) {
            if (!this.characters[i].collapsed){
                // if character not collapsed put into array
                livingCharacters[i] = this.characters[i].index
            }
        }
        return livingCharacters
            
    }

    lookChoice(input) {
        // selection menu options
        // if up and down selected then scroll through options
        this.cursor_pos += -input*12
        this.current_selection += input
        if (this.current_selection > 2){
            this.current_selection = 0
            this.cursor_pos = 4
        }
        else if (this.current_selection < 0){
            this.current_selection = 3 - 1
            this.cursor_pos = -20
        }
        this.cursorImage.y = this.cursor_pos
        // console.log("current selection: " + this.current_selection + " y position: " + this.cursor_pos)

        // if left and right button were clicked scroll through the characters
    }
    
    charChange(input){
        // allow the character to move through the character options
        
        // probably make an active characters array to ensure that only those who have a turn can go
        this.current_player += input
        if (this.current_player >= this.characters.length){
            this.current_player = 0
        }
        else if (this.current_player < 0){
            this.current_player = this.characters.length - 1
        }
        this.charDisplay.text = this.characters[this.current_player].name
        this.powerDisplay.text = this.characters[this.current_player].power
    }
    charAttack(){

    }
}