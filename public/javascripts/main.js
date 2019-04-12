/* jshint esversion: 6 */
const socket = io();

socket.on("connect", () => {
    console.log('Connected successfully');

    socket.emit("createMessage", {
        from: 'Andrew',
        text: "Hey. Where are you?",
        createdAt: Date.now()
    });
});

socket.on("disconnect", () => {
    console.log('Disconnected successfully');
});

socket.on("newMessage", (message) => {
    console.log('New message: ', message);
});