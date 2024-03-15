class Character extends Phaser.Physics.Arcade.Sprite {
    // poop
    constructor(scene, x, y , texture, frame, health, mana, attack_dmg, name, power, index) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setImmovable(true)
        this.x = x
        this.y = y
        console.log('the y value is : ' + this.y)
        // setting character properties
        this.index = index
        this.health = health
        this.mana = mana
        this.name = name // for prints
        this.hurtTimer = temp_timer
        this.power = power
        // creating a boolean value to check if the current character has attacked
        this.hurt = false
        this.hasAttacked = false
        // setting up fighting damage
        this.attack_dmg = attack_dmg
        
        this.collapsed = false
        // temporary check
        this.check = ''
        this.projectile = new Projectile(scene, this.x + this.width/2, this.y - 5, `${this.name}_projectile`, this)

        scene.FSM_holder[index] = new StateMachine('idle', {
            idle: new IdleState(),
            attack: new AttackState(),
            hurt: new HurtState(),
            collapse: new CollapseState(),
        },[scene, this])
    }

}

class IdleState extends State {
    // in this state the character may only enter the attack and hurt state
    enter (scene, character) {
        // player is not attacking in idle state
        character.clearTint()
        // player is not hurt
        character.hurt = false

    }
    execute(scene, character) {
        const { left, right, up, down, space, shift } = scene.keys
        // perform idle animation
        character.anims.play(`${character.name}_idle`, true)
        // if attack was selected enter the attack animation
        if (character.willAttack == true && !character.hasAttacked){
            this.stateMachine.transition('attack')
        }
        // if the enemy is attacking add a collider
        if(scene.enemy.hasAttacked && scene.enemy.selectedChar == character.index) { 
            scene.physics.add.collider(scene.enemy.projectile, character, () => {
                let collision = scene.enemy.projectile.handleCollision(character, scene.dmgToEnemy)
                if ( collision == true){
                    // reset that projectile once the collision is true
                    console.log('collision was true')
                    scene.enemy.projectile.resetProj(scene.enemy.projectile.startX, scene.enemy.projectile.startY)
                    this.stateMachine.transition('hurt')
                    // is entered
                }
            }, null, scene)
        }

        


        

    }
}

class AttackState extends State {
    // character will play a temporary attack animation where they throw their character specific attack
    enter (scene, character) {
        // remove the enemies health
        // scene.enemy.damaged = true
        scene.dmgToEnemy = character.attack_dmg
        scene.selectionMenu.allowSelect = false
        // console.log("selection allow is "+ scene.selectionMenu.allowSelect)
        character.setTint(0xDB91EF)
        
        character.projectile.move(scene.enemy.x + scene.enemy.width, scene.enemyY - scene.enemy.height)

        scene.time.delayedCall(character.hurtTimer, () => {
            
            character.willAttack = false
            character.hasAttacked = true
            
        })
        
    }
    execute(scene, character) {
        // reset to idle
        if (character.hasAttacked == true){
            scene.selectionMenu.charChange(-1)
            // character.projectile.reset(character.x)
            this.stateMachine.transition('idle')
        }
    }
}

class HurtState extends State {
    enter (scene, character) {
        // scene.enemy.hasAttacked = false
        character.hurt = true
        // character.anims.play(`${character.name}_hurt`, true)
        character.setTint(0xFF0000)
        // decrease health and update bar
        character.health -= scene.enemy.dmgToPlayer
        console.log(scene.enemy.selectedChar + "selected CHARACTER")
        scene.characters_hp[scene.enemy.selectedChar].match(character.health)
        let damage_txt = scene.add.bitmapText(character.x, character.y - tileSize*1.5, 'font',  -scene.enemy.dmgToPlayer, 8).setOrigin(0, 0).setTint(0xFF0000)
        scene.changeTurn()
        this.attackText_below = scene.add.bitmapText(centerX, centerY+1, 'font',  `${character.name} takes ${-scene.enemy.dmgToPlayer} damage`, 12).setOrigin(0.5).setTint(0x1a1200)
        this.attackText = scene.add.bitmapText(centerX, centerY, 'font',  `${character.name} takes ${-scene.enemy.dmgToPlayer} damage`, 12).setOrigin(0.5)
        if (character.health > 0){
            scene.time.delayedCall(character.hurtTimer, () => {
                character.clearTint()
                scene.enemy.attacking = false
                damage_txt.setVisible(false)
                this.attackText_below.setVisible(false)
                this.attackText.setVisible(false)
                scene.enemy.selectedChar = -1
                if (character.health > 0){
                    
                    this.stateMachine.transition('idle')
                }
                
            })
        }
        
        console.log('HURT')
        
    }
    execute(scene, character) {
        if (character.health <= 0){
            // if health depleted after hurt animation collapse this character
            this.stateMachine.transition('collapse')
            character.once('animationcomplete', () => {
                
                this.stateMachine.transition('collapse')
            })
        }
        
    }
}

class CollapseState extends State {
    // the character will be knocked out in this state
    enter (scene, character) {
        scene.selectionMenu.updateAvailable()
        character.anims.play(`${character.name}_collapse`, true)
        character.collapsed = true
        character.setTint(0xA020F0)
        scene.active_players -= 1
    }
    execute(scene, character) {
        
    }
}