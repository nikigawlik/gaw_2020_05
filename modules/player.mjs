import { Dot, Game } from "./gamelogic.mjs";
import { assignPoints, createDots } from "./generator.mjs";
import { subtract, x, y, vec2 } from "./geometry.mjs";
import { clearAnimateAttr, createElmt, setMultipleAttr, viewHeight, viewWidth } from "./svg.mjs";

export class DotVis extends Dot{
    constructor(pos, hits, game) {
        super(pos, hits, game);
        this.svgElmt = null;
        this.textElmt = null;
        this.textElmtBG = null;
        this.render();
    }

    render() {
        this.svgElmt = this.svgElmt || createElmt("circle", {
            cx: x(this.pos),
            cy: y(this.pos),
            "stroke-width": 7,
        });
        setMultipleAttr(this.svgElmt, this.game.dot1 == this? {
            fill: "#a22",
            stroke: this.type? "#11a" : "#111",
            r: 8,
        } : {
            fill: "#aaa",
            stroke: this.type? "#11a" : "#111",
            r: 10,
        });
        if(this.hits >= 0) {
            this.textElmtBG = this.textElmtBG || createElmt("text", { class: "dotTextBG" });
            this.textElmt = this.textElmt || createElmt("text", { class: "dotText" });
            setMultipleAttr(this.textElmt, {
                x: x(this.pos) + 4,
                y: y(this.pos) + 18,
            });
            setMultipleAttr(this.textElmtBG, {
                x: x(this.pos) + 4,
                y: y(this.pos) + 18,
            });
            this.textElmt.innerHTML = `${this.hits}`;
            this.textElmtBG.innerHTML = `${this.hits}`;
        }
    }

    remove() {
        super.remove();
        this.svgElmt.remove();
        if(this.textElmt) this.textElmt.remove();
        if(this.textElmtBG) this.textElmtBG.remove();
        if(scoreText) {
            let score = this.game.dots.filter(d => !!d.type).length;
            scoreText.innerHTML = `${score} points`;
            
            let dotsLeft = this.game.dots.filter(d => !d.type).length;
            if(dotsLeft == 0) {
                endGame();
            }
        }
    }
}

function endGame() {
    
    // let pointsDot = new DotVis(vec2(28, 28), -1, game);
    // pointsDot.type = "whatwhatwhatitypedoesntmatter";
    // pointsDot.render();
    // let gameEndText = createElmt("text", { class: "bigText", x: 46, y: 34});
    // scoreText.innerHTML = "5 points";
}

let game;
let playerSvg = null;
let scoreText = null;

export async function initPlayer() {
    game = new Game();
    createDots(game, DotVis);

    for(let d of game.dots) {
        d.render();
    }
    renderPlayer();

    assignPoints(game);
    renderDots();

    let pointsDot = new DotVis(vec2(28, 28), -1, game);
    pointsDot.type = "whatwhatwhatitypedoesntmatter";
    pointsDot.render();
    scoreText = createElmt("text", { class: "dotText", x: 46, y: 34});
    scoreText.innerHTML = "5 points";

    let fakeDot2 = new DotVis(vec2(28, 28 + 35), -1, game);
    // fakeDot.type = "whatwhatwhatitypedoesntmatter";
    pointsDot.render();
    let scoreText2 = createElmt("text", { class: "dotText", x: 46, y: 34 + 35});
    scoreText2.innerHTML = "destroy these";
}

let playerLineAngle = NaN;
let playerMoveDir = 1;

function renderPlayer() {
    // console.log("RENDER PLAYER");
    playerSvg = playerSvg || (() => {
        let g = createElmt("g");
        const l = Math.max(viewWidth, viewHeight)*4;
        const h = 4;
        let rect = createElmt("rect", {
            x: -l/2,
            y: -h/2,
            width: l,
            height: h,
            fill: "#aaa",
            "stroke-width": 0 ,
        }, false);
        g.append(rect);
        return g;
    })();
    let centerPos = game.dot1.pos;
    let angle = calcPlayerLineAngle();
    setMultipleAttr(playerSvg, {
        transform: `translate(${x(centerPos)}, ${y(centerPos)})`,
    });
    let rectElmt = playerSvg.querySelector("rect");
    setMultipleAttr(rectElmt, {
        transform: `rotate(${angle} 0 0)`,
    });
}

