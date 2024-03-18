class Summon extends Phaser.Physics.Arcade.Sprite {
    // upon selection the summon a summon should appear on screen and attack the enemy
    // the summon should then reset its location
    constructor(scene, x, y , texture, damage, name) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        this.projectile = new Projectile(scene, this.x + this.width/2, this.y - this.height/2, `${this.name}_projectile`, this)
        this.name = name
        this.scene = scene
        this.hasAttacked = false
        this.summonUses = 2
        this.damage = damage // damage to be added to enemy

        this.attackTimer = 200
    }

    attack(){
        // float up to a certain point and cast a projectile
        this.setVisible(true)
        this.y = centerY
        this.projectile.y = this.y - this.height/2
        this.summonUses -= 1
        console.log("attack")
        // this.hasAttacked = true // for now remove
        this.anims.play(`${this.name}_attack`)
        this.once('animationcomplete', ()=> {
            this.projectile.move(this.scene.enemy)
            this.scene.time.delayedCall(this.attackTimer, () => {
                this.setVisible(false)
            })    
        })
        
        

        // if (this.y == centerY){
        //     this.projectile.move(this.scene.enemy)
        // }
        // attacking position:  rightPos - tileSize * 3, centerY
        // move summon towards the position

    }
}