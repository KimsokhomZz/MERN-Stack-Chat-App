const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel.js');
const User = require('../models/userModel.js');
const Chat = require('../models/chatModel.js');

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        res.status(400);
        throw new Error('Invalid data passed into request');
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate('sender', 'name pic');
        message = await message.populate('chat');
        message = await User.populate(message, { path: 'chat.users', select: 'name pic email' });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.status(201).json(message);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to create message');
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name pic email')
            .populate('chat');
        
        res.status(200).json(messages);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to retrieve messages');
    }
});

module.exports = { sendMessage, allMessages };