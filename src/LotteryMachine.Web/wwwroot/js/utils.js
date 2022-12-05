function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getDigitalCount(number) {
    const numStr = number.toString().trimEnd("0");
    const pointIndex = numStr.indexOf('.');
    return numStr.length - pointIndex - 1;
}

function getRandom(min, max) {
    let root = Math.random();
    return Number(Math.floor(root * (max - min) + min));
}
