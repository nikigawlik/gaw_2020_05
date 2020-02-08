import { createElmt } from "./svg.mjs";
import { setMultipleAttr } from "./svg.mjs";
import { viewWidth } from "./svg.mjs";
import { viewHeight } from "./svg.mjs";
import { COLORS } from "./settings.mjs";
import { animateAttr } from "./svg.mjs";

let circle;
let rect;

export function renderBackground() {
    // background
    rect = rect || createElmt("rect");
    setMultipleAttr(rect, {
        width: viewWidth,
        height: viewHeight,
        fill: COLORS[1],
    });
    
    // circle
    const diameter = Math.min(viewWidth, viewHeight);
    circle = circle || createElmt("circle");
    setMultipleAttr(circle, {
        cx: viewWidth/2,
        cy: viewHeight/2,
        // r: diameter/2,
        stroke: "#222",
        "stroke-width": 8, 
        fill: "url(#stripePattern)",
    });
    
    const innerR = diameter * 0.47;
    const outerR = diameter * 0.48;
    animateAttr(circle, "r", [innerR, outerR, innerR], "8s");
}