import { magnitude, subtract, vec2 } from "./geometry.mjs";
import { Dot } from "./gamelogic.mjs";
import { viewHeight, viewWidth } from "./svg.mjs";


export async function generate(numberOfPoints) {
    let gameState = {  // TODO  yeah this is not clean at all
        dot1: null,
        dot2: null,
        dots: createDots(),
        playerMoveDir: 0,
    };

    gameState.dot1 = gameState.dots[Math.floor(Math.random() * gameState.dots.length)];
    do {
        gameState.dot2 = gameState.dots[Math.floor(Math.random() * gameState.dots.length)];
    } while(gameState.dot1 === gameState.dot2)
    
    // let gameState = {  // TODO  yeah this is not clean at all
    //     dot1: dot1,
    //     dot2: dot2,
    //     dots: dots,
    //     playerMoveDir: playerMoveDir,
    // };

    let moves = [];

    for(let i = 0; i < 10; i++) {
        await new Promise((resolve, reject) => {
            let listener = ev => {
                resolve();
                window.removeEventListener("keydown", listener);
            };
            window.addEventListener("keydown", listener);
        });
        let clockwise = Math.random() > 0.5;
        moves.push(clockwise);
        simulatePlayerJump(clockwise, gameState);
    }

    console.log(moves.map(cw => cw? "clockwise" : "anticlockw").join(" "));

    let dot = gameState.dots[Math.round(Math.random() * gameState.dots.length)];
}

export function createDots(game, dotClass = Dot) {
    const baseR = Math.min(viewWidth, viewHeight)/2;
    let dots = [];
    let limit = 10;
    for(let i = 0; i < limit; i++) {
        let angle = Math.random() * Math.PI * 2;
        let d = Math.random() * baseR * 0.6 + baseR * 0.25;

        let dot = new dotClass(vec2(
            viewWidth/2 + Math.cos(angle) * d, 
            viewHeight/2 + Math.sin(angle) * d
        ), 1, game); // (i > 4? Dot : Dot)
        
        // check distance
        let removeMe = false;
        for(let otherDot of dots) {
            let distance = magnitude(subtract (otherDot.pos, dot.pos));
            if(distance < 80) {
                removeMe = true;
                break;
            }
        }
        if(removeMe) {
            limit = Math.min(limit+1, 1000);
            dot.remove();
        } else {
            dots.push(dot);
        }
    }

    game.dots = dots;

    
    game.dot1 = game.dots[Math.floor(Math.random() * game.dots.length)];
    do {
        game.dot2 = game.dots[Math.floor(Math.random() * game.dots.length)];
    } while(game.dot1 === game.dot2)
}