function playerRenderAnimation(prevAngle, prevDot, angle, dot) {
    
    let rectElmt = playerSvg.querySelector("rect");
    if(!isNaN(prevAngle) && prevAngle != angle){
        // console.log(`${prevAngle} -> ${angle}`);
        let deltaAngle = angle - prevAngle;
        deltaAngle = ((deltaAngle%180)+180)%180;
        deltaAngle = playerMoveDir < 0? deltaAngle : -180 + deltaAngle;
        let duration = Math.abs(deltaAngle) / 360 * 2;

        clearAnimateAttr(rectElmt);
        if(deltaAngle != 0) {

            let anim = createElmt("animateTransform", {
                // additive: "sum",
                attributeName: "transform",
                attributeType: "XML",
                type: "rotate",
                from: `${prevAngle} 0 0`,
                to: `${prevAngle + deltaAngle} 0 0`,
                // values: (new Array(5)).fill(0).map(a => `${Math.random() * 360}`).join(";"),
                // to: "90 0 0",
                dur: duration,
                repeatCount: "1",
            }, false);
            rectElmt.append(anim);
            anim.beginElement();
        }

        // setMultipleAttr(playerSvg, {
        //     transform: `translate(${x(gameState.dot1.pos)}, ${y(gameState.dot1.pos)})`,
        // });
        setMultipleAttr(rectElmt, {
            transform: `rotate(${angle} 0 0)`,
        });
        setTimeout(() => {
            renderPlayer(); 
            renderDots();
        }, duration * 1000 + 10);
    } else {
        renderPlayer();
    }
    // playerLineAngle = calcPlayerLineAngle(true);
}


function renderDots() {
    for(let d of game.dots) {
        d.render();
    }
}

export function playerJump(clockwise) {
    let prevAngle = calcPlayerLineAngle();
    let prevDot = game.dot1;

    game.playerMove(clockwise);

    let angle = calcPlayerLineAngle();
    let dot = game.dot1;

    playerMoveDir = clockwise? -1 : 1;
    
    playerRenderAnimation(prevAngle, prevDot, angle, dot);
    // setTimeout(renderPlayer, 1);
}

function calcPlayerLineAngle() {
    let delta = subtract(game.dot2.pos, game.dot1.pos);
    let angle = Math.atan2(y(delta), x(delta));
    return  angle / Math.PI * 180;
}

/* 
class EvilDot extends Dot {
    constructor(posVec) {
        super(posVec);
        this.hits = 1;
    }

    render() {
        this.svgElmt = this.svgElmt || createElmt("g", {
            transform: `translate(${x(this.pos)}, ${y(this.pos)})`,
        });
        this.rectElmt = this.rectElmt || createElmt("rect", {
            x: -7,
            y: -7,
            width: 14,
            height: 14,
            fill: "#a22",
            "stroke-width": 0,
        }, false);
        this.svgElmt.append(this.rectElmt);
        clearAnimateAttr(this.svgElmt);
        this.rectElmt.append(createElmt("animateTransform", {
            additive: "sum",
            attributeName: "transform",
            attributeType: "XML",
            type: "rotate",
            values: (new Array(5)).fill(0).map(a => `${Math.random() * 360}`).join(";"),
            // to: "90 0 0",
            dur: "1s",
            repeatCount: "indefinite",
        }, false));
        this.rectElmt.append(createElmt("animateTransform", {
            additive: "sum",
            attributeName: "transform",
            attributeType: "XML",
            type: "scale",
            values: `1 1;1.1 1.1;1 1`,
            // to: "2 2",
            dur: `${Math.random()* .1 + .2}s`,
            repeatCount: "indefinite",
        }, false));
        // let rect = 
    }
}
*/