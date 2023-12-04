/**
 * @param {*} value
 * @return {boolean}
 */
function isDate(value) {
    return value instanceof Date && !isNaN(value);
}

/**
 * @param {*} value
 * @return {boolean}
 */
function isTimestamp(value) {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * Formats a Date object or timestamp to a string in "YYYY-MM-DD" format
 * @param {Date | number} value
 * @return {?string}
 */
function formatDate(value) {
    const date = isTimestamp(value) ? new Date(value * 1000) : value;
    if (!isDate(date)) {
        return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * @param {Date} date
 * @return {?number}
 */
function dateToTimestampInSeconds(date) {
    if (!isDate(date)) {
        return null;
    }
    return Math.floor(date.getTime() / 1000);
}

export { formatDate, dateToTimestampInSeconds, isDate, isTimestamp };
