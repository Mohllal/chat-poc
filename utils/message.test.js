/* jshint esversion: 6 */
const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage -> utils/message.js', () => {
    it('should generate correct message object', () => {
        var from = 'jhon';
        var text = 'Hey buddy ...';
        var message = generateMessage(from, text);

        expect(message).toMatchObject({from, text});
        expect(message.createdAt).toBeDefined();
    });
});

describe('generateLocationMessage -> utils/message.js', () => {
    it('should generate correct location message object', () => {
        var from = 'jhon';
        var latitude = '30.055996399999998';
        var longitude = '31.397441399999998';
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        var locationMessage = generateLocationMessage(from, latitude, longitude);

        expect(locationMessage).toMatchObject({from, url});
        expect(locationMessage.createdAt).toBeDefined();
    });
});