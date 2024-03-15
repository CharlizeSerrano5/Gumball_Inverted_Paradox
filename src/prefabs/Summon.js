class Summon extends Phaser.Physics.Arcade.Sprite {
    // upon selection the summon a summon should appear on screen and attack the enemy
    // the summon should then reset its location
    constructor(scene, x, y , texture, damage) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        this.projectile = new Projectile(scene, this.x + this.width/2, this.y - this.height/2, `${this.name}_projectile`, this)
        
        this.scene = scene
        this.hasAttacked = false
        this.summonUses = 2
        this.damage = damage // damage to be added to enemy
    }

    attack(){
        // float up to a certain point and cast a projectile
        this.summonUses -= 1
        console.log("attack")
        // this.hasAttacked = true // for now remove

        // attacking position:  rightPos - tileSize * 3, centerY
        // move summon towards the position

        this.projectile.move(this.scene.enemy)
    }
}