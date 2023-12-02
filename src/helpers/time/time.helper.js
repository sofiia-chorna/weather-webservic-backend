/**
 * @param {string} offsetString
 * @return {number}
 */
function offsetStringToNumber(offsetString) {
    // Get numbers from string value
    const [hours, minutes] = offsetString.split(':');
    const hoursValue = parseInt(hours, 10);
    const minutesValue = parseInt(minutes, 10);

    // Calculate the total offset in minutes
    const totalOffsetMinutes = hoursValue * 60 + minutesValue;

    // Return the total offset in hours
    return totalOffsetMinutes / 60;
}

export { offsetStringToNumber };
