/**
 * @param {Array<!Object>} array
 * @param {string} key
 * @return {Array<!Object>}
 */
function getUniqueByKey(array, key) {
    const uniqueMap = new Map(array.map((item) => ([item[key], item])));
    return Array.from(uniqueMap.values());
}

export { getUniqueByKey };
