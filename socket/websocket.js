// socket/websocket.js
// IMPORTING THE NECESSARY PACKAGES -------------
const soc = require('socket.io');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// Exposing the model to rest of our app
module.exports = (server, app) => {

    // listening to port
    let io = soc.listen(server);

    // To keep active user
    let activeUsers = [];

    io.on('connection', (socket) => {

        // Temporaryly delete the socket until token is provided
        delete io.sockets.connected[socket.id];

        let auth_timeout = setTimeout(() => {
            socket.emit('unauthorized');
            socket.disconnect();
        }, 5000);

        socket.on('authenticate', (data) => {
            if (!data.token) {
                return;
            }
            jwt.verify(data.token, app.get('superSecret'), (err, decoded) => {
                if (err) {
                    throw err;
                }
                if(!decoded) {
                	return false;
                }
                let acU = _.find(activeUsers, (usr) => {
                	if(usr._id === decoded._doc._id) {
                		return true;
                	}
                	return false;
                });
                if (decoded && !acU) {
                    let user = decoded._doc;
                    user.socket_id = socket.id;
                    let actUser = [];
                    clearTimeout(auth_timeout);
                    io.sockets.connected[socket.id] = socket;
                    decoded
                    //actUser = findActiveFriends(activeUsers, user);
                    activeUsers.push(user);
                    io.emit('active:User', activeUsers);

                    socket.on('active:User', (usr) => {
                    	socket.emit('active:User', usr);
                    });

                    socket.on('message', (msg) => {
                    	let usr  = _.find(activeUsers, (u) => {
                    		if(u.socket_id === socket.id) {
                    			return true;
                    		}
                    		return false;
                    	});
                        let u = null;
                        if(usr.local.username) {
                            u = usr.local.username;
                        }
                        else {
                            u = usr.local.email;
                        }
                        console.log(u);
                    	io.emit('message', {msg: msg, user: u});
                    });

                    socket.emit('current:User', user);


                    socket.on('disconnect', () => {
                        let a = _.findIndex(activeUsers, (usr) => {
                            if (usr.socket_id === socket.id) {
                                return true;
                            }
                            return false;
                        });
                        let disconnectUser = activeUsers[a];
                        if (a !== -1) {
                            activeUsers.splice(a, 1);
                        }
                        socket.broadcast.emit('user:disconnect', disconnectUser);
                    });

                    socket.on('user:disconnect', (a) => {
                    	socket.emit('user:disconnect', a);
                    });
                }
            });
        });
    });
}

function findActiveFriends(activeUser, user) {

    let aU = [];

    for (let i = 0; i < activeUser.length; i++) {
        for (let j = 0; j < activeUsers[i].friends.length; j++) {
            for (let k = 0; k < user.friends.legnth; k++) {
                if (activeUsers[i].friends[j] === user.friends[k]) {
                    aU.push(activeUsers[i]);
                }
            }
        }
    }

    return aU;
}
