const expect = require('expect');

const { Users, User } = require('./users');

let users;
beforeEach(() => {
    users = new Users();

    users.addUser(new User(12, 'jon', 'room01'));
    users.addUser(new User(35, 'mik', 'room01'));
    users.addUser(new User(7, 'mary', 'room02'));
});

describe('users', () => {
    it('should add a new user', () => {
        
        let user = new User(2, 'jenny', 'room03');
        let resUser = users.addUser(user);

        expect(users.getUser(user.id)).toBe(user); // user in the collection
        expect(users.usersCollection.size).toBe(4); // there are 4 users
        expect(resUser).toBe(user); // same user has returned 
    });

    it('should remove a user', () => {
        
        let uid = 35;
        let resUser = users.removeUser(uid);

        expect(users.getUser(uid)).toBeFalsy(); // user not in the collection
        expect(users.usersCollection.size).toBe(2); // there are 2 users
        expect(resUser.id).toBe(uid); // same user has returned 
    });

    it('should get a user', () => {
        
        let uid = 12;
        let userName = 'jon';
        let resUser = users.getUser(uid);

        expect(resUser.id).toBe(uid); // returned user with same id
        expect(resUser.name).toBe(userName); // returned user with same name
    });

    it('should return all and only users name in the room', () => {
        
        let room = 'room01';
        let expectedUsersList = ['jon', 'mik'];
        let actualUsersList = users.getUsersList(room);
        
        expect(actualUsersList).toEqual(expect.arrayContaining(expectedUsersList)); // returnd users list comtain all expected users
        expect(actualUsersList.length).toBe(2); // the only two users expected has been returned
    });

    it('should return true for existing username in collection', () => {

        let userName = 'jon';

        expect(users.isUserNameExists(userName)).toBeTruthy();
    });

    it('should return false for nonexisting username in collection', () => {

        let userName = 'jim';
        
        expect(users.isUserNameExists(userName)).toBeFalsy();
    });


});


