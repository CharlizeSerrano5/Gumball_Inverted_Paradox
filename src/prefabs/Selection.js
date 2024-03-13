class SelectionMenu extends Phaser.GameObjects.Graphics{
    constructor(scene, x, y, characters){
        super(scene, x, y)
        this.menu = new Phaser.GameObjects.Graphics(scene)

        this.x = x
        this.y = y
        this.scene = scene

        this.characters = characters
        
        // set the current player at the first one
        this.current_player = 0 // which character player is on
        this.current_selection = 2 // what the cursor is pointing at
        this.cursor_pos = -20

        // initializing temporary selection button
        //see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/text/simple%20text%20button.js
        const container_bg = scene.add.image(x,y, 'container')
        this.cursorImage = scene.add.image(x + -32, y + this.cursor_pos, 'cursor').setOrigin(0.5, 0)
        this.charDisplay = scene.add.bitmapText(x + -24, y + -20, 'font', this.characters[this.current_player].name, 8)
        this.item = scene.add.bitmapText(x + -24, y + -8, 'font', "PHONE", 8)
        this.powerDisplay = scene.add.bitmapText( x + -24, y + 4, 'font', this.characters[this.current_player].power, 8)
        this.selections = [ this.powerDisplay, this.item, this.charDisplay ]
        this.selections[this.current_selection].setTint(0xDFFF00);
        this.availableChar = this.scene.checkActive()

    }

    updateAvailable() {
        // just to update available Char
        this.availableChar = this.scene.checkActive()
        return this.availableChar
    }

    // CURRENT PROBLEM - if the character we are looking at dies, they do not change characters
    // possible solution have a function updates the display or use charChange()
    select() {
        this.availableChar = this.updateAvailable()
        if (this.current_selection == 0 ){
            console.log('we have selected' + this.characters[this.availableChar[this.current_player]].name )
            // if cursor on the power selection
            // Attack choice
            if ( this.characters[this.availableChar[this.current_player]].collapsed == false && !this.characters[this.availableChar[this.current_player]].hasAttacked){
                // NOTE: check if character has died
                this.characters[this.availableChar[this.current_player]].willAttack = true
                
                this.charChange(1);
            }
        }
        if (this.current_selection == 1){
            console.log("SUMMON")
        }
    }

    setInvisble(input) {
        // function to hide selection Menu after every attack
        // input is used for a boolean value
    }

    lookChoice(input) {
        
        // selection menu options
        // if up and down selected then scroll through options
        this.selections[this.current_selection].clearTint()
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
        this.selections[this.current_selection].setTint(0xDFFF00)
    }

    charChange(input){
        this.availableChar = this.updateAvailable()
        this.current_player += input
        
        if (this.current_player >= this.availableChar.length){
                this.current_player = 0
        }
        else if (this.current_player < 0){
            this.current_player = this.availableChar.length - 1
        }
        
        // PROBLEM MIGHT BE THE WHILE LOOP
        // while(this.characters[this.availableChar[this.current_player]].hasAttacked){
        //     this.current_player += input
        //     if (this.current_player >= this.availableChar.length){
        //         this.current_player = 0
        //     }
        //     else if (this.current_player < 0){
        //         this.current_player = this.availableChar.length - 1
        //     }
        // }
        if( this.characters[this.availableChar[this.current_player]].hasAttacked){
            this.charChange(1)
        }

        this.charDisplay.text = this.characters[this.availableChar[this.current_player]].name
        this.powerDisplay.text = this.characters[this.availableChar[this.current_player]].power

        console.log("CURRENT CHARACTERS" + this.availableChar)
    }

}