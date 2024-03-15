class ManaBar extends Phaser.GameObjects.Graphics{
    // see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/graphics/mana%20bars%20demo.js
    constructor(scene, x, y, character){
        super(scene, x, y)
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x - tileSize * 2;
        this.y = y;
        this.value = character.mana;
        // this.p = /100;
        this.padding = 4
        this.width = 45
        this.height = 10
        this.draw();
        
        // Note: should set up a variable for the global font size
        // 12 is the font size
        this.mp_pos = this.x  + 12 // the text that shows up
        this.name_pos = centerX - tileSize * 5.5
        this.mana_pos = this.width + this.x + 20 // the # amt of mana that shows

        // adding the bar to the scene
        scene.add.existing(this.bar)
        scene.add.image(x - 4, this.y+ 4, 'mana_bar').setOrigin(0.5)

        scene.add.bitmapText(this.mp_pos, this.y + 1, 'font', 'MP', 12).setTint(0x1a1200)
        scene.add.bitmapText(this.mp_pos, this.y, 'font', 'MP', 12)

        this.mana_txt = scene.add.bitmapText(this.mana_pos, this.y - 8, 'font', character.mana, 8)
    }

    match (amount) {
            // whatever changes were made to the characters mana
            this.value = amount
            // ensure no negative values
            if (this.value < 0){
                this.value = 0
            }
            
            this.draw()
            this.mana_txt.text = this.value
    
            return (this.value === 0)
        }

    draw() {
        
        this.bar.fillStyle(0xabaca7)
        //#cb3938
        this.bar.fillRect(this.x + 40, this.y + 2, this.width - this.padding, this.height - this.padding)

        // setting up the red value
        if (this.value < 30){
            this.bar.fillStyle(0xff0000)
        }
        else{
            this.bar.fillStyle(0x22b2e2)
        }

        var mana_width = Math.floor(this.value / 1.25)
        this.bar.fillRect(this.x + 40, this.y + 2, mana_width, this.height - this.padding)
    }
}