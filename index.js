const { server, io } = require("./app")

const PORT = 3000

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});