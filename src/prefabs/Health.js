class HealthBar{
    // see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/graphics/health%20bars%20demo.js
    constructor(scene, x, y, character){
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x - tileSize * 2;
        this.y = y;
        this.value = character.health;
        // this.p = /100;
        this.padding = 4
        this.width = 118
        this.height = 12
        this.draw();
        
        // Note: should set up a variable for the global font size
        // 12 is the font size
        this.hp_pos = this.x - 24
        this.name_pos = centerX - tileSize * 5.5
        this.health_pos = this.width + this.x

        // adding the bar to the scene
        scene.add.existing(this.bar)
        scene.add.bitmapText(this.hp_pos, this.y, 'font', 'HP', 12)
        scene.add.bitmapText(this.name_pos, this.y, 'font', character.name, 12)
        this.health_txt = scene.add.bitmapText(this.health_pos, this.y, 'font', character.health, 8)
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
        this.bar.clear()
        
        // BG of the bar - a container for the health
        // Note: should design a container for health
        this.bar.fillStyle(0x000000)
        this.bar.fillRect(this.x, this.y, this.width, this.height);

        // health
        
        this.bar.fillStyle(0xffffff)
        this.bar.fillRect(this.x + 2, this.y + 2, this.width - this.padding, this.height - this.padding)

        // setting up the red value
        if (this.value < 30){
            this.bar.fillStyle(0xff0000)
        }
        else{
            this.bar.fillStyle(0x00ff00)
        }


        var health_width = Math.floor(this.value / 8.7)

        this.bar.fillRect(this.x + 2, this.y + 2, health_width, this.height - this.padding)
    }
}