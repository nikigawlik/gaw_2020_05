import { dot, normalize, perp, scale, subtract } from "./geometry.mjs";
import { y } from "./geometry.mjs";
import { x } from "./geometry.mjs";

export class Dot {
    constructor(pos, hits, game) {
        this.pos = pos;
        this.hits = hits;
        this.game = game;

        this.onhit = null;
        this.onremove = null;
    }

    takeHit() {
        this.hits--;

        if(this.onhit) this.onhit();
    }

    checkRemove() {
        if(this.hits <= 0) {
            this.remove();
        }
    }

    remove() {
        let dots = this.game.dots;
        const i = dots.indexOf(this);
        if(i >= 0) {
            dots.splice(dots.indexOf(this), 1);
        }

        if(this.onremove) this.onremove;
    }
}

export class Game {
    constructor() {
        this.dots = [];
        this.dot1 = null;
        this.dot2 = null;
    }

    addDot(dot) {
        this.dots.push(dot);
    }

    setPivots(dot1, dot2) {
        this.dot1 = dot1;
        this.dot2 = dot2;
    }

    playerMove(clockwise) {
        // --- player rotation --- //
        const sign = clockwise? -1 : 1;
        const dir = normalize(subtract(this.dot2.pos, this.dot1.pos));
        const normal = perp(dir);
        let calcSide = pos => dot(subtract(pos, this.dot1.pos), normal) * sign;
        let cosAngle = pos => dot(normalize(subtract(pos, this.dot1.pos)), scale(dir,Math.sign(calcSide(pos))));
        let filtered = this.dots.filter(d => Math.abs(calcSide(d.pos)) > 0.0001);
        if(filtered.length > 0) {
            this.dot2 = filtered.reduce((d1, d2) => cosAngle(d1.pos) > cosAngle(d2.pos)? d1 : d2);
        }

        // --- dot switch ---
        
        this.dot1.checkRemove();
        let buf = this.dot2;
        this.dot2 = this.dot1;
        this.dot1 = buf;
        this.dot1.takeHit();
    }
}