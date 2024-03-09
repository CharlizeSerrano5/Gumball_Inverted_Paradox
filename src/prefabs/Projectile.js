class Projectile extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, character){
        super(scene, x, y, texture)
        // Note: might add health decrease in projectile
        // projectile will spawn on player
        scene.add.existing(this)
        this.moveSpeed = 1
        this.character = character
        this.startX = this.x
        // console.log(this.character.name)
    }

    move(landX, landY) {
        console.log('enemyX: ' + landX + 'enemyY:' + landY)
        console.log('thisX: ' + this.x + 'thisY:' + this.y)
        // if (this.x != landX){
        //     // console.log('enter')
        //     this.x = landX
        //     console.log('thisX: ' + this.x + ' AFTER ENTER')
        // }
        if(this.x >= landX){
            // this.anims.play(`${this.character.name}_projectileAttack`)

            // increase if going to the right
            // decrease if going to the left
            if (landX > this.x){
                this.x += this.moveSpeed
            }
            if(landX < this.x){
                this.x -= this.moveSpeed
            }
        }
        if (this.x == landX){
            console.log('reached')
            this.setVisible(false)
        }

        if (this.x == landX){
            this.reset(this.startX)
        }
    }
    reset(x){
        this.x = x
    }

    // update() {
    //     this.move(scene.enemyX, scene.enemyY)
    // }
}