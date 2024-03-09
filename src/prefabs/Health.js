class HealthBar{
    // see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/graphics/health%20bars%20demo.js
    constructor(scene, x, y, hp){
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x - tileSize * 2;
        this.y = y;
        this.value = hp;
        // this.p = /100;
        this.padding = 4
        this.width = 118
        this.height = 12
        this.draw();
        
        // adding the bar to the scene
        scene.add.existing(this.bar)
    }

    match (amount) {
            // whatever changes were made to the characters health
            this.value = amount
            // ensure no negative values
            if (this.value < 0){
                this.value = 0
            }
            
            this.draw()
    
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