
var socket = io();


// dom elements 
var messageList = $( '#messages-list' );
var locationButton = $( '#send-location' );
var userSideBar = $( '#users' );

socket.on('connect', () => {
    console.log('connected to server');
    let urlQuery = window.location.search;
    let params = $.deparam(urlQuery);
    console.log(params);
    socket.emit('join', params, function(err) {
        if(err) {
            window.location.href = '/';
            alert(err);
        } else {
        console.log('No error');
        }
    });
});

/* Event Listening :: handler for new message send by a user in the room or admin,
 ****  after passing through the server.
 ****  rendering the new message using mustache
 * */
socket.on('newMessage', (message) => {
    console.log('newMessage event', message);
    let formatedTimestamp = moment(message.createAt).format('h:mm a');
    var template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from, 
        createAt: formatedTimestamp
    });
    messageList.append(html);
    scrollToButton();
});

/* Event Listening :: handler for new location message send by a user in the room,
 ****  after passing through the server.
 ****  rendering the new location message using mustache
 * */
socket.on('newLocationMessage', (message) => {
    console.log('event - newLocationMessage');
    let formatedTimestamp = moment(message.createAt).format('h:mm a')
    var template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from, 
        createAt: formatedTimestamp
    })
    messageList.append(html);
    scrollToButton();
});

/* Event Listening :: handler for updating the users list in a current chat room.
 **** rendering the updated users list using mustache
 * */
socket.on('updateUserList', (users) => {
    console.log('event - updateUserList', users);
    var template = $('#user-template').html();
    let html = Mustache.render(template, { users });
    
    userSideBar.html(html);

});

socket.on('disconnect', () => {
    console.log('disconnected from server');
});

// **** view  handling****


/* Event Listening :: handler for clicking on send location button 
 ****  1. check if user browser support geolocation.
 ****  2. disableing the send location button, setting text to 'sending location'.
 ****  3. fething location data view navigator.geolocation API, 
 ****  4. geolocation data return successfully - emiting createLocationMessage event .
 ****  5. undisableing the send location button, setting text to 'send location'.
 * */
locationButton.on('click', function(e) {
    e.preventDefault();
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    locationButton.attr('disabled', 'disabled').text('sending location');

    navigator.geolocation.getCurrentPosition(function (postion) {
        console.log(postion);
        socket.emit('createLocationMessage', {
            latitude: postion.coords.latitude, 
            longitude: postion.coords.longitude 
        });
        locationButton.removeAttr('disabled').text('send location');
    }, function() {
        alert('Unable to fetch location.')
    })
})

/* Event Listening :: handler for submiting 'message-form' form 
 ****  1. get the input value.
 ****  2. emiting createMessage event with the message data.
 ****  3. event data send successfully - setting the input value to ''. 
 * */
$( '#message-form' ).on('submit', function (e) {
    e.preventDefault();
    
    let messageInput = $( '#message-form' ).find('input[name=message]'); 
    let msg = messageInput.val();

    socket.emit('createMessage', {
        text: msg
    }, function (data)  {
        messageInput.val('');
        console.log(`got it - ${data}`);
    });
});

// auto scroll functionality
function scrollToButton() {
    let newMessage = messageList.children('li:last-child'); // last / new message added

    let scrollHeight = messageList.prop('scrollHeight');  // total scroll / page height
    let clientHeight = messageList.prop('clientHeight'); // cur user visible page hight
    let scrollTop = messageList.prop('scrollTop'); // distans for current hight of page to the start of page 
    let newMessageHeight = newMessage.innerHeight(); // innerHeight = height of element including padding but not border  
    let secLastMessageHeigth = newMessage.prev().innerHeight(); 

    let h = clientHeight + scrollTop + newMessageHeight + secLastMessageHeigth;
    if (h >= scrollHeight) {
        messageList.scrollTop(scrollHeight);
    }
}
