
export function getTime() {
    return (new Date()).getTime();
}

export function padLeft(number) {
    const str = "" + number;
    const pad = "00";
    return pad.substring(0, pad.length - str.length) + str
}
