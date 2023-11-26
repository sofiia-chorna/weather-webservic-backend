/**
 * Generates a random offset between 0 and 9 (inclusive)
 * @return {number}
 */
function generateRandomOffset() {
    return Math.floor(Math.random() * 10);
}

/**
 * @param {number} value
 * @param {number} offset
 * @return {number}
 */
function addOffset(value, offset) {
    return Number((value + offset).toFixed(2));
}

export { generateRandomOffset, addOffset };
