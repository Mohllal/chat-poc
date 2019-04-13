/* jshint esversion: 6 */

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: Date.now()
    };
};

module.exports = { generateMessage }