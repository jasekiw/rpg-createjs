import {Resources} from "./Resources";
export function getTime() {
    var d = new Date();
    return d.getTime();
}

export function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}



export function getValueFromCss(pixels) {
    return Number(pixels.substring(0, pixels.indexOf('px')));
}
export function getLeftOfElement(elem) {
    return getValueFromCss(elem.style.left);
}
export function getTopOfElement(elem) {
    return getValueFromCss(elem.style.top);
}