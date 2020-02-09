import { Dot } from "./gamelogic.mjs";
import { magnitude, subtract, vec2 } from "./geometry.mjs";
import { createRandom } from "./random.mjs";
import { viewHeight, viewWidth } from "./svg.mjs";

let random = createRandom(Math.random()); // smart amirite

export function init(seed) {
    console.log(`seed: ${seed}`)
    random = createRandom(seed);
}

export async function assignPoints(referenceGame, maxPoints = 5, normalizeHits = 3) {
    // play a test game
    let history = [];
    let game = referenceGame.clone();
    // let n = game.dots.length;
    while(game.dots.length > maxPoints) {
        let cw = random() < 0.5;
        history.push(cw);
        game.playerMove(cw);
    }
    // console.log(`before: ${referenceGame.dots.length} after: ${game.dots.length}`);
    // console.log(history.map(a => a? "clockwise" : "counterclk"));
    for(let dot of game.dots) {
        dot.original.type = 1;
        if(normalizeHits) {
            dot.original.hits += normalizeHits - dot.hits;
        }
    }
}

export function createDots(game, numberOfDots, dotClass = Dot) {
    const baseR = Math.min(viewWidth, viewHeight)/2;
    let dots = [];
    let limit = numberOfDots;
    for(let i = 0; i < limit; i++) {
        let angle = random() * Math.PI * 2;
        let d = random() * baseR * 0.6 + baseR * 0.25;

        let dot = new dotClass(vec2(
            viewWidth/2 + Math.cos(angle) * d, 
            viewHeight/2 + Math.sin(angle) * d
        ), Math.floor(random() * 4) + 1, game); // (i > 4? Dot : Dot)
        
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

    
    game.dot1 = game.dots[Math.floor(random() * game.dots.length)];
    do {
        game.dot2 = game.dots[Math.floor(random() * game.dots.length)];
    } while(game.dot1 === game.dot2)
}