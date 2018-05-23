var socket = io();

socket.on('connect', function () {
    console.log('Connected to the server');

    socket.emit('createMessage', {
        from: 'Saravanan',
        text: 'Hey , How are you '
    });


});

socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function () {
    console.log('newMessage',newMessage);
});

