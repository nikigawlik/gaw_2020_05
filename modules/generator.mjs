import { Dot } from "./gamelogic.mjs";
import { magnitude, subtract, vec2 } from "./geometry.mjs";
import { viewHeight, viewWidth } from "./svg.mjs";


export async function assignPoints(referenceGame) {
    // play a test game
    let history = [];
    let game = referenceGame.clone();
    for(let i = 0; i < 10; i++) {
        let cw = Math.random() < 0.5;
        history.push(cw);
        game.playerMove(cw);
    }
    console.log(history);
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
        ), Math.floor(Math.random() * 4) + 1, game); // (i > 4? Dot : Dot)
        
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