/* jshint esversion: 6 */
const socket = io();

socket.on("connect", () => {
    console.log('Connected successfully');
});

socket.on("disconnect", () => {
    console.log('Disconnected successfully');
});