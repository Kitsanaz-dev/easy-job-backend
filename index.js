const { server, io } = require("./app")
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const PORT = 3000

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// Socket.IO connection handler moved to separate module
const initSocket = require('./socketio');
initSocket(io);
