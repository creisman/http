window.onload = function() {
  var server = new http.Server(http.Server.Addresses.ALL, 8080);
  var def = server.start();

  def.addCallbacks(function() {
    document.body.innerHTML = 'Successfully listened on socket';
  }, function() {
    document.body.innerHTML = 'Failed to listen on socket';
  });
};
