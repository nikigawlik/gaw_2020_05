import { renderBackground } from "./background.mjs";
import { initPlayer } from "./player.mjs";
import { playerJump } from "./player.mjs";
import { init as svgInit } from "./svg.mjs";
import { KEY_CODES } from "./utils.mjs";

window.onload = () => {
    svgInit();
    renderWorld();
    init();
}

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
    // if(ev.keyCode == KEY_CODES.UP || ev.keyCode == KEY_CODES.SPACE || ev.key == "w") {
    //     playerFlip();
    // }
});

function renderWorld() {
    // background
    renderBackground();
}

function init() {
    initPlayer();
}