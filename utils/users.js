/* jshint esversion: 6 */

class Users {
    constructor() {
        this.users = [];
    }

    // add a new user
    addUser(id, name, room) {
        var user = {
            id,
            name,
            room
        };
        this.users.push(user);
        return user;
    }

    // remove user by id and return it
    removeUser(id) {
        var user = this.getUser(id);
        
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    // get user by id and return it
    getUser(id) {
        var user = this.users.find((user) => user.id === id);
        return user;
    }

    // return users by room
    getUsersList(room) {
        var filteredUsers = this.users.filter((user) => user.room === room);
        var usersNames = filteredUsers.map((user) => user.name);
        return usersNames;
    }
}

module.exports = { Users };