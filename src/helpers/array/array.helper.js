/**
 * @param {Array<!Object>} array
 * @param {string} key
 * @return {Array<!Object>}
 */
function getUniqueByKey(array, key) {
    const uniqueMap = new Map(array.map((item) => ([item[key], item])));
    return Array.from(uniqueMap.values());
}

/**
 * @param {Array<!Object>} array
 * @param {function(!Object)} getKey
 * @return {Array<!Object>}
 */
function getUniqueBy(array, getKey) {
    const uniqueMap = new Map(array.map((item) => [getKey(item), item]));
    return Array.from(uniqueMap.values());
}

export { getUniqueByKey, getUniqueBy };
