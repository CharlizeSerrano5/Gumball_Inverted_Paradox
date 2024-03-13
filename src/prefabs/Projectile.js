class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, character){
        super(scene, x, y, texture)
        // Note: might add health decrease in projectile
        // projectile will spawn on player
        scene.add.existing(this)
        
        scene.physics.add.existing(this)

        
        this.moveSpeed = 250
        this.character = character
        this.startX = this.x
        // console.log(this.character.name)
        // this.setVisible(false)
    }

    

    move(landX, landY) {
        console.log('enemyX: ' + landX + 'enemyY:' + landY)
        console.log('thisX: ' + this.x + 'thisY:' + this.y)
        // this.setVisible(true)
        if(this.x >= landX){
            this.anims.play(`${this.character.name}_projectileAttack`)

            // increase if going to the right
            // decrease if going to the left
            if (landX > this.x){
                console.log("landX > this.x")
                this.x += this.moveSpeed
                // this.body.setVelocityX(this.moveSpeed)
            }

            // for the current scene
            if(landX < this.x){
                console.log("landX < this.x")
                // this.x -= this.moveSpeed
                this.body.setVelocityX(-this.moveSpeed)
            }
        }
        if (this.x == landX){
            // this.setVisible(false)
        }

        if (this.x >= landX){
            console.log(this.x)
            this.resetProj(this.startX)
        }
    }
    resetProj(x){
        console.log("is being reached")
        this.x = x
        // this.setVisible(false)
    }
    
    handleCollision(){
        console.log("HANDLING COLLISION")
        this.x = this.startX
        // console.log("original x = " + this.x + "set x " + this.startX)

        // this.resetProj(this.startX)
        
        // set up animations for projectile LATER
        return true
    }

    // update() {
    //     this.move(scene.enemyX, scene.enemyY)
    // }
}