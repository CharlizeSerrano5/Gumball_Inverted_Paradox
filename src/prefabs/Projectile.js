class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, character){
        super(scene, x, y, texture)
        // projectile will spawn on player
        scene.add.existing(this)
        
        scene.physics.add.existing(this)
        // initialize variables
        this.moveSpeed = 350
        this.character = character
        this.startX = this.x
        this.startY = this.y
        // console.log(this.character.name)
        // this.setVisible(false)
    }

    

    move(character) {
        // console.log('moving ' + this.character.name)
        // console.log('opposingX: ' + landX + 'thisX:' + this.x)
        // console.log('thisX: ' + this.x + 'thisY:' + this.y)
        // this.setVisible(true)
        let landX = character.x + character.width
        let landY = character.y - character.height

        // scene.enemy.x + scene.enemy.width, scene.enemyY - scene.enemy.height
        let direction
        if(this.x >= landX){
            direction = 'left'
            // this.anims.play(`${this.character.name}_projectileAttack`)
            this.body.setVelocityX(-this.moveSpeed)
        }
        else if (landX >= this.x){
            direction = 'right'
            this.body.setVelocityX(this.moveSpeed)
            // this.body.setVelocityX(this.moveSpeed)
        }

        // console.log('this height: ' + this.y + 'land destination ' +landY)
        if (this.y > landY){
            let distance = landY*landY + landX*landX    
            this.body.setVelocityY(-Math.sqrt(distance) + character.height)
        }
        else if (this.y < landY){
            // console.log('this.y = ' + this.y + 'landY = ' + landY)
            // c^2 = a^2 + b^2
            //Math.sqrt
            let distance = landX*landX - landY*landY     
            console.log('distance sqrt - ' + Math.sqrt(distance))
            this.body.setVelocityY(60)
        }


        if (this.x == landX){
            // this.setVisible(false)
        }

        // console.log(this.width)
        // console.log(landX)
        // console.log(this.scene.enemy.x)
        // console.log(this.scene.enemy.width)

        if (this.x - this.width <= landX && direction == 'left'){
            this.body.setVelocityY(0)
            this.resetProj(this.startX, this.startY)
            
        }

        else if (this.x - this.width >= landX && direction == 'right'){
            console.log("REACHED? lanDX" + landX + 'this.x: ' + this.x) 
            this.body.setVelocityY(0)
            this.resetProj(this.startX, this.startY)
            
        }

    }
    resetProj(x, y){
        // console.log('reset velocity' + this.body.velocity)
        this.body.setVelocityY(0)
        this.body.setVelocityX(0)
        this.x = x
        this.y = y
        
        // this.setVisible(false)
    }
    
    handleCollision(currently_Attacked, dmgDealt){
        this.x = this.startX
        // console.log("original x = " + this.x + "set x " + this.startX)
        currently_Attacked.health -= dmgDealt
        // this.resetProj(this.startX)
        
        // set up animations for projectile LATER
        return true
    }

}