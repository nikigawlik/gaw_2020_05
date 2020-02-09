import { dot, normalize, perp, scale, subtract } from "./geometry.mjs";

export class Dot {
    constructor(pos, hits, game) {
        this.pos = pos;
        this.hits = hits;
        this.game = game;

        this.onhit = null;
        this.onremove = null;

        this.type = 0;
        this.original = null;
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

    clone() {
        let dupl = new Dot(this.pos, this.hits, this.game);
        dupl.original = this;
        return dupl;
    }
}

export class Game {
    constructor() {
        this.dots = [];
        this.dot1 = null;
        this.dot2 = null;

        this.score = 0;
        this.dotsLeft = 0;
        this.gameEnded = false;
        this.maxScore = 0;
        this.hasMoved = false;
    }

    addDot(dot) {
        this.dots.push(dot);
    }

    setPivots(dot1, dot2) {
        this.dot1 = dot1;
        this.dot2 = dot2;
    }

    playerMove(clockwise, ignoreGameEnd=false) {
        if(this.gameEnded && !ignoreGameEnd) return;
        if(!this.hasMoved) {
            this.hasMoved = true;
            this.maxScore = this.dots.filter(d => !!d.type).length;
        }

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

        // --- check win --- 
        this.score = this.dots.filter(d => !!d.type).length;
        this.dotsLeft = this.dots.filter(d => !d.type).length;
        if(this.dotsLeft == 0) {
            this.gameEnded = true;
        }
    }

    clone() {
        let newGame = new Game();
        let newDots = this.dots.map(dot => {
            let newDot = dot.clone();
            if(dot == this.dot1) newGame.dot1 = dot;
            if(dot == this.dot2) newGame.dot2 = dot;
            newDot.game = newGame;
            return newDot;
        });

        newGame.dots = newDots;
        return newGame;
    }
}