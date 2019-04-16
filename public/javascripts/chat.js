/* jshint esversion: 6 */
const socket = io();

function scrollToBottom() {
    // selectors
    var messages = jQuery('#messages');  
    var newMessage = messages.children('li:last-child');

    // heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight =  messages.prop('scrollHeight');

    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

/*
** Socket.io logic goes here ..
*/

socket.on("connect", () => {
    console.log('Connected successfully');

    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, (error) => {
        if (error) {
            alert(error);
            window.location.href = "/";
        }
        else {
            console.log("Successfully join the room!");
        }
    });
});

socket.on("disconnect", () => {
    console.log('Disconnected successfully');
});

socket.on("newMessage", (message) => {
    $.get('/templates/templates.html', function(templates) {
        // fetch the <script /> block from the loaded external
        // template file which contains the message-template template.
        var template = $(templates).filter('#message-template').html();
        var formattedTime = moment(message.createdAt).format("h:mm a");
        
        $('#messages').append(Mustache.render(template, { 
            text: message.text,
            from: message.from,
            time: formattedTime
        }));

        scrollToBottom();
        console.log('New message: ', message);
    });
});

socket.on("newLocationMessage", (message) => {
    $.get('/templates/templates.html', function(templates) {
        // fetch the <script /> block from the loaded external
        // template file which contains the location-message-template template.
        var template = $(templates).filter('#location-message-template').html();
        var formattedTime = moment(message.createdAt).format("h:mm a");
        
        $('#messages').append(Mustache.render(template, { 
            url: message.url,
            from: message.from,
            time: formattedTime
        }));

        scrollToBottom();
        console.log('New location message: ', message);
    });
});

socket.on('updateUsersList', (users) => {

    $.get('/templates/templates.html', function(templates) {
        // fetch the <script /> block from the loaded external
        // template file which contains the message-template template.
        var template = $(templates).filter('#user-template').html();
        Mustache.parse(template);
        
        var ol = jQuery('<ol></ol>');
        users.forEach((userName) => {
            ol.append(Mustache.render(template, { name: userName }));
        });
        console.log(ol);
        jQuery('#users').html(ol);

        console.log('Updating users lists: ', users);
    });
});

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    
    var messageTextBox = jQuery('#message');
    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, (data) => {
        messageTextBox.val('');
        console.log(data);
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if (!("geolocation" in navigator)) {
        /* geolocation IS NOT available */
        return alert('Your browser does not support geolocation...');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Send location');
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, (error) => {
        locationButton.removeAttr('disabled').text('Send location');
        
        alert('Can not fetch your location...');
        console.log(error);
    });
});