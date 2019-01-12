var log = require('./dev-logger.js');

module.exports = function(server, origins) {
    log("Running socket.io server");
    var io = require('socket.io').listen(server);

    if (origins) {
        io.set("origins", "*:*");
    }

    io.on('connection', function(socket) {
        log('connected');

        socket.on('joinBoard', function(boardId) {
            log('joined board: ' + boardId);
            socket.join(boardId);
        });

        socket.on('leaveBoard', function(boardId) {
            log('left board: ' + boardId);
            socket.leave(boardId);
        });

        socket.on('addCard', function(data) {
            log('addCard: ', data);
            socket.broadcast.to(data.boardId)
                .emit("addCard", data);
        });

        socket.on('updateCard', function({ boardId, card, changeOrder }) {
            log('updateCard: ', { boardId, changeOrder, card });
            if(!changeOrder) {
              socket.broadcast.to(boardId)
                .emit("updateCard", card);
            }
        });

        socket.on('disconnect', function() {
            log('disconnecting');
        });
    });
};
