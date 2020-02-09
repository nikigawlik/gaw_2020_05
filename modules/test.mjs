import { Game } from "./gamelogic.mjs";
import { assignPoints, createDots } from "./generator.mjs";

// is this automated game design?

export function testAndVisualize() {

    let normalizeHitsRange = [1, 5, 1];
    let numberOfDotsRange = [4, 25, 1];
    let numberOfTestGames = 100;
    
    let results = [];
    let detResults = [];
    
    for(let normalizeHits = normalizeHitsRange[0]; normalizeHits <= normalizeHitsRange[1]; normalizeHits += normalizeHitsRange[2]) {
        for(let numberOfDots = numberOfDotsRange[0]; numberOfDots <= numberOfDotsRange[1]; numberOfDots += numberOfDotsRange[2]) {
            let maxPoints = Math.floor(numberOfDots / 2);
            
            let avgScore = 0;
            for(let gameID = 0; gameID < numberOfTestGames; gameID++) {
                let game = new Game();
                createDots(game, numberOfDots);
                assignPoints(game, maxPoints, normalizeHits);
                while(!game.gameEnded) {
                    let cw = Math.random() < 0.5;
                    game.playerMove(cw);
                }
                avgScore += game.score;
            }
            avgScore /= numberOfTestGames;
            avgScore /= maxPoints;
            results.push(avgScore);
            detResults.push({
                score: avgScore,
                maxPoints: maxPoints,
                normalizeHits: normalizeHits,
                numberOfDots: numberOfDots,
            });
        }
    }
    
    let maxValue = 0; //results.reduce((a,b) => a > b? a : b);
    let minValue = 1; //results.reduce((a,b) => a < b? a : b);
    
    // visualize results
    let table = document.createElement("table");
    let normalizeHitsSize = Math.floor((normalizeHitsRange[1] - normalizeHitsRange[0] + 1) / normalizeHitsRange[2]);
    let numberOfDotsSize = Math.floor((numberOfDotsRange[1] - numberOfDotsRange[0] + 1) / numberOfDotsRange[2]);
    for(let row = 0; row < normalizeHitsSize + 1; row++) {
        let tr = document.createElement("tr");
        for(let col = 0; col < numberOfDotsSize + 1; col++) {
            let tdh; // table data or header element
            let val;
            if(row > 0 && col > 0) {
                tdh = document.createElement("td");
                val = results.shift();
                let c1 = Math.floor((val - minValue) / (maxValue - minValue) * 255);
                let c2 = (c1 + 128) % 256;
                tdh.style.backgroundColor = `rgb(${c1},${c1},${c1})`
                tdh.style.color = `rgb(${c2},${c2},${c2})`
                val = `${Math.round(val * 100)}%`;
            } else if(row == 0 && col > 0) {
                // header
                tdh = document.createElement("th");
                val = numberOfDotsRange[0] + numberOfDotsRange[2] * (col-1);
            } else if(col == 0 && row > 0) {
                // side header
                tdh = document.createElement("th");
                val = normalizeHitsRange[0] + normalizeHitsRange[2] * (row-1);
            } else {
                tdh = document.createElement("th");
                val = "a\\n";
            }
            tdh.append(val);
            tr.append(tdh);
        }
        table.append(tr);
    }
    let leg = document.createElement("p");
    leg.append("a = extra allowed hits per point (compared to expected solution)\n"
    +"n = total number of points\n"
    +"half the dots are always blue, displayed score is relative to max score");
    leg.style.whiteSpace = "pre";
    document.body.append(leg)
    document.body.append(table);

    
    // do some funny stuff with the results
    let levelProgression = detResults
        .filter(r => r.score < 0.8)
        .sort((a, b) => b.score - a.score)
        .map(r => [r.numberOfDots, r.maxPoints, r.normalizeHits, Math.round(r.score * 100)])
    ;
    console.log(JSON.stringify(levelProgression));
    console.log(`(${levelProgression.length} levels)`)
}