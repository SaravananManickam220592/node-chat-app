var socket = io();

socket.on('connect', function () {
    console.log('Connected to the server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function (newMessage) {
    var li = $('<li></li>');
    li.text(`${newMessage.from} : ${newMessage.text}`);
    $("#messages").append(li);
});

socket.on('newLocationMessage', function (message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My Current Location</a>')
    li.text(`${message.from} : `);
    a.attr('href',message.url);
    li.append(a);
    $("#messages").append(li);
});

$('#message-form').on('submit', function (e) {

    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: $("[name=message]").val()
    }, function () {

    });
});

var locationButton = $('#sendLocation');

locationButton.on('click', function (e) {
    if(!navigator.geolocation){
        return alert('Geolocation not supported in your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            latitude : position.coords.latitude,
            longtitude : position.coords.longitude
        })
    },function(){
        return alert('Unable to Fetch location');
    });
});