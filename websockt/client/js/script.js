
$('#init').on('click', function(){
    // socket = io.connect();
    
    // var options = {
    //   otherUserID: 2  //the userID of the user you are trying to contact.
    // };
    
    // socket.emit('connect_to_other', options);
    init();
});


//v.2 - delete
function init(){    
    
var socket = io.connect();


$('#connect').on('click', function(e){
    e.preventDefault();
    var options = {
      otherUserID: 2  //the userID of the user you are trying to contact.
    };
    
    socket.emit('connect_to_other', options);
    // return false;
});

$('#chat').on('click', function(e){
    e.preventDefault();
    var msg = $('#input1').val();
    $('#input1').val('');
    socket.emit('chat message', msg)
});

socket.on('connect', function(){
    console.log('user connected client side');
    
    socket.on('open chat window',function(success){
        if(success){
            $('#chat_window').removeClass('none').prepend('<p>Chat with userID ' + success.otherUserID + ':');
        }
    });
    
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text('User ' + msg.userID + ': ' + msg.msg)); 
    });
    
    socket.on('call to join', function(msg){
      socket.emit('join request user room', msg);    
    });
});


}


//reset
// var userID = Math.ceil(Math.random()*10000);

// var socket = io.connect();
    
// $('form').submit(function(){
    
//     var options = {
//       input: $('#input1').val(),
//       userID: userID
//     };
    
//     // socket.emit('log in', options);
    
//     socket.emit('chat message', options);
//     $('#input1').val('');
//     return false;
// });

// socket.on('connect', function(){
//     console.log('user connected client side');
    
//     socket.on('chat message', function(msg){
//         $('#messages').append($('<li>').text(msg.input)); 
//     });
// });

