/**
 * @params {*} date
 * return <boolean>
 */
function isDate(value) {
    return value instanceof Date && !isNaN(value);
}

/**
 * @params {*} date
 * return <boolean>
 */
function isTimestamp(value) {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * @params {Date | number} date
 * return <?string>
 */
function formatDate(value) {
    const date = isTimestamp(value) ? new Date(value * 1000) : value;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * @params {Date} date
 * return <?string>
 */
function getTimestampInSeconds(date) {
    if (!isDate(date)) {
        return null;
    }
    return Math.floor(date.getTime() / 1000);
}

export { formatDate, getTimestampInSeconds };
