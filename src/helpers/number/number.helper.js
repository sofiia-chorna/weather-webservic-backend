/**
 * return <number>
 */
function generateRandomOffset() {
    return Math.floor(Math.random() * 10);
}

/**
 * @params {number} value
 * @params {number} offset
 * return <number>
 */
function addOffset(value, offset) {
    return Number((value + offset).toFixed(2));
}

export { generateRandomOffset, addOffset };
