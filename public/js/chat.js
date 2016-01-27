var socket = io();
var chatName = 'default';

$('#chat').hide()
$('#name-input').focus()

$('#name-form').submit(function() {
  chatName = $('#name-input').val();
  if (!chatName) {
    alert('Enter a chat name.');
    return false;
  }
  socket.emit('chat name', [chatName]);
  $('#name').detach();
  $('#chat').show();
  $('#chat-input').focus();
  $('#chatname').text('Posting as ' + chatName);
  return false;
});

$('#chat-form').submit(function() {
  var message = $('#chat-input').val();
  if (!message) {
    alert('Enter a message.');
    return false;
  }
  socket.emit('chat message', [chatName, message]);
  $('#chat-input').val('');
  return false;
});

socket.on('user connect', function(userName) {
  var listElement = $('<li>').addClass('list-group-item list-group-item-success');
  listElement.text(userName + ' connected');
  $('#messages').append(listElement);
});

socket.on('chat message', function(msg) {
  var name = msg[0];
  var message = msg[0] + ': ' + msg[1];
  var listElement = $('<li>').addClass('list-group-item');
  listElement.text(message);
  if (name == chatName) {
    listElement.addClass('list-group-item-info');
  }
  $('#messages').append(listElement);
});


socket.on('update user list', function(usedNames) {
  $('#connected-users').empty();
  for (var id in usedNames) {
    $('#connected-users').append($('<li>').text(usedNames[id]));
  }
});

socket.on('user disconnect', function(userName) {
  var listElement = $('<li>').addClass('list-group-item list-group-item-danger');
  listElement.text(userName + ' disconnected');
  $('#messages').append(listElement);
});

