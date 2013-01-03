//16354Mb = 200px
//13862Mb = x

$(function() {

    var socket = io.connect('http://localhost');

    socket.emit('moredata');

    socket.on('data', function(data) {
        var usedmempx = data.usedmem * 200 / data.totalmem;
        var nousedmempx = 200 - usedmempx;
        $(".usedmem").css({ height: usedmempx+'px', top: nousedmempx+'px' }).html(usedmempx);
        socket.emit('moredata');
    });

});