class HealthBar{
    // see: https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/graphics/health%20bars%20demo.js
    constructor(scene, x, y){
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x;
        this.y = y;
        this.value = HP;
        this.p = 76/100;

        this.draw();

        // adding the bar to the scene
        scene.add.existing(this.bar)
    }

    decrease (amount) {
        this.value -= amount
        // ensure no negative values
        if (this.value < 0){
            this.value = 0
        }

        this.draw()

        return (this.value === 0)
    }

    draw() {
        this.bar.clear()

        // BG of the bar
        this.bar.fillStyle(0x000000)
        this.bar.fillRect(this.x, this.y, 80, 16);

        // health

        this.bar.fillStyle(0xffffff)
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12)

        // setting up the red value
        if (this.value < 30){
            this.bar.fillStyle(0xff0000)
        }
        else{
            this.bar.fillStyle(0x00ff00)
        }

        var d = Math.floor(this.p * this.value)

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12)
    }
}