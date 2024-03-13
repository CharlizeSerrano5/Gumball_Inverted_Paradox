class HealthBar extends Phaser.GameObjects.Graphics{
    // see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/graphics/health%20bars%20demo.js
    constructor(scene, x, y, character){
        super(scene, x, y)
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x - tileSize * 2;
        this.y = y;
        this.value = character.health;
        // this.p = /100;
        this.padding = 4
        this.width = 118
        this.height = 10
        this.draw();
        
        // Note: should set up a variable for the global font size
        // 12 is the font size
        this.hp_pos = this.x - 26
        this.name_pos = centerX - tileSize * 5.5
        this.health_pos = this.width + this.x -24

        // adding the bar to the scene
        scene.add.existing(this.bar)
        scene.add.image(x - 4, this.y+ 4, 'health_bar').setOrigin(0.5)

        scene.add.bitmapText(this.hp_pos, this.y + 1, 'font', 'HP', 12).setTint(0x1a1200)
        scene.add.bitmapText(this.hp_pos, this.y, 'font', 'HP', 12)

        scene.add.bitmapText(this.name_pos, this.y - 1, 'font', character.name, 12).setTint(0xf5f576)
        scene.add.bitmapText(this.name_pos, this.y + 1, 'font', character.name, 12).setTint(0x1a1200)
        scene.add.bitmapText(this.name_pos, this.y, 'font', character.name, 12).setTint(0xa8832a)

        
        this.health_txt = scene.add.bitmapText(this.health_pos, this.y - 8, 'font', character.health, 8)
    }

    match (amount) {
            // whatever changes were made to the characters health
            this.value = amount
            // ensure no negative values
            if (this.value < 0){
                this.value = 0
            }
            
            this.draw()
            this.health_txt.text = this.value
    
            return (this.value === 0)
        }

    draw() {
        // this.bar.clear()
        
        // BG of the bar - a container for the health
        // Note: should design a container for health
        // this.bar.fillStyle(0x000000)
        // this.bar.fillRect(this.x, this.y, this.width, this.height);
        // health
        // this.add.image(this.x, this.y, 'health_bar')
        
        this.bar.fillStyle(0xabaca7)
        //#cb3938
        this.bar.fillRect(this.x + 2, this.y + 2, this.width - this.padding, this.height - this.padding)

        // setting up the red value
        if (this.value < 30){
            this.bar.fillStyle(0xff0000)
        }
        else{
            this.bar.fillStyle(0xcb3938)
        }


        var health_width = Math.floor(this.value / 8.7)

        this.bar.fillRect(this.x + 2, this.y + 2, health_width, this.height - this.padding)
    }
}