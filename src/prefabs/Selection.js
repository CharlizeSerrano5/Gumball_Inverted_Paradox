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
    }
    // checkActive(){
    //     let availableChar = Array(0);
    //     for (let i = 0; i < this.characters.length; i++) {
    //         if (!this.characters[i].hasAttacked){
    //             // if character not collapsed nor attacked put into array 
    //             // console.log(`${this.characters[i].name}: ${this.characters[i].hasAttacked}`)
    //             availableChar.push(this.characters[i].index) 
    //         }
    //     }
    //     // if availableChar's length == 0 then end turn
    //     if (availableChar.length == 0){
    //         console.log("TEST")
    //     }

    //     return availableChar
    // }

    select() {
        let availableChar = this.scene.checkActive()
        if (this.current_selection == 0 ){
            console.log(availableChar[this.current_player])
            // console.log(this.characters[availableChar[this.current_player]].name + "   iS ATTACKING")
            // if cursor on the power selection
            // console.log('select')
            // Attack choice
            if (availableChar.length != 1 && this.characters[availableChar[this.current_player]].collapsed == false && !this.characters[availableChar[this.current_player]].hasAttacked){
                // NOTE: check if character has died
                this.characters[availableChar[this.current_player]].willAttack = true
                
                this.charChange(1);
            }
            if (this.current_selection == 1){
            }
        }
        // to set invisible per attack create a function

    }

    setInvisble() {
        // function to hide selection Menu after every attack
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
        let availableChar = this.scene.checkActive()
        this.current_player += input
        if (this.current_player >= availableChar.length){
                this.current_player = 0
        }
        else if (this.current_player < 0){
            this.current_player = availableChar.length - 1
        }
        while(this.characters[availableChar[this.current_player]].hasAttacked){
            this.current_player += input
            if (this.current_player >= availableChar.length){
                this.current_player = 0
            }
            else if (this.current_player < 0){
                this.current_player = availableChar.length - 1
            }
        }

        console.log(this.characters[availableChar[this.current_player]].name + "is selected")

        this.charDisplay.text = this.characters[availableChar[this.current_player]].name
        this.powerDisplay.text = this.characters[availableChar[this.current_player]].power
    }

}