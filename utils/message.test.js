/* jshint esversion: 6 */
const expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage -> utils/message.js', () => {
    it('should generate correct message object', () => {
        var from = 'jhon';
        var text = 'Hey buddy ...';
        var message = generateMessage(from, text);

        expect(message).toMatchObject({from, text});
        expect(message.createdAt).toBeDefined();
    });
});