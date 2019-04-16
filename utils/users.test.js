/* jshint esversion:6 */
const expect = require('expect');
const { Users } = require('./users');

describe('Users class-> utils/users.js', () => {
    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '88ryyuucds77ss8',
            name: 'John',
            room: 'Socket.io Course'
        }, {
            id: '34rrfgbvv78517h',
            name: 'Andrew',
            room: 'React.js Course'
        }, {
            id: '234ddfcxvb00oi8',
            name: 'Mike',
            room: 'Node.js Course'
        }, {
            id: '2erewtty34f00oi8',
            name: 'Sarah',
            room: 'Node.js Course'
        }];
    });

    it('should add a new user', () => {
        var users = new Users();
        var user = {
            id: '32crttyfgvg42',
            name: 'John',
            room: 'Socket.io Course'
        };

        users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should not add a new user', () => {
        var user = {
            id: '32crttyfgvg42',
            name: 'John',
            room: 'Socket.io Course'
        };

        var result = users.addUser(user.id, user.name, user.room);

        expect(result).toBeFalsy();
    });

    it('should return names for "Node.js Course" room', () => {
        var usersNames = users.getUsersList('Node.js Course');

        expect(usersNames).toEqual(['Mike', 'Sarah']);
    });

    it('should return names for "React.js Course" room', () => {
        var usersNames = users.getUsersList('React.js Course');

        expect(usersNames).toEqual(['Andrew']);
    });

    it('should find user with id "88ryyuucds77ss8"', () => {
        var user = users.getUser('88ryyuucds77ss8');

        expect(user.id).toEqual('88ryyuucds77ss8');
    });

    it('should not find user with id "yui98bbg56yr2ert"', () => {
        var user = users.getUser('yui98bbg56yr2ert');

        expect(user).toBeUndefined();
    });

    it('should find user with name "John"', () => {
        var user = users.getUserByNameInRoom('Socket.io Course', 'John');

        expect(user.name).toEqual('John');
    });

    it('should not find user with name "Mohllal"', () => {
        var user = users.getUserByNameInRoom('Socket.io Course', 'Mohllal');

        expect(user).toBeUndefined();
    });

    it('should remove user with id "88ryyuucds77ss8"', () => {
        var user = users.removeUser('88ryyuucds77ss8');
        var user_ = users.getUser('88ryyuucds77ss8');

        expect(user).not.toBeUndefined();
        expect(user_).toBeUndefined();

    });

    it('should not remove user with id "yui98bbg56yr2ert"', () => {
        var user = users.removeUser('yui98bbg56yr2ert');

        expect(user).toBeUndefined();
    });

    it('should return unique rooms names', () => {
        var roomsNames = users.getRoomsList();

        expect(roomsNames).toEqual(['Socket.io Course', 'React.js Course', 'Node.js Course']);
    });
});

