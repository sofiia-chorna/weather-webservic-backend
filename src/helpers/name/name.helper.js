/**
 * @param {string} code
 * return {string}
 */
function getCountryNameByCode(code) {
    try {
        const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
        return regionNames.of(code);
    } catch (error) {
        console.error('Error getting country name:', error);
        return 'Country name not found';
    }
}

export { getCountryNameByCode };
