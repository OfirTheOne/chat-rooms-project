class User {
    constructor(id, name, room) {
        this.name = name;
        this.room = `${room}`.toLowerCase();
        this.id = id;

        this.copy = ()=> {
            return new User(this.id, this.name, this.room);
        }
    }
}

class Users {

    constructor() {
        this.usersCollection = new Map();
    }

    addUser(user) {
        if (!this.isUserNameExists(user.name)) {
            this.usersCollection.set(user.id, user);
            return user;
        }
    }

    getUser(id) {
        return this.usersCollection.get(id);
    }

    removeUser(id) {
        let user = this.usersCollection.get(id);
        this.usersCollection.delete(id);
        console.log('removeUser', user);
        return user;
    }

    getUsersList(room) {
        return Array.from(this.usersCollection)
            .filter((elem) => {
                return elem[1].room === room;
            })
            .map((elem) => {
                return elem[1].name;
            });

    }

    isUserNameExists(userName) {
        let res = Array.from(this.usersCollection).find((elem) => {
            return elem[1].name === userName;
        });
        return res !== undefined;
    }

    getRoomsList() {
        let roomsList = Array.from(this.usersCollection)
            .map((elem) => {
                return elem[1].room;
            });
            console.log(roomsList);    
            
            let uniquRoomList = this.removeDuplicates(roomsList);
            console.log(uniquRoomList);    
        return uniquRoomList;
    }

    removeDuplicates(arrArg) {
        return arrArg.filter((elem, pos, arr) => {
            return arr.indexOf(elem) === pos;
        });
    }
    
}

module.exports = { Users, User }