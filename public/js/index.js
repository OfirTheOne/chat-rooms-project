const socket = io();

let roomsSelect = $('#active-rooms');
let inputRoomName = $("input[name='room']")

socket.on('connect', () => {
    console.log('enterd to', window.location.href); 
});

socket.on('getRoomsNames', function (rooms) {

    if(rooms.length > 0) {
        let template = $('#room-option-template').html();
        let html = Mustache.render(template, { rooms });
        roomsSelect.html(html);
    }
});

/* Event Listening :: handler for selecting an option --> insert the value to the room input
 * */
roomsSelect.on('change', function(e) {
    let selectedOption = e.target.value;
    inputRoomName.val(selectedOption);
    roomsSelect.val('');
    console.log(selectedOption);


})


