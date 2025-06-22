const express = require('express');
const { chats } = require('./data/data.js');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const messageRoutes = require('./routes/messageRoutes.js');
const path = require('path');

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // for parsing application/json


app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// ---------------------Deployment---------------------

// const __dirname1 = path.resolve();
// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname1, 'frontend/build')));
// } else {
//     app.get('/', (req, res) => {
//         res.send('API is running successully! 🍻');
//     });
// }


//-----------------------------------------------------

app.use(notFound);
app.use(errorHandler);

// app.get('/api/chat', (req, res) => {
//     res.send(chats);
// });

// app.get('/api/chat/:id', (req, res) => {
//     // console.log(req.params.id);
//     const singleChat = chats.find(c => c._id === req.params.id);
//     if (singleChat) {
//         res.send(singleChat);
//     } else {
//         res.status(404).send({ message: 'Chat not found' });
//     }
// });

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ✅`.yellow.bold)
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        // origin: "http://localhost:3000",
        // methods: ["GET", "POST"],
        // credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log(`Connected to socket.io`.green.bold);

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(`User ${userData._id} connected`.blue.bold);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`.blue.bold);
    });

    socket.on('typing', (room) => {
        socket.in(room).emit('typing');
    });

    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing');
    });

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit('message received', newMessageReceived);
        });
    });

    socket.off('setup', () => {
        console.log('User disconnected from socket.io'.red.bold);
        socket.leave(userData._id);
    });
});
