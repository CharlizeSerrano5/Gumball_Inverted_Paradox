// Charlize Serrano
// Title: Inverted Paradox
// Hours: 30+ hours 

// Notes:
    // For Friday: Submit the fighting scene
    // Each character should have a fight animation + hurt animation
    // Once a character is knocked out they should be removed from game
    // when all characters die game is over
    // enemy should be able to attack one character at a time


    // For playtest: Add one summon


'use strict'

let tileSize = 32
let config = {
    type: Phaser.AUTO,
    width: 320,
    height: 288,
    backgroundColor: '',
    pixelArt: true,
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            // gravity not needed
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Menu, Selection, Talking, Fighting]

}

// global variables

const centerX = game.config.width / 2
const centerY = game.config.height / 2
const HP = 900
const MP = 99
let cursors = null