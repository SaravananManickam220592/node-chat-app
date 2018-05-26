var socket = io();

function scrollToBottom(){
    var messages = $("#messages");
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight >=scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    var params=$.deparam(window.location.search);

    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href='/'
        }else{
            console.log('No Error');
        }
    });
});

socket.on('disconnect', function () {
    var user = users.removeUser(socket.id);
    if(user){
        io.to(user.room).emit('updateUserList',users.getUserList(user.room));
        io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
    }
});

socket.on('updateUserList', function(users){
    var ol = $('<ol></ol>');
    users.forEach(function(user){
        ol.append($("<li></li>").text(user));
    });

    $('#users').html(ol);
})

socket.on('newMessage', function (newMessage) {
    var formatedTime = moment(newMessage.createdAt).format('h:mm a');
    var template = $("#messageTemplate").html();
    var html = Mustache.render(template,{
        text : newMessage.text,
        from : newMessage.from,
        createdAt : formatedTime
    });
    $("#messages").append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (newMessage) {
    var formatedTime = moment(newMessage.createdAt).format('h:mm a');
    var template = $("#locationMessageTemplate").html();
    var html = Mustache.render(template,{
        url : newMessage.url,
        from : newMessage.from,
        createdAt : formatedTime
    })
    $("#messages").append(html);
    scrollToBottom();
});



$('#message-form').on('submit', function (e) {

    var messageTextBox = $("[name=message]");

    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    });
});

var locationButton = $('#sendLocation');

locationButton.on('click', function (e) {
    if(!navigator.geolocation){
        return alert('Geolocation not supported in your browser');
    }

    locationButton.attr('disabled','disabled').text('Sending Location ..');

    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            latitude : position.coords.latitude,
            longtitude : position.coords.longitude
        })
        locationButton.removeAttr('disabled').text('Send Location');
    },function(){
        locationButton.removeAttr('disabled').text('Send Location');
        return alert('Unable to Fetch location');
    });
});