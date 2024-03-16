class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y , texture, frame, health, mana, attack_dmg, name, power, type, index) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setImmovable(true)
        this.body.setSize(this.width /1.5, this.height)
        this.startX = x
        this.startY = y
        // setting character properties
        this.index = index
        this.health = health
        this.mana = mana
        this.name = name // for prints
        this.hurtTimer = temp_timer
        this.power = power // the abilities
        this.type = type
        this.attack_dmg = attack_dmg // for dmg
        // setting boolean values for state checking
        this.hurt = false
        this.hasAttacked = false
        this.collapsed = false
        
        // creating an array of attacks
        // this.attackList = Array(2).fill(-1) // Note: might make a dictionary
        this.attackList = {}
        this.selectedAttack = 0

        // debugging
        this.state = 'idle'

        this.projectile = new Projectile(scene, this.x + this.width/2, this.y - this.height/2, `${this.name}_projectile`, this)

        scene.FSM_holder[index] = new StateMachine('idle', {
            idle: new IdleState(),
            attack: new AttackState(),
            hurt: new HurtState(),
            collapse: new CollapseState(),
        },[scene, this])
    }

    addAttack(name, power, mana_cost, type = 0) {
        // this.attackList[Object.keys(this.attackList).length] = [name, power, mana_cost]

        // type 0 = physical, type 1 = mana
        this.attackList[name] = [power, mana_cost, type]
    }

}


class IdleState extends State {
    // in this state the character may only enter the attack and hurt state
    enter (scene, character) {
        character.state = 'idle'
        // console.log(character.attackList)
        // console.log(character.name  + 'has entered the IDLE state')
        // player is not attacking in idle state
        character.clearTint()
        // player is not hurt
        character.hurt = false
        console.log(character.name + ' is hurt?: ' + character.hurt)

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
            // turning on and off collision
            // see: https://phaser.discourse.group/t/toggle-on-off-collisions-based-on-setcollisionbyproperty/2735
            character.body.enable = true
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
        // character.state = 'attack'
        console.log("current attack: " + character.selectedAttack)
        // if (scene.selectionMenu.current_attack == 1){
        //     // if you have selected a magic attack then play the magic attack
        //     character.mana -= 10
        //     scene.characters_mp[character.index].match(character.mana)

        // } 

        // console.log("MANA COST: " + Object.entries(character.attackList)[scene.selectionMenu.current_attack][1][1])
        // character.mana -= Object.entries(character.attackList)[scene.selectionMenu.current_attack][1][1]
        console.log("MANA COST: " + Object.entries(character.attackList)[character.selectedAttack][1][1])
        character.mana -= Object.entries(character.attackList)[character.selectedAttack][1][1]
        scene.characters_mp[character.index].match(character.mana)

        
        // scene.dmgToEnemy = character.attack_dmg
        // console.log("DAMAGE: " + Object.entries(character.attackList)[scene.selectionMenu.current_attack][1][0])
        // scene.dmgToEnemy = Object.entries(character.attackList)[scene.selectionMenu.current_attack][1][0]
        console.log("DAMAGE: " + Object.entries(character.attackList)[character.selectedAttack][1][0])
        scene.dmgToEnemy = Object.entries(character.attackList)[character.selectedAttack][1][0]

        scene.selectionMenu.allowSelect = false
        // console.log("selection allow is "+ scene.selectionMenu.allowSelect)
        character.setTint(0xDB91EF)

        
        console.log(Object.entries(character.attackList)[character.selectedAttack][1][2] == 0)
        if (Object.entries(character.attackList)[character.selectedAttack][1][2] == 0) {
            character.body.setVelocityX(scene.enemy.x - character.x)
            this.collision = false;
        }
        else {
            character.projectile.move(scene.enemy)            
        }

        // scene.time.delayedCall(character.hurtTimer, () => {
        //     character.willAttack = false
        //     character.hasAttacked = true
        // })
        
    }
    execute(scene, character) {
        // reset to idle
        if (character.hasAttacked == true && character.x >= character.startX){
            character.body.setVelocityX(0)
            scene.selectionMenu.charChange(0)
            // character.projectile.reset(character.x)
            this.stateMachine.transition('idle')
        }

        scene.physics.add.collider(character, scene.enemy, () => {
            // let collision = scene.enemy.projectile.handleCollision(character, scene.dmgToEnemy)
            // if ( collision == true){
            //     // reset that projectile once the collision is true
            //     console.log('collision was true')
            //     scene.enemy.projectile.resetProj(scene.enemy.projectile.startX, scene.enemy.projectile.startY)
            //     this.stateMachine.transition('hurt')
            //     // is entered
            // }
            if (this.collision == false) {
                character.body.setVelocityX(0)
                this.collision = true;                
            }
            character.anims.play(`${character.name}_melee`, true)
            character.once('animationcomplete', () => {
                character.willAttack = false
                character.hasAttacked = true
                character.setVelocityX(-1 * (scene.enemy.x - character.x))
            })      
        }, null, scene)
    }
}

class HurtState extends State {
    enter (scene, character) {
        // scene.enemy.hasAttacked = false
        character.state = 'hurt'
        character.hurt = true
        // character.anims.play(`${character.name}_hurt`, true)
        character.setTint(0xFF0000)
        // decrease health and update bar
        character.health -= scene.enemy.dmgToPlayer
        console.log(scene.enemy.selectedChar + "selected CHARACTER")
        scene.characters_hp[scene.enemy.selectedChar].match(character.health)
        let damage_txt = scene.add.bitmapText(character.x, character.y - tileSize*1.5, 'font',  -scene.enemy.dmgToPlayer, 8).setOrigin(0, 0).setTint(0xFF0000)
        this.attackText_below = scene.add.bitmapText(centerX, centerY+1, 'font',  `${character.name} takes ${-scene.enemy.dmgToPlayer} damage`, 12).setOrigin(0.5).setTint(0x1a1200)
        this.attackText = scene.add.bitmapText(centerX, centerY, 'font',  `${character.name} takes ${-scene.enemy.dmgToPlayer} damage`, 12).setOrigin(0.5)
        
        this.ready = false
        if (character.health > 0){
            scene.time.delayedCall(character.hurtTimer, () => {
                character.clearTint()
                scene.enemy.attacking = false
                damage_txt.setVisible(false)
                this.attackText_below.setVisible(false)
                this.attackText.setVisible(false)
                console.log("\n\n enemy attacked= " + scene.enemy.hasAttacked + '\n\n')
                if (character.health > 0 && scene.enemy.hasAttacked == false){
                    console.log(`${character.name} has reached idle`)
                    this.stateMachine.transition('idle')
                }
                this.ready = true
                // character.checkCollision.none = true
                character.body.enable = false
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
        if(this.ready == true){
            this.stateMachine.transition('idle')
        }
        
    }
}

class CollapseState extends State {
    // the character will be knocked out in this state
    enter (scene, character) {
        character.state = 'collapse'
        scene.selectionMenu.updateAvailable()
        character.anims.play(`${character.name}_collapse`, true)
        character.collapsed = true
        character.setTint(0xA020F0)
        scene.active_players -= 1
    }
    execute(scene, character) {
        
    }
}