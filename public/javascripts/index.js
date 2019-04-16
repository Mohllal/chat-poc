/* jshint esversion: 6 */
const socket = io();

/*
** Socket.io logic goes here ..
*/
socket.on("connect", () => {
    console.log('Connected successfully');
});

socket.on("disconnect", () => {
    console.log('Disconnected successfully');
});

socket.on('updateRoomsDropDown', (rooms) => {

    $.get('/templates/templates.html', function(templates) {
        // fetch the <script /> block from the loaded external
        // template file which contains the room-template template.
        var template = $(templates).filter('#room-template').html();
        Mustache.parse(template);
        
        var datalist = jQuery('#roomName');
        datalist.empty();
        rooms.forEach((roomName) => {
            datalist.append(Mustache.render(template, { room: roomName }));
        });

        console.log('Updating rooms list: ', rooms);
    });
});