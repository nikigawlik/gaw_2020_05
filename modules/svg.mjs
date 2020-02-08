export let svgElement;
export let xmlns; // xml namespace
export let viewHeight;
export let viewWidth;

export function init() {
    let main = document.querySelector("main");
    if(main.querySelector("svg")) {
        svgElement = main.querySelector("svg");
        xmlns = svgElement.getAttribute("xmlns");
    } else {
        xmlns = "http://www.w3.org/2000/svg";
        svgElement = document.createElementNS(xmlns, "svg");
    }
    
    let updateSize = () => {
        viewWidth = window.innerWidth;
        viewHeight = window.innerHeight;
        svgElement.setAttributeNS(null, "viewBox", "0 0 " + viewWidth + " " + viewHeight);
        svgElement.setAttributeNS(null, "width", viewWidth);
        svgElement.setAttributeNS(null, "height", viewHeight);
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    svgElement.setAttributeNS(null, "stroke", "black");
    svgElement.setAttributeNS(null, "fill", "none");
    svgElement.setAttributeNS(null, "pointer-events", "none");
    // cableElement.setAttributeNS(xmlns, "stroke-width", "1");
    svgElement.style.display = "block";

    // main.insertBefore(svgElement, main.querySelector(".node-area"));
    main.append(svgElement);
}

export function createElmt(tagName, attributes={}, appendNow=true) {
    let element = document.createElementNS(xmlns, tagName);
    if(attributes) setMultipleAttr(element, attributes);
    if(appendNow) addElmt(element);
    return element;
}

export function setMultipleAttr(element, attributes) {
    for(let propName in attributes) {
        setAttr(element, propName, attributes[propName]);
    }
}

export function setAttr(element, attributeName, value) {
    element.setAttributeNS(null, attributeName, value);
}

export function getAttr(element, attributeName) {
    return element.getAttributeNS(null, attributeName);
}

export function removeAttr(element, attributeName) {
    element.removeAttributeNS(element, attributeName);
}

export function addElmt(element){
    svgElement.append(element);
}

export function animateAttr(element, attributeName, values, duration, repeatCount="indefinite") {
    if(Array.isArray(values)) {
        values = values.join(";");
    }
    if(!isNaN(duration)) {
        duration = `${duration}s`;
    }
    let anim = createElmt("animate", { 
        attributeName: attributeName,
        values: values,
        dur: duration,
        repeatCount: repeatCount,
        // calcMode: "paced",
        begin: "indefinite",
    });
    element.append(anim);
    anim.beginElement();
}

export function clearAnimateAttr(element) {
    let animateElements = element.querySelectorAll("animate, animateTransform");
    for(let element of animateElements) {
        element.remove();
    }
}