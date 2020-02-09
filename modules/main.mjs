import { renderBackground } from "./background.mjs";
import { initPlayer, playerJump } from "./player.mjs";
import { init as svgInit } from "./svg.mjs";
import { KEY_CODES } from "./utils.mjs";
import { switchLevelRelative } from "./levelSelect.mjs";
import { getLevelID } from "./levelSelect.mjs";
import { getProgress } from "./levelSelect.mjs";

window.onload = () => {
    svgInit();
    renderWorld();
    init();

    window.addEventListener("resize", () => {
        renderWorld();
    });
    
    window.addEventListener("keydown", ev => {
        if(ev.keyCode == KEY_CODES.LEFT || ev.key == "a") {
            playerJump(false);
        }
        if(ev.keyCode == KEY_CODES.RIGHT || ev.key == "d") {
            playerJump(true);
        }
        // if(ev.key == "n") {
        //     initPlayer();
        // }
        // if(ev.keyCode == KEY_CODES.UP || ev.keyCode == KEY_CODES.SPACE || ev.key == "w") {
        //     playerFlip();
        // }
    });

    let updateLevel = () => {
        let progress = getProgress();
        let word = progress < 0.333? "easy" : progress < 0.666? "medium" : "hard";
        document.querySelector(".curlevel").innerHTML = `level ${getLevelID()} (${word})`;
    };
    updateLevel();

    document.querySelector("button.prev").addEventListener("click", ev => {
        if(switchLevelRelative(-1)) initPlayer();
        updateLevel();
    });
    document.querySelector("button.next").addEventListener("click", ev => {
        if(switchLevelRelative(1)) initPlayer();
        updateLevel();
    });
    document.querySelector("button.reload").addEventListener("click", ev => {
        initPlayer();
        updateLevel();
    });
    
    document.querySelector(".arrow.clockwise").addEventListener("click", ev => {
        console.log("asdfasdf");
        playerJump(true);
    })
    document.querySelector(".arrow.counterclk").addEventListener("click", ev => {
        playerJump(false);
        console.log("asdfasdf");
    
    })
    // document.querySelector(".fullscreen").addEventListener("click", ev => {

    // });

    let fullscreenButton = document.querySelector(".fullscreen");
    fullscreenButton.addEventListener('click', e => {
        if(!document.fullscreenElement) 
            document.body.requestFullscreen();
    })
    window.addEventListener('fullscreenchange', e => {
        fullscreenButton.style.display = document.fullscreenElement? "none" : "block";
    })

    // testAndVisualize();
}

function renderWorld() {
    // background
    renderBackground();
}

function init() {
    initPlayer();
}