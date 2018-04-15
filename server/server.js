const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation')
const { Users, User } = require('./utils/users');

// system configs
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// menage the users in the system
var users = new Users();

// middleware for the path of the static front-end files 
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log(`path :${socket.nsp.name}`);

    // ****** in question, is it best practice ?! ******
    // only if the socket been sent from the join page // from the pat '/'
    // if so, emit the event 'getRoomsNames', and sending the rooms list to the client
    if (socket.nsp.name === '/') {
        io.emit('getRoomsNames',  users.getRoomsList());
    }    

    /* Event Listening :: handler for user tring to join a chat room
     * */
    socket.on('join', (params, callback) => {

        // validate entering params
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Invalid name or room.');
        } else if(users.isUserNameExists(params.name)) {
            return callback('User name exists.');
        }

        // console connection
        console.log('New user connected');
        // join the current socket to all the soket with a param room with the value --> params.room
        socket.join(params.room);
        // if the same user alraedy in the user collection -> removing him 
        users.removeUser(socket.id);
        // adding the user to the user collection
        users.addUser(new User(socket.id, params.name, params.room));
        // updating the users list only, sending only to the sockets with a param room with the value --> params.room
        io.to(params.room).emit('updateUserList', users.getUsersList(params.room));
        // alert all user but the new one, that a new user connected
        socket.broadcast.to(params.room).emit('newMessage', generateMessage(
            'Admin',
            `User ${params.name} as join.`,
        ));

        // welcome user only
        socket.emit('newMessage', generateMessage(
            'Admin',
            `${params.name}, welcome to chat app`,
        ));


    });

    /* Event Listening :: handler for user creating new messages.
     ****  if valid message, emiting newMessage event, and sending to all users the new 
     ****  created message.
     * */
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage event', message);

        // fetch user by is id / his socket id
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
              // sending to all user in the room the new created message
            io.to(user.room).emit('newMessage', generateMessage(
                user.name,
                message.text
            ));
        }
        callback('server');        
    });

    /* Event Listening :: handler for user sending location messages.
     ****  if valid message, emiting newLocationMessage event sending to all
     ****  users the new created message.
     * */
    socket.on('createLocationMessage', (coords) => {
        console.log('event : createLocationMessage');
        let user = users.getUser(socket.id);
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(
                user.name,
                coords.latitude,
                coords.longitude
            ));
        }
    })

    /* Event Listening :: handler for user disconnect from system / close chat room page.
     ****  remove the user from the users coolection by his socket id.
     ****  emiting updateUserList event, to update the users list in the room.
     ****  emiting newMessage, sending to ll the users in that room a user as left.
     * */
    socket.on('disconnect', () => {
        //****** in question, is it best practice ?! ******
        // only if the socket been sent from the join page // from the pat '/'
        if (socket.nsp.name === '/') {
            console.log('user was disconnected');
            let user = users.removeUser(socket.id);
            if (user) {
                io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
                io.to(user.room).emit('newMessage', generateMessage(
                    'Admin',
                    `${user.name} has left the chat room.`
                ));
            }
        }
    });
});


server.listen(port, () => {
    console.log(`server on port ${port}`);
});