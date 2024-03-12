class SelectionMenu{
    constructor(scene, x, y, characters){
        this.menu = new Phaser.GameObjects.Graphics(scene)

        this.x = x
        this.y = y

        this.characters = characters
        // set the current player at the first one
        this.current_player = 0
        this.current_selection = 2
        this.cursor_pos = -20


        // initializing temporary selection button
        //see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/text/simple%20text%20button.js
        const container_bg = scene.add.image(x,y, 'container')
        this.cursorImage = scene.add.image(x + -32, y + this.cursor_pos, 'cursor').setOrigin(0.5, 0)
        this.charDisplay = scene.add.bitmapText(x + -24, y + -20, 'font', this.characters[this.current_player].name, 8)
        const item = scene.add.bitmapText(x + -24, y + -8, 'font', "PHONE", 8)
        this.powerDisplay = scene.add.bitmapText( x + -24, y + 4, 'font', this.characters[this.current_player].power, 8)
    }
    select() {
        
        if (this.current_selection == 0 ){
            // if cursor on the power selection
            console.log('select')
            // Attack choice
            if (this.characters[this.current_player].collapsed == false && !this.characters[this.current_player].hasAttacked){
                // NOTE: check if character has died
                console.log(this.characters[this.current_player])
                this.characters[this.current_player].willAttack = true
            }
        }

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
        this.cursorImage.y = this.y + this.cursor_pos

        console.log(this.current_selection)
        // console.log("current selection: " + this.current_selection + " y position: " + this.cursor_pos)

        // if left and right button were clicked scroll through the characters
    }
    
    charChange(input){
        console.log("REACHED")
        // temporarily removing
        // let availableChar = Array(0);
        // for (let i = 0; i < this.characters.length; i++) {
        //     if (!this.characters[i].hasAttacked){
        //         // if character not collapsed nor attacked put into array 
        //         console.log(`${this.characters[i].name}: ${this.characters[i].hasAttacked}`)
        //         availableChar.push(this.characters[i].index) 
        //     }
        // }
        
        // allow the character to move through the character options
        
        // probably make an active characters array to ensure that only those who have a turn can go
        this.current_player += input

        if (this.current_player >= this.characters.length){
                this.current_player = 0
                console.log(`current player changed to: ${this.current_player}`)
            }
        else if (this.current_player < 0){
            this.current_player = this.characters.length - 1
        }
        
        // console.log(availableChar)
        // console.log(`current player: ${this.current_player}`)
        // console.log(`av[]: ${availableChar[this.current_player]}`)
        // console.log(this.current_player)
        this.charDisplay.text = this.characters[this.current_player].name
        this.powerDisplay.text = this.characters[this.current_player].power
    
        // return availableChar
            // if (this.current_player >= this.characters.length){
        //     this.current_player = 0
        // }
        // else if (this.current_player < 0){
        //     this.current_player = this.characters.length - 1
        // }
        
        
        
        // this.charDisplay.text = this.characters[this.current_player].name
        // this.powerDisplay.text = this.characters[this.current_player].power
    }

